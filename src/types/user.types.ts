import { Document } from "mongoose";

export interface ExperienceType {
  company: string;
  role: string;
  location: string;
  duration: string;
  type: "full-time" | "part-time" | "internship" | "freelance";
  description: string;
  technologies: string[];
}

export interface EducationType {
  tenth: {
    year: Number;
    state: string;
    city: string;
    school: string;
    percentage: string;
    cgpa: string;
  };
  twelfth: {
    year: Number;
    state: string;
    city: string;
    school: string;
    percentage: string;
    cgpa: string;
  };
  graduation: {
    degree: string;
    year: Number;
    state: string;
    city: string;
    college: string;
    percentage: string;
    cgpa: string;
  };
}

export interface ProjectType {
  name: string;
  description: string;
  techStack: string[];
  github: string;
  projectLink: string;
  isTeamProject: boolean;
  verifiedByMentor: boolean;
}

export interface CertificationType {
  title: string;
  issuer: string;
  year: Number;
  credentialURL: string;
}

export interface SocialType {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ResumeInsightsType {
  atsReady: boolean;
  skillScore: number;
  keywordCoverage: string[];
  suggestions: string[];
}

export interface GithubStatsType {
  totalRepos: number;
  totalCommits: number;
  topLanguages: string[];
  recentActivityScore: number;
}

export interface LeetcodeStatsType {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
}

export interface resumeTypes {
  resumeVideoUrl: string;
  resumeURL: string;
}

export interface UserType extends Document {
  name: string;
  userName: string;
  email: string;
  password: string;

  age: number;
  gender: {
    type: string;
    enum: ["Male", "Female", "Other"];
  };
  location?: string;
  avtar?: string;
  banner?: string;
  about?: string;
  professionalSummary?: string;
  title?: string;
  videoResumeUrl?: string;
  role: string;

  contact?: SocialType;
  resume: resumeTypes;
  resumeInsights?: ResumeInsightsType;
  workExperience?: ExperienceType[];
  education?: EducationType;
  skills?: string[];
  softSkills?: string[];
  hobbies?: string[];
  languages?: string[];
  domains?: string[];
  projects?: ProjectType[];
  certifications?: CertificationType[];
  achievements?: string[];
  preferredRoles?: string[];
  availability?: "full-time" | "internship" | "contract";
  locationPreference?: string;
  languageProficiency?: string[];
  githubStats?: GithubStatsType;
  leetcodeStats?: LeetcodeStatsType;
  profileViews?: number;
  isPro?: boolean;
  isVerified?: boolean;
  theme?: "light" | "dark";
  status?: "open_to_work" | "not_looking";
  createdAt?: Date;
}
