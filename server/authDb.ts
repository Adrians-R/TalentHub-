import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Candidate, Invitation, Message, Recruiter, JobOpening, JobApplication, TrainingProgram, Scholarship, Internship, TrainingProposal } from "../src/types";
import { MOCK_CANDIDATES, MOCK_INVITATIONS, MOCK_MESSAGES, MOCK_RECRUITERS, MOCK_JOB_OPENINGS, MOCK_JOB_APPLICATIONS, MOCK_TRAININGS, MOCK_SCHOLARSHIPS, MOCK_INTERNSHIPS, MOCK_PROPOSALS } from "../src/data/mockData";

const DB_FILE_PATH = path.join(process.cwd(), "src", "data", "authDb.json");

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export interface UserDbRecord {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: "candidate" | "recruiter" | "admin";
  emailVerified: boolean;
  verificationCode: string | null;
  verificationExpires: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: string | null;
  loginOtpCode?: string | null;
  loginOtpExpires?: string | null;
  loginOtpAttempts?: number;
  lastOtpSentAt?: string | null;
  trustedDevices?: string[];
  failedPasswordAttempts?: number;
  lockedUntil?: string | null;
  createdAt: string;
  hrJobTitle?: string;
  phone?: string;
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  companyRegistrationNumber?: string;
  location?: string;
  authorizedDeclarationAccepted?: boolean;
  hrVerified?: boolean;
  hrVerificationStatus?: "verified" | "pending_review";
  hrVerificationTier?: "verified_domain" | "pending_manual_review" | "verified_admin";
  hrVerificationMethod?: "corporate_domain" | "linkedin_document" | "manual_admin";
  hrLinkedInUrl?: string;
  companyLinkedInUrl?: string;
  companyIdDocName?: string;
}

export interface SessionDbRecord {
  id: string;
  userId: string;
  expiresAt: string;
}

interface AuthDatabase {
  users: UserDbRecord[];
  sessions: SessionDbRecord[];
  candidates: Candidate[];
  recruiters: Recruiter[];
  invitations: Invitation[];
  messages: Message[];
  notifications: NotificationItem[];
  jobOpenings: JobOpening[];
  jobApplications: JobApplication[];
  trainings: TrainingProgram[];
  scholarships: Scholarship[];
  internships: Internship[];
  proposals?: TrainingProposal[];
}

