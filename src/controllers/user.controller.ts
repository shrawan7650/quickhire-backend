import { User } from "../models/user.model";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { safeJsonParse } from "../utils/safeJsonParse";
import { Multer } from "multer";
import { validateImage } from "../utils/ImageValidation";
import { AuthenticatedRequest } from "../middlewares/authenticateJWT";
import { Response } from "express";

export const completeProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const {
      name,
      age,
      gender,
      location,
      about,
      professionalSummary,
      title,
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

    // Images
    const profileImage = files.profileImage?.[0];
    const bannerImage = files.bannerImage?.[0];
    const resumeFile = files.resumeFile?.[0];

    validateImage(profileImage, false);
    validateImage(bannerImage, false);
    validateImage(resumeFile, false);

    const uploadedUrls: Record<string, string> = {};

    if (profileImage)
      uploadedUrls.profileImage = await uploadToCloudinary(profileImage.buffer, "quickhire/profile-images");
    if (bannerImage)
      uploadedUrls.bannerImage = await uploadToCloudinary(bannerImage.buffer, "quickhire/banner-images");
    if (resumeFile)
      uploadedUrls.resumeFile = await uploadToCloudinary(resumeFile.buffer, "quickhire/resumes");

    // Parse & map fields
    const parsedSkills = safeJsonParse(skills);
    const parsedEducation = safeJsonParse(education);
    const parsedProjects = safeJsonParse(projects);
    const parsedWorkExperience = safeJsonParse(workExperience);
    const parsedCertifications = safeJsonParse(certifications);
    const parsedAchievements = safeJsonParse(achievements);
    const parsedContact = safeJsonParse(contact);
    const parsedStats = safeJsonParse(stats);
    const parsedResumeVideo = safeJsonParse(resume);
    const parsedJobPreferences = safeJsonParse(jobpreferences);

    // ✅ Update User
    await User.findByIdAndUpdate(userId, {
      name,
      age,
      gender,
      location,
      about,
      professionalSummary,
      title,
      education: parsedEducation,
      skills: parsedSkills.skills,
      softSkills: parsedSkills.softSkills,
      hobbies: parsedSkills.hobbies,
      languages: parsedSkills.languages,
      domains: parsedSkills.domains,
      projects: parsedProjects,
      workExperience: parsedWorkExperience,
      certifications: parsedCertifications,
      achievements: parsedAchievements,
      contact: parsedContact,
      avatar: uploadedUrls.profileImage,
      banner: uploadedUrls.bannerImage,
      resume: {
        resumeURL: uploadedUrls.resumeFile,
        resumeVideoUrl: parsedResumeVideo,
      },
      // jobpreferences: [String] only → so taking preferredRoles array as string array
      jobpreferences: parsedJobPreferences.preferredRoles || [],
      availability: parsedJobPreferences.availability || "full-time",
      locationPreference: parsedJobPreferences.locationPreference || "",
      // languageProficiency not in schema now
      // stats separated
      githubStats: parsedStats.githubStats,
      leetcodeStats: parsedStats.leetcodeStats,
      profileCompleted: true,
    });

    res.status(200).json({ message: "Profile completed successfully ✅" });
  } catch (err) {
    console.error("Profile complete error:", err);
    res.status(500).json({ message: "Server Error", error: err });
  }
};
export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server Error", error: err });
  }
};