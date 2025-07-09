import { Request, Response } from "express";
import { User } from "../models/user.model";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { safeJsonParse } from "../utils/safeJsonParse";
import { Multer } from "multer";
import { validateImage } from "../utils/ImageValidation";
import { hashPassword } from "../utils/hashPassword";


export const createUser = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const {
      username,
      password,
      email,
      role,
      personalInfo,
      education,
      skills,
      resume,
      projects,
      workExperience,
      jobpreferences,
      certifications,
      achievements,
      stats,
      contact,
    } = req.body;
    console.log("body",req.body)

    // 🌟 Required Field Validations
    if (!username || !password || !email) {
      return res.status(400).json({ message: "username, password, email are required" });
    }

    if (!personalInfo) {
      return res.status(400).json({ message: "personalInfo is required" });
    }

    // ✅ Safe parsing
    const parsedPersonalInfo = safeJsonParse(personalInfo);
    const parsedEducation = safeJsonParse(education);
    const parsedSkills = safeJsonParse(skills);
    const parsedProjects = safeJsonParse(projects);
    const parsedWorkExperience = safeJsonParse(workExperience);
    const parsedJobPreferences = safeJsonParse(jobpreferences);
    const parsedCertifications = safeJsonParse(certifications);
    const parsedAchievements = safeJsonParse(achievements);
    const parsedStats = safeJsonParse(stats);
    const parsedContact = safeJsonParse(contact);
    const parsedResume = safeJsonParse(resume);

    // 🌟 Validate Personal Info Fields
    if (!parsedPersonalInfo.name) return res.status(400).json({ message: "name is required" });
    if (!parsedPersonalInfo.age) return res.status(400).json({ message: "age is required" });

    // 🌟 Validate Images
    const profileImage = files.profileImage?.[0];
    const bannerImage = files.bannerImage?.[0];
    const resumeFile = files.resumeFile?.[0];
    console.log("profileImage",profileImage)
    console.log("bannerImage",bannerImage)
    console.log("resumeFile",resumeFile)

     validateImage(profileImage, false);
     validateImage(bannerImage, false);
     validateImage(resumeFile, false);

    const uploadedUrls: Record<string, string> = {};

    // ✅ Upload images
    if (profileImage) {
      uploadedUrls.profileImage = await uploadToCloudinary(profileImage.buffer, "quickhire/profile-images");
    }

    if (bannerImage) {
      uploadedUrls.bannerImage = await uploadToCloudinary(bannerImage.buffer, "quickhire/banner-images");
    }

    if (resumeFile) {
      uploadedUrls.resumeFile = await uploadToCloudinary(resumeFile.buffer, "quickhire/resumes");
    }
    const hashedPassword = await hashPassword(password);
    // ✅ Create User Document
    const newUser = new User({
      name: parsedPersonalInfo.name,
      email,
      userName: username,
      password:hashedPassword,
      role,
      age: parsedPersonalInfo.age,
      gender: parsedPersonalInfo.gender,
      location: parsedPersonalInfo.location,
      about: parsedPersonalInfo.about,
      professionalSummary: parsedPersonalInfo.professionalSummary,
      title: parsedPersonalInfo.title,
      avtar: uploadedUrls.profileImage,
      banner: uploadedUrls.bannerImage,

      education: parsedEducation,
      skills: parsedSkills.skills,
      softSkills: parsedSkills.softSkills,
      hobbies: parsedSkills.hobbies,
      languages: parsedSkills.languages,
      domains: parsedSkills.domains,

      workExperience: parsedWorkExperience,
      projects: parsedProjects,
      certifications: parsedCertifications,
      achievements: parsedAchievements,
      githubStats: parsedStats.githubStats,
      leetcodeStats: parsedStats.leetcodeStats,

      contact: {
        email: parsedContact.email,
        phone: parsedContact.phone,
        linkedin: parsedContact.linkedin,
        github: parsedContact.github,
        portfolio: parsedContact.portfolio,
      },

      resume: {
        resumeVideoUrl: parsedResume,
        resumeURL: uploadedUrls.resumeFile,
      },

      preferredRoles: parsedJobPreferences.preferredRoles,
    });

    // ✅ Save to DB
    await newUser.save();

    // ✅ Response
    res.status(201).json({
      message: "User profile created successfully ✅",
      uploadedUrls,
      userId: newUser._id,
    });
  } catch (err) {
    console.error("Error creating user profile:", err);
    res.status(500).json({ message: "Server Error", error: err });
  }
};