// Ensure database file and parent directories exist
function ensureDatabase() {
  const dir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Default system accounts (1 Super Admin + 5 Real User Profiles)
export const DEFAULT_USERS: UserDbRecord[] = [
  // 1. Super Admin Account
  {
    id: "admin_1",
    fullName: "Sarah Connor (Super Admin)",
    email: "admin@example.com",
    passwordHash: hashPassword("Admin1234!", "default_salt"),
    salt: "default_salt",
    role: "admin",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_admin"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  // Compatibility alias for existing admin tests
  {
    id: "admin_talenthub",
    fullName: "Sarah Connor",
    email: "admin@talenthub.com",
    passwordHash: hashPassword("admin1234", "default_salt"),
    salt: "default_salt",
    role: "admin",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_admin"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  // 2. Real User Profile 1 (Candidate): Alex Rivera
  {
    id: "cand_1",
    fullName: "Alex Rivera",
    email: "alex.rivera@example.com",
    passwordHash: hashPassword("Password123!", "default_salt"),
    salt: "default_salt",
    role: "candidate",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_cand_1"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "cand_alex_alt",
    fullName: "Alex Rivera",
    email: "alex@rivera.com",
    passwordHash: hashPassword("password123", "default_salt"),
    salt: "default_salt",
    role: "candidate",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_cand_1"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  // 3. Real User Profile 2 (Candidate): Maya Lin
  {
    id: "cand_2",
    fullName: "Maya Lin",
    email: "maya.lin@example.com",
    passwordHash: hashPassword("Password123!", "default_salt"),
    salt: "default_salt",
    role: "candidate",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_cand_2"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  // 4. Real User Profile 3 (Candidate): Budi Santoso
  {
    id: "cand_3",
    fullName: "Budi Santoso",
    email: "budi.santoso@example.com",
    passwordHash: hashPassword("Password123!", "default_salt"),
    salt: "default_salt",
    role: "candidate",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_cand_3"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  // 5. Real User Profile 4 (Recruiter): Elena Rostova
  {
    id: "rec_1",
    fullName: "Elena Rostova",
    email: "elena.rostova@techcorp.com",
    passwordHash: hashPassword("Password123!", "default_salt"),
    salt: "default_salt",
    role: "recruiter",
    companyName: "TechCorp Global",
    companyWebsite: "https://techcorp.com",
    hrJobTitle: "Lead Technical Recruiter",
    phone: "+62 812-3456-7890",
    location: "Jakarta, Indonesia",
    companySize: "51-200 Karyawan",
    hrVerified: true,
    hrVerificationStatus: "verified",
    hrVerificationTier: "verified_domain",
    hrVerificationMethod: "corporate_domain",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_rec_1"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "rec_elena_alt",
    fullName: "Elena Rostova",
    email: "elena@techcorp.com",
    passwordHash: hashPassword("password123", "default_salt"),
    salt: "default_salt",
    role: "recruiter",
    companyName: "TechCorp Global",
    companyWebsite: "https://techcorp.com",
    hrJobTitle: "Lead Technical Recruiter",
    phone: "+62 812-3456-7890",
    location: "Jakarta, Indonesia",
    companySize: "51-200 Karyawan",
    hrVerified: true,
    hrVerificationStatus: "verified",
    hrVerificationTier: "verified_domain",
    hrVerificationMethod: "corporate_domain",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_rec_1"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  // 6. Real User Profile 5 (Recruiter): Reza Pratama
  {
    id: "rec_2",
    fullName: "Reza Pratama",
    email: "reza.pratama@goventures.id",
    passwordHash: hashPassword("Password123!", "default_salt"),
    salt: "default_salt",
    role: "recruiter",
    companyName: "GoVentures Tech Group",
    companyWebsite: "https://goventures.id",
    hrJobTitle: "Head of Talent Acquisition",
    phone: "+62 811-2233-4455",
    location: "Jakarta Selatan, DKI Jakarta",
    companySize: "201-1000 Karyawan",
    hrVerified: true,
    hrVerificationStatus: "verified",
    hrVerificationTier: "verified_domain",
    hrVerificationMethod: "corporate_domain",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_rec_2"],
    createdAt: "2026-08-20T00:00:00.000Z"
  }
];

// Read database from file
export function readDb(): AuthDatabase {
  ensureDatabase();
  try {
    let db: AuthDatabase;
    if (!fs.existsSync(DB_FILE_PATH)) {
      db = {
        users: DEFAULT_USERS,
        sessions: [],
        candidates: MOCK_CANDIDATES,
        recruiters: MOCK_RECRUITERS,
        invitations: MOCK_INVITATIONS,
        messages: MOCK_MESSAGES,
        notifications: [
          { id: "notif_1", title: "Elena viewed your portfolio", body: "Elena Rostova from TechCorp Global recently reviewed your payment-hub case study.", time: "1 hr ago", unread: true },
          { id: "notif_2", title: "New Interview Pitch Received!", body: "GoVentures Tech sent you a direct Sourcing Invitation for a Frontend Internship.", time: "1 day ago", unread: true }
        ],
        jobOpenings: MOCK_JOB_OPENINGS,
        jobApplications: MOCK_JOB_APPLICATIONS,
        trainings: MOCK_TRAININGS,
        scholarships: MOCK_SCHOLARSHIPS,
        internships: MOCK_INTERNSHIPS
      };
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf8");
      return db;
    }

    const data = fs.readFileSync(DB_FILE_PATH, "utf8");
    db = JSON.parse(data);
    let modified = false;

    if (!db.users || !Array.isArray(db.users)) {
      db.users = DEFAULT_USERS;
      modified = true;
    } else {
      // Ensure all required default accounts and 5 real user profiles exist
      for (const defUser of DEFAULT_USERS) {
        const existingIdx = db.users.findIndex(u => u.email.toLowerCase() === defUser.email.toLowerCase());
        if (existingIdx === -1) {
          db.users.push(defUser);
          modified = true;
        } else {
          if (!db.users[existingIdx].trustedDevices) {
            db.users[existingIdx].trustedDevices = defUser.trustedDevices || [];
            modified = true;
          }
        }
      }
    }
    if (!db.candidates) {
      db.candidates = MOCK_CANDIDATES;
      modified = true;
    }
    if (!db.recruiters) {
      db.recruiters = MOCK_RECRUITERS;
      modified = true;
    }
    if (!db.invitations) {
      db.invitations = MOCK_INVITATIONS;
      modified = true;
    }
    if (!db.messages) {
      db.messages = MOCK_MESSAGES;
      modified = true;
    }
    if (!db.notifications) {
      db.notifications = [
        { id: "notif_1", title: "Elena viewed your portfolio", body: "Elena Rostova from TechCorp Global recently reviewed your payment-hub case study.", time: "1 hr ago", unread: true },
        { id: "notif_2", title: "New Interview Pitch Received!", body: "GoVentures Tech sent you a direct Sourcing Invitation for a Frontend Internship.", time: "1 day ago", unread: true }
      ];
      modified = true;
    }
    if (!db.jobOpenings || db.jobOpenings.length === 0) {
      db.jobOpenings = MOCK_JOB_OPENINGS;
      modified = true;
    }
    if (!db.jobApplications) {
      db.jobApplications = MOCK_JOB_APPLICATIONS;
      modified = true;
    } else {
      // Enforce 30-day review expiration limit
      const expiredModified = syncApplicationExpirations(db);
      if (expiredModified) modified = true;
    }
    if (!db.trainings || !Array.isArray(db.trainings) || db.trainings.length === 0) {
      db.trainings = MOCK_TRAININGS;
      modified = true;
    }
    if (!db.scholarships || !Array.isArray(db.scholarships) || db.scholarships.length === 0) {
      db.scholarships = MOCK_SCHOLARSHIPS;
      modified = true;
    }
    if (!db.internships || !Array.isArray(db.internships) || db.internships.length === 0) {
      db.internships = MOCK_INTERNSHIPS;
      modified = true;
    }
    if (!db.proposals || !Array.isArray(db.proposals) || db.proposals.length === 0) {
      db.proposals = MOCK_PROPOSALS;
      modified = true;
    }
    if (modified) {
      writeDb(db);
    }
    return db;
  } catch (err) {
    console.error("Error reading auth database, resetting file:", err);
    return {
      users: [],
      sessions: [],
      candidates: MOCK_CANDIDATES,
      recruiters: MOCK_RECRUITERS,
      invitations: MOCK_INVITATIONS,
      messages: MOCK_MESSAGES,
      notifications: [],
      jobOpenings: MOCK_JOB_OPENINGS,
      jobApplications: MOCK_JOB_APPLICATIONS,
      trainings: MOCK_TRAININGS,
      scholarships: MOCK_SCHOLARSHIPS,
      internships: MOCK_INTERNSHIPS,
      proposals: MOCK_PROPOSALS
    };
  }
}

// Automatically check and enforce 30-day review expiration for candidate CVs
export function syncApplicationExpirations(db: AuthDatabase): boolean {
  if (!db.jobApplications || !Array.isArray(db.jobApplications)) return false;
  let changed = false;
  const now = Date.now();
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  for (const app of db.jobApplications) {
    if (!app.appliedAt) continue;
    const appliedTime = new Date(app.appliedAt).getTime();
    if (isNaN(appliedTime)) continue;

    // Set expiresAt date if missing (30 days from appliedAt)
    if (!app.expiresAt) {
      app.expiresAt = new Date(appliedTime + THIRTY_DAYS_MS).toISOString().split("T")[0];
      changed = true;
    }

    const isPast30Days = (now - appliedTime) >= THIRTY_DAYS_MS;

    // If still in initial review or pending applied stage and past 30 days -> Auto-reject (30-day review limit exceeded)
    if (isPast30Days && (app.status === "applied" || app.status === "reviewing")) {
      app.status = "rejected";
      app.isExpired = true;
      app.expiredReason = "30_days_limit";
      changed = true;
    } else if (app.isExpired && app.status !== "rejected") {
      app.status = "rejected";
      changed = true;
    }
  }

  return changed;
}

// Write database to file
export function writeDb(db: AuthDatabase) {
  ensureDatabase();
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing auth database:", err);
  }
}

// Helper: Secure password hashing
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

// Helper: Generate secure random token
export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Helper: Generate random 6-digit code
export function generateVerificationCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

// Helper: Generate cryptographically secure 6-digit OTP code
export function generateOtpCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}
