
import { User } from "../models/user.model";
import { uploadToCloudinary } from "./uploadToCloudinary";
import { safeJsonParse } from "./safeJsonParse";
import { Multer } from "multer";
import { validateImage } from "./ImageValidation";
import { hashPassword } from "./hashPassword";
import { generateToken } from "./jsonWebTokenGenrate";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
export const createUserWithFormData = async (
  req: Request,
  res: Response,
  provider: "manual" | "google",
  googleData?: { sub: string; picture: string,name:string ,email:string }
) => {
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

    console.log("createUserWithFormData",req.body)

    if (provider === "manual") {
      if (!email) {
        return res.status(400).json({ message: "Email is required for manual signup" });
      }
      if (!password) {
        return res.status(400).json({ message: "Password is required for manual signup" });
      }
    }
    
    if (provider === "google") {
      if (!googleData?.email) {
        return res.status(400).json({ message: "Google account email is required" });
      }
    }
    
    const finalEmail = provider === "manual" ? email : googleData?.email;

    const existingUser = await User.findOne({ email: finalEmail });
    
    if (existingUser) {
      if (existingUser.provider !== provider) {
        return res.status(400).json({
          message:
            provider === "manual"
              ? `This email is already registered via ${existingUser.provider}. Please login with ${existingUser.provider}.`
              : `This email is already registered manually. Please login using your password.`,
        });
      } else {
        return res.status(400).json({
          message: "User already exists.",
        });
      }
    }
    

    // ✅ Parse form-data
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

    // ✅ Validate images
    const profileImage = files.profileImage?.[0];
    const bannerImage = files.bannerImage?.[0];
    const resumeFile = files.resumeFile?.[0];

    validateImage(profileImage, false);
    validateImage(bannerImage, false);
    validateImage(resumeFile, false);

    const uploadedUrls: Record<string, string> = {};

    if (profileImage) {
      uploadedUrls.profileImage = await uploadToCloudinary(
        profileImage.buffer,
        "quickhire/profile-images"
      );
    }
    if (bannerImage) {
      uploadedUrls.bannerImage = await uploadToCloudinary(
        bannerImage.buffer,
        "quickhire/banner-images"
      );
    }
    if (resumeFile) {
      uploadedUrls.resumeFile = await uploadToCloudinary(
        resumeFile.buffer,
        "quickhire/resumes"
      );
    }

    // ✅ Password hash if manual
    let hashedPassword;
    if (provider === "manual") {
      if (!password)
        return res.status(400).json({ message: "Password is required" });
      hashedPassword = await hashPassword(password);
    }

    // ✅ Create user
    const newUser = new User({
      name: parsedPersonalInfo.name || googleData?.name,
      email: finalEmail,
      userName: username,
      password: hashedPassword,
      provider,
      providerId: googleData?.sub,
      role,
      age: parsedPersonalInfo.age,
      gender: parsedPersonalInfo.gender,
      location: parsedPersonalInfo.location,
      about: parsedPersonalInfo.about,
      professionalSummary: parsedPersonalInfo.professionalSummary,
      title: parsedPersonalInfo.title,
      avatar: googleData?.picture || uploadedUrls.profileImage,
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

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
  console.log("token",token)
    res.status(201).json({
      message: "User profile created successfully ✅",
      newUser,
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server Error", error: err });
  }
};
