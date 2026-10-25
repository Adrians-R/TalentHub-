/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum SkillCategory {
  Programming = "Programming",
  Design = "Design",
  Marketing = "Marketing",
  Finance = "Finance",
  Language = "Language",
  SoftSkill = "Soft Skill"
}

export enum SkillLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Expert = "Expert"
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  yearsOfExperience: number;
  category: SkillCategory;
  endorsements: number;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance";
  startDate: string;
  endDate: string; // "Present" if current
  current: boolean;
  responsibilities: string[];
  achievements: string[];
  technologiesUsed: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  gpa: string;
  graduationYear: number;
  activities?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate: string; // "Never" if applicable
  credentialId: string;
  credentialUrl?: string;
  pdfName?: string;
  verified: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  role: string;
  technology: string[];
  websiteUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
  youtubeDemo?: string;
  screenshots?: string[];
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  headline: string;
  aboutMe: string;
  location: string;
  nationality: string;
  avatar: string;
  coverImage?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  expectedSalary: string;
  availability: "Immediate" | "1 Month Notice" | "3 Months Notice" | "Flexible";
  employmentType: ("Full-time" | "Contract" | "Internship" | "Freelance")[];
  preferredLocation: string;
  openToWork: boolean;
  remote: boolean;
  hybrid: boolean;
  onsite: boolean;
  relocation: boolean;
  profileCompletion: number;
  verified: boolean;
  atsScore: number;
  videoUrl?: string;
  skills: Skill[];
  experience: WorkExperience[];
  education: Education[];
  certificates: Certificate[];
  portfolio: PortfolioProject[];
  resumeUrl?: string;
  emailVerified?: boolean;
  membershipPlan?: "Free" | "Pro";
  aiAtsQuotaUsed?: number;
  aiAtsQuotaLimit?: number;
  enrolledTrainings?: EnrolledTraining[];
  scholarshipApplications?: CandidateScholarshipApplication[];
  notificationPreferences?: {
    interviewInvites?: boolean;
    directMessages?: boolean;
    jobRecommendations?: boolean;
    weeklyDigest?: boolean;
    urgentSourcingAlerts?: boolean;
  };
}

export interface Recruiter {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  hrJobTitle?: string;
  phone?: string;
  companyName: string;
  companyLogo: string;
  companyWebsite: string;
  industry: string;
  location: string;
  companyRegistrationNumber?: string;
  companySize?: string;
  subscriptionTier: "Free" | "Premium" | "Enterprise";
  savedCandidateIds: string[];
  emailVerified?: boolean;
  hrVerified?: boolean;
  hrVerificationStatus?: "verified" | "pending_review";
  hrVerificationTier?: "verified_domain" | "pending_manual_review" | "verified_admin";
  hrVerificationMethod?: "corporate_domain" | "linkedin_document" | "manual_admin";
  hrLinkedInUrl?: string;
  companyLinkedInUrl?: string;
  companyIdDocName?: string;
  authorizedDeclarationAccepted?: boolean;
}

export interface Invitation {
  id: string;
  recruiterId: string;
  recruiterName: string;
  companyName: string;
  companyLogo: string;
  candidateId: string;
  position: string;
  message: string;
  salaryOffer: string;
  interviewLink?: string;
  scheduledDate?: string;
  status: "pending" | "accepted" | "rejected" | "scheduled";
  createdAt: string;
}

export interface Message {
  id: string;
  invitationId: string;
  senderRole: "candidate" | "recruiter";
  content: string;
  timestamp: string;
  attachmentName?: string;
}

export interface SyllabusModule {
  id: string;
  moduleNumber: number;
  title: string;
  duration: string;
  topics: string[];
}

export interface LessonRecording {
  id: string;
  moduleNumber: number;
  title: string;
  duration: string;
  instructorName: string;
  instructorAvatar?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  summary: string;
  keyTimestamps?: { time: string; label: string }[];
  slidesUrl?: string;
  codeRepoUrl?: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  provider: string;
  providerLogo?: string;
  type: "Free" | "Government" | "NGO" | "Private" | "Paid";
  price?: number; // 0 for Free/Government/NGO or numeric price e.g. 450000
  priceFormatted?: string; // "Gratis" or "Rp 450.000"
  platformFeeRate?: number; // default 0.10 (10% platform service fee)
  format: "Online" | "Offline" | "Hybrid";
  category: "Coding" | "Design" | "Product" | "Data" | "Marketing" | "Language";
  duration: string;
  schedule?: string;
  startDate?: string;
  endDate?: string;
  certification: boolean;
  certificateIssuer?: string;
  description: string;
  imageUrl: string;
  link: string;
  requirements?: string[];
  spotsLeft?: number;
  totalSpots?: number;

  // Offline Format Specifics
  venueName?: string;
  venueRoom?: string;
  venueAddress?: string;
  venueCity?: string;
  venueGoogleMapsUrl?: string;
  venueGuidelines?: string[];

