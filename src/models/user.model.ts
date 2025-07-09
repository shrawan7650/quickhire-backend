import mongoose from "mongoose";
import { UserType } from "../types/user.types";

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["full-time", "part-time", "internship", "freelance"],
  },
  description: {
    type: String,
    required: false,
  },
  technologies: [String],
});

const educationSchema = new mongoose.Schema({
  tenth: {
    year: {
      type: Number,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    school: {
      type: String,
      required: false,
    },
    percentage: {
      type: String,
      required: false,
    },
    cgpa: {
      type: String,
      required: false,
    },
  },
  twelfth: {
    year: {
      type: Number,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    school: {
      type: String,
      required: false,
    },
    percentage: {
      type: String,
      required: false,
    },
    cgpa: {
      type: String,
      required: false,
    },
  },
  graduation: {
    degree: {
      type: String,
      required: false,
    },
    year: {
      type: Number,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    college: {
      type: String,
      required: false,
    },
    percentage: {
      type: String,
      required: false,
    },
    cgpa: {
      type: String,
      required: false,
    },
  },
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  description: String,
  techStack: [String],
  github: {
    type: String,
    required: false,
  },
  projectLink: {
    type: String,
    required: false,
  },
  isTeamProject: { type: Boolean, default: false },
  verifiedByMentor: { type: Boolean, default: false },
});

const certificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  issuer: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: false,
  },
  credentialURL: {
    type: String,
    required: false,
  },
});

const socialSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  linkedin: {
    type: String,
    required: false,
  },
  github: {
    type: String,
    required: false,
  },
  portfolio: {
    type: String,
    required: false,
  },
});

const resumeInsightsSchema = new mongoose.Schema({
  atsReady: {
    type: Boolean,
    required: false,
    
  },
  skillScore: {
    type: Number,
    required: false,
  },
  keywordCoverage: [String],
  suggestions: [String],
});

const resume = new mongoose.Schema({
  resumeVideoUrl: {
    type: String,
    required: false,
  },
  resumeURL: {
    type: String,
    required: false,
  },
});

const userSchema = new mongoose.Schema<UserType>({
  name: { type: String, required: false },
  userName: { type: String, unique: true, required: false },
  email: { type: String, unique: true, required: false },
  password: { type: String, required: false },
  age: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    required: false,
    enum: ["Male", "Female", "Other"],
  },
  role:{
    type: String,
    required: false,
    enum: ["user", "admin","company"],
    default: "user",
  },
  location: {
    type: String,
    required: false,
  },
  avtar: {
    type: String,
    required: false,
  },
  banner: {
    type: String,
    required: false,
  },
  about: {
    type: String,
    required: false,
  },
  professionalSummary: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  videoResumeUrl: {
    type: String,
    required: false,
  },
  contact: socialSchema,
  resume: resume,
  resumeInsights: resumeInsightsSchema,
  workExperience: [experienceSchema],
  education: educationSchema,
  skills: [String],
  softSkills: [String],
  hobbies: [String],
  languages: [String],
  domains: [String],
  projects: [projectSchema],
  certifications: [certificationSchema],
  achievements: [String],
  preferredRoles: [String],
  availability: { type: String, enum: ["full-time", "internship", "contract"] },
  locationPreference: {
    type: String,
    required: false,
  },
  languageProficiency: [String],
  githubStats: {
    totalRepos: {
      type: Number,
      required: false,
    },
    totalCommits: {
      type: Number,
      required: false,
    },
    topLanguages: [String],
    recentActivityScore: {
      type: Number,
      required: false,
    },
  },
  leetcodeStats: {
    totalSolved: {
      type: Number,
      required: false,
    },
    easySolved: {
      type: Number,
      required: false,
    },
    mediumSolved: {
      type: Number,
      required: false,
    },
    hardSolved: {
      type: Number,
      required: false,
    },
    ranking: {
      type: Number,
      required: false,
    },
  },
  profileViews: { type: Number, default: 0 },
  isPro: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  theme: { type: String, enum: ["light", "dark"], default: "light" },
  status: {
    type: String,
    enum: ["open_to_work", "not_looking"],
    default: "open_to_work",
  },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<UserType>("User", userSchema);
