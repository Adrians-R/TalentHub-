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

// Default system accounts (1 Super Admin + 6 Indonesian Candidates + 3 Indonesian Recruiters = 10 Users)
export const DEFAULT_USERS: UserDbRecord[] = [
  // 1. Super Admin Account
  {
    id: "admin_1",
    fullName: "Super Admin TalentHub",
    email: "admin@talenthub.id",
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
  {
    id: "admin_alt",
    fullName: "Super Admin TalentHub",
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
  // 2. Candidate 1: Rizky Pratama (Senior Full-Stack Engineer)
  {
    id: "cand_1",
    fullName: "Rizky Pratama",
    email: "rizky.pratama@example.com",
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
  // 3. Candidate 2: Annisa Larasati (Lead UI/UX & Product Designer)
  {
    id: "cand_2",
    fullName: "Annisa Larasati",
    email: "annisa.larasati@example.com",
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
  // 4. Candidate 3: Dimas Arya Nugraha (Cloud & DevOps Architect)
  {
    id: "cand_3",
    fullName: "Dimas Arya Nugraha",
    email: "dimas.arya@example.com",
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
  // 5. Candidate 4: Maya Putri Wulandari (Junior Frontend Developer)
  {
    id: "cand_4",
    fullName: "Maya Putri Wulandari",
    email: "maya.putri@example.com",
    passwordHash: hashPassword("Password123!", "default_salt"),
    salt: "default_salt",
    role: "candidate",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_cand_4"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  // 6. Candidate 5: Fajar Hidayat (Mobile Engineer / Flutter Specialist)
  {
    id: "cand_5",
    fullName: "Fajar Hidayat",
    email: "fajar.hidayat@example.com",
    passwordHash: hashPassword("Password123!", "default_salt"),
    salt: "default_salt",
    role: "candidate",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_cand_5"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  // 7. Candidate 6: Bunga Pratiwi (Product Marketing & Growth Lead)
  {
    id: "cand_6",
    fullName: "Bunga Pratiwi",
    email: "bunga.pratiwi@example.com",
    passwordHash: hashPassword("Password123!", "default_salt"),
    salt: "default_salt",
    role: "candidate",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_cand_6"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  // 8. Recruiter 1: Siti Nurhaliza (Head of Talent Acquisition)
  {
    id: "rec_1",
    fullName: "Siti Nurhaliza",
    email: "siti.nurhaliza@digitalnusantara.id",
    passwordHash: hashPassword("Password123!", "default_salt"),
    salt: "default_salt",
    role: "recruiter",
    companyName: "PT Digital Solusi Nusantara",
    companyWebsite: "https://digitalnusantara.id",
    hrJobTitle: "Head of Talent Acquisition",
    phone: "+62 811-2345-6789",
    location: "Jakarta Selatan, Indonesia",
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
    trustedDevices: ["dev_trusted_rec_1"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  // 9. Recruiter 2: Budi Santoso (Lead Tech Talent Recruiter)
  {
    id: "rec_2",
    fullName: "Budi Santoso",
    email: "budi.santoso@fintechasia.id",
    passwordHash: hashPassword("Password123!", "default_salt"),
    salt: "default_salt",
    role: "recruiter",
    companyName: "PT Finansial Inovasi Asia",
    companyWebsite: "https://fintechasia.id",
    hrJobTitle: "Lead Tech Talent Recruiter",
    phone: "+62 812-9876-5432",
    location: "Jakarta Pusat, Indonesia",
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
    trustedDevices: ["dev_trusted_rec_2"],
    createdAt: "2026-08-20T00:00:00.000Z"
  },
  // 10. Recruiter 3: Dewi Anggraini (Senior Talent Acquisition Partner)
  {
    id: "rec_3",
    fullName: "Dewi Anggraini",
    email: "dewi.anggraini@logistikglobal.id",
    passwordHash: hashPassword("Password123!", "default_salt"),
    salt: "default_salt",
    role: "recruiter",
    companyName: "PT Solusi Logistik Global",
    companyWebsite: "https://logistikglobal.id",
    hrJobTitle: "Senior Talent Acquisition Partner",
    phone: "+62 813-8899-7766",
    location: "Tangerang, Banten",
    companySize: "501-1000 Karyawan",
    hrVerified: true,
    hrVerificationStatus: "verified",
    hrVerificationTier: "verified_domain",
    hrVerificationMethod: "corporate_domain",
    emailVerified: true,
    verificationCode: null,
    verificationExpires: null,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    trustedDevices: ["dev_trusted_rec_3"],
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
      // Ensure all 10 standard Indonesian accounts (1 Super Admin, 6 Candidates, 3 Recruiters) exist and are up to date
      for (const defUser of DEFAULT_USERS) {
        const existingIdx = db.users.findIndex(u => u.email.toLowerCase() === defUser.email.toLowerCase() || u.id === defUser.id);
        if (existingIdx === -1) {
          db.users.push(defUser);
          modified = true;
        } else {
          // Always ensure valid password hash, fullName, role, and email verification
          db.users[existingIdx].fullName = defUser.fullName;
          db.users[existingIdx].email = defUser.email;
          db.users[existingIdx].passwordHash = defUser.passwordHash;
          db.users[existingIdx].salt = defUser.salt;
          db.users[existingIdx].role = defUser.role;
          db.users[existingIdx].emailVerified = true;
          if (!db.users[existingIdx].trustedDevices) {
            db.users[existingIdx].trustedDevices = defUser.trustedDevices || [];
          }
          modified = true;
        }
      }
    }
    // Always sync with the clean, realistic Indonesian mock dataset
    db.candidates = MOCK_CANDIDATES;
    db.recruiters = MOCK_RECRUITERS;
    db.invitations = MOCK_INVITATIONS;
    db.messages = MOCK_MESSAGES;
    db.notifications = [
      { id: "notif_1", title: "Siti Nurhaliza meninjau profil Anda", body: "Siti Nurhaliza dari PT Digital Solusi Nusantara baru saja meninjau portofolio React 19 Anda.", time: "1 jam lalu", unread: true },
      { id: "notif_2", title: "Undangan Wawancara Baru Diterima!", body: "PT Finansial Inovasi Asia mengirimkan Undangan Wawancara Langsung untuk posisi Lead Designer.", time: "1 hari lalu", unread: true }
    ];
    modified = true;
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