  // Online Format Specifics
  onlineMeetingPlatform?: "Google Meet" | "Zoom" | "TalentHub Live Studio" | "LMS Classroom";
  onlineMeetingUrl?: string;
  lmsUrl?: string;
  communityGroupUrl?: string;
  sessionRecordingsUrl?: string;

  // Instructor
  instructorName?: string;
  instructorTitle?: string;
  instructorCompany?: string;
  instructorAvatar?: string;

  // Syllabus Breakdown
  syllabus?: SyllabusModule[];
  recordings?: LessonRecording[];
}

export interface EnrolledTraining {
  id: string;
  trainingId: string;
  trainingTitle: string;
  provider: string;
  providerLogo?: string;
  format: "Online" | "Offline" | "Hybrid";
  type: "Free" | "Government" | "NGO" | "Private" | "Paid";
  price: number;
  platformFee: number; // 10% platform share
  providerShare: number; // 90% provider share
  paymentStatus: "paid" | "free" | "pending";
  paymentMethod?: string;
  invoiceNumber?: string;
  enrolledAt: string;
  status: "enrolled" | "in_progress" | "completed";
  progressPercentage: number;
  completedModulesCount: number;
  totalModulesCount: number;
  schedule?: string;
  startDate?: string;
  
  // Offline credentials
  qrTicketCode?: string;
  venueName?: string;
  venueRoom?: string;
  venueAddress?: string;
  venueCity?: string;
  venueGoogleMapsUrl?: string;
  venueGuidelines?: string[];

  // Online credentials
  onlineMeetingPlatform?: string;
  onlineMeetingUrl?: string;
  lmsUrl?: string;
  communityGroupUrl?: string;
  sessionRecordingsUrl?: string;
  
  // Instructor & Video Recordings
  instructorName?: string;
  instructorTitle?: string;
  instructorAvatar?: string;
  recordings?: LessonRecording[];

  // Certification
  certificateUrl?: string;
  certificateNumber?: string;
  certificateId?: string;
  completedAt?: string;
}

export interface CandidateScholarshipApplication {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateAvatar?: string;
  trainingId: string;
  trainingTitle: string;
  provider: string;
  format: "Online" | "Offline" | "Hybrid";
  motivationEssay: string;
  careerGoals: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  gpaOrAchievement?: string;
  economicBackground?: string;
  weeklyCommitmentHours: number;
  submittedAt: string;
  status: "submitted" | "under_review" | "interview" | "approved" | "rejected";
  adminFeedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  category: string;
  description: string;
  requirements: string[];
  link: string;
  quota?: number;
  applicantCount?: number;
  selectionStage?: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Remote" | "Hybrid" | "Onsite";
  duration: string;
  stipend: string;
  description: string;
  requirements: string[];
  link: string;
}

export interface CareerArticle {
  id: string;
  title: string;
  category: "Tips" | "Interview" | "Resume" | "Portfolio" | "Trends" | "Salary";
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  likes: number;
}

export interface JobOpening {
  id: string;
  recruiterId: string;
  recruiterName: string;
  companyName: string;
  companyLogo: string;
  companyWebsite?: string;
  title: string;
  department?: string;
  location: string;
  workplaceType: "Remote" | "Hybrid" | "Onsite";
  employmentType: "Full-time" | "Contract" | "Part-time" | "Internship" | "Freelance";
  experienceLevel: "Entry" | "Junior" | "Mid-level" | "Senior" | "Lead" | "Manager";
  salaryMin: number;
  salaryMax: number;
  salaryFormatted: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits?: string[];
  status: "active" | "closed";
  applicantCount: number;
  postedAt: string;
  deadline?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  recruiterId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateAvatar?: string;
  candidateHeadline?: string;
  expectedSalary?: string;
  coverNote?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  appliedAt: string;
  status: "applied" | "reviewing" | "interview" | "offered" | "accepted" | "rejected";
  interviewDate?: string;
  meetLink?: string;
  offerSalary?: string;
  offerStartDate?: string;
  offerNotes?: string;
  expiresAt?: string;
  isExpired?: boolean;
  expiredReason?: string;
}

export interface TrainingProposal {
  id: string;
  type: "training_proposal" | "complaint" | "general_inquiry";
  partnerName: string;
  institutionName: string;
  email: string;
  phone: string;
  programTitle: string;
  category: "Coding" | "Design" | "Product" | "Data" | "Marketing" | "Language";
  programType: "Free" | "Government" | "NGO" | "Private";
  format: "Online" | "Offline";
  duration: string;
  certification: boolean;
  description: string;
  syllabusOverview?: string;
  requirements: string[];
  registrationLink: string;
  imageUrl?: string;
  submittedAt: string;
  status: "pending" | "under_review" | "approved" | "rejected";
  adminNotes?: string;
}

export {
  DEFAULT_PROFILE_IMAGE,
  DEFAULT_AVATAR,
  getProfileAvatar,
  isDefaultAvatar
} from "./utils/avatar";

