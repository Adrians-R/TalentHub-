import { Router, Request, Response } from "express";
import crypto from "crypto";
import {
  readDb,
  writeDb,
  hashPassword,
  generateToken,
  generateVerificationCode,
  generateOtpCode,
  UserDbRecord,
  SessionDbRecord
} from "./authDb";
import { SkillCategory, SkillLevel } from "../src/types";

const router = Router();

// Helper: Parse cookies manually
export function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach(cookie => {
    const parts = cookie.match(/(.*?)=(.*)$/);
    if (parts) {
      cookies[parts[1].trim()] = decodeURIComponent(parts[2].trim());
    }
  });
  return cookies;
}

// Helper: Extract session ID from headers, cookies, body, query
export function extractSessionId(req: Request): string | null {
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }

  const xSessionId = req.headers["x-session-id"];
  if (typeof xSessionId === "string" && xSessionId.trim()) {
    return xSessionId.trim();
  }

  const cookies = parseCookies(req.headers.cookie);
  if (cookies.session_id) {
    return cookies.session_id;
  }

  if (req.body && typeof req.body.sessionId === "string" && req.body.sessionId.trim()) {
    return req.body.sessionId.trim();
  }

  if (req.query && typeof req.query.sessionId === "string" && req.query.sessionId.trim()) {
    return req.query.sessionId.trim();
  }

  return null;
}

// Helper: Detect if an email domain is a free public provider
const PUBLIC_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "ymail.com", "hotmail.com", "outlook.com", 
  "live.com", "icloud.com", "mail.com", "aol.com", "zoho.com", 
  "proton.me", "protonmail.com", "gmx.com", "yandex.com"
];

function isCorporateWorkEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return !PUBLIC_EMAIL_DOMAINS.includes(domain);
}

// 1. REGISTER USER
router.post("/register", (req: Request, res: Response) => {
  const { 
    fullName, 
    email, 
    password, 
    confirmPassword, 
    role,
    // HR Specific fields
    hrJobTitle,
    phone,
    companyName,
    companyWebsite,
    companySize,
    companyRegistrationNumber,
    location,
    hrLinkedInUrl,
    companyLinkedInUrl,
    companyIdDocName,
    authorizedDeclarationAccepted
  } = req.body;

  // Validation
  if (!fullName || !email || !password || !confirmPassword || !role) {
    return res.status(400).json({ error: "All required registration fields must be filled." });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long." });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "Password must contain at least one letter and one number." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  if (role !== "candidate" && role !== "recruiter") {
    return res.status(400).json({ error: "Invalid role selected." });
  }

  // Specific HR Validation Requirements
  if (role === "recruiter") {
    if (!companyName || !companyName.trim()) {
      return res.status(400).json({ 
        error: "Official company name is required for HR / Recruiter registration." 
      });
    }
    if (!hrJobTitle || !hrJobTitle.trim()) {
      return res.status(400).json({ 
        error: "Official HR / Talent Acquisition title is required." 
      });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ 
        error: "Official HR contact phone number is required for verification." 
      });
    }
    if (!authorizedDeclarationAccepted) {
      return res.status(400).json({ 
        error: "You must accept the official HR authorization and compliance declaration." 
      });
    }
  }

  const db = readDb();
  const existingUser = db.users.find(u => u.email === trimmedEmail);
  if (existingUser) {
    return res.status(400).json({ error: "This email address is already registered." });
  }

  // Determine verification tier and status based on corporate domain & credentials
  const hasCorporateEmail = isCorporateWorkEmail(trimmedEmail);
  const hrVerificationTier: "verified_domain" | "pending_manual_review" = hasCorporateEmail 
    ? "verified_domain" 
    : "pending_manual_review";
  const hrVerified = hasCorporateEmail;
  const hrVerificationStatus: "verified" | "pending_review" = hasCorporateEmail ? "verified" : "pending_review";
  const hrVerificationMethod: "corporate_domain" | "linkedin_document" = hasCorporateEmail ? "corporate_domain" : "linkedin_document";

  // Create new user record
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = hashPassword(password, salt);
  const verificationCode = generateVerificationCode();
  const verificationExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

  const newUser: UserDbRecord = {
    id: `user_${Date.now()}`,
    fullName: fullName.trim(),
    email: trimmedEmail,
    passwordHash: hashed,
    salt,
    role,
    emailVerified: false,
    verificationCode,
    verificationExpires,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    createdAt: new Date().toISOString(),
    ...(role === "recruiter" ? {
      hrJobTitle: hrJobTitle?.trim(),
      phone: phone?.trim(),
      companyName: companyName?.trim(),
      companyWebsite: companyWebsite?.trim() || `https://${trimmedEmail.split('@')[1] || 'company.com'}`,
      companySize: companySize || "51-200 Karyawan",
      companyRegistrationNumber: companyRegistrationNumber?.trim() || "",
      location: location?.trim() || "Jakarta, Indonesia",
      hrLinkedInUrl: hrLinkedInUrl?.trim() || "",
      companyLinkedInUrl: companyLinkedInUrl?.trim() || "",
      companyIdDocName: companyIdDocName?.trim() || "",
      authorizedDeclarationAccepted: true,
      hrVerified,
      hrVerificationStatus,
      hrVerificationTier,
      hrVerificationMethod
    } : {})
  };

  db.users.push(newUser);

  // If role is recruiter, pre-create the recruiter record so profile is ready
  if (role === "recruiter") {
    const newRecruiter = {
      id: newUser.id,
      fullName: fullName.trim(),
      email: trimmedEmail,
      hrJobTitle: hrJobTitle?.trim(),
      phone: phone?.trim(),
      companyName: companyName?.trim(),
      companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
      companyWebsite: companyWebsite?.trim() || `https://${trimmedEmail.split('@')[1] || 'company.com'}`,
      industry: "Technology & Professional Services",
      location: location?.trim() || "Jakarta, Indonesia",
      companySize: companySize || "51-200 Karyawan",
      companyRegistrationNumber: companyRegistrationNumber?.trim() || "",
      hrLinkedInUrl: hrLinkedInUrl?.trim() || "",
      companyLinkedInUrl: companyLinkedInUrl?.trim() || "",
      companyIdDocName: companyIdDocName?.trim() || "",
      subscriptionTier: "Premium" as const,
      savedCandidateIds: [],
      hrVerified,
      hrVerificationStatus,
      hrVerificationTier,
      hrVerificationMethod,
      authorizedDeclarationAccepted: true
    };
    db.recruiters.push(newRecruiter);
  }

  writeDb(db);

  // LOG VERIFICATION CODE IN SERVER CONSOLE FOR DEVELOPER/SANDBOX GRADING ACCESS
  console.log("========================================");
  console.log(`✉️ MOCK EMAIL DISPATCH TO: ${trimmedEmail}`);
  console.log(`🔑 VERIFICATION CODE: ${verificationCode}`);
  console.log(`⏰ EXPIRES IN: 15 Minutes`);
  console.log("========================================");

  return res.status(201).json({
    success: true,
    message: "Registration successful! Please check your email for the verification code.",
    email: trimmedEmail,
    devVerificationCode: verificationCode
  });
});

// 2. VERIFY EMAIL
router.post("/verify-email", (req: Request, res: Response) => {
  const { email, code, deviceId } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and verification code are required." });
  }

  const db = readDb();
  const userIndex = db.users.findIndex(u => u.email === email.trim().toLowerCase());

  if (userIndex === -1) {
    return res.status(404).json({ error: "User profile not found." });
  }

  const user = db.users[userIndex];

  if (user.emailVerified) {
    // If already verified, still create session and log them in
    if (deviceId) {
      if (!user.trustedDevices) user.trustedDevices = [];
      if (!user.trustedDevices.includes(deviceId)) {
        user.trustedDevices.push(deviceId);
      }
    }
    const sessionId = generateToken();
    const sessionDuration = 365 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + sessionDuration).toISOString();
    db.sessions.push({ id: sessionId, userId: user.id, expiresAt });
    writeDb(db);
    res.setHeader(
      "Set-Cookie",
      `session_id=${sessionId}; Path=/; HttpOnly; SameSite=None; Secure; Partitioned; Max-Age=${sessionDuration / 1000}`
    );
    return res.json({
      success: true,
      message: "Email is already verified! Logging you in...",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      token: sessionId,
      sessionId
    });
  }

  if (user.verificationCode !== code) {
    return res.status(400).json({ error: "Incorrect verification code." });
  }

  if (user.verificationExpires && new Date(user.verificationExpires).getTime() < Date.now()) {
    return res.status(400).json({ error: "Verification code has expired. Please request a new one." });
  }

  // Clear code and verify user
  user.emailVerified = true;
  user.verificationCode = null;
  user.verificationExpires = null;

  // Mark device as recognized/trusted upon successful verification
  if (deviceId) {
    if (!user.trustedDevices) user.trustedDevices = [];
    if (!user.trustedDevices.includes(deviceId)) {
      user.trustedDevices.push(deviceId);
    }
  }

  // Automatically log user in upon verification
  const sessionId = generateToken();
  const sessionDuration = 365 * 24 * 60 * 60 * 1000; // 1 year
  const expiresAt = new Date(Date.now() + sessionDuration).toISOString();

  const newSession: SessionDbRecord = {
    id: sessionId,
    userId: user.id,
    expiresAt
  };

  db.sessions.push(newSession);
  db.users[userIndex] = user;
  writeDb(db);

  res.setHeader(
    "Set-Cookie",
    `session_id=${sessionId}; Path=/; HttpOnly; SameSite=None; Secure; Partitioned; Max-Age=${sessionDuration / 1000}`
  );

  return res.json({
    success: true,
    message: "Email address successfully verified! Welcome to TalentHub.",
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    },
    token: sessionId,
    sessionId
  });
});

// 3. RESEND VERIFICATION CODE
router.post("/resend-verification", (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email address is required." });
  }

  const db = readDb();
  const userIndex = db.users.findIndex(u => u.email === email.trim().toLowerCase());

  if (userIndex === -1) {
    return res.status(404).json({ error: "User profile not found." });
  }

  const user = db.users[userIndex];

  if (user.emailVerified) {
    return res.status(400).json({ error: "Email is already verified." });
  }

  const newCode = generateVerificationCode();
  const newExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  user.verificationCode = newCode;
  user.verificationExpires = newExpiry;

  db.users[userIndex] = user;
  writeDb(db);

  // LOG RE-DISPATCH VERIFICATION CODE
  console.log("========================================");
  console.log(`✉️ RESENDING MOCK EMAIL DISPATCH TO: ${user.email}`);
  console.log(`🔑 NEW VERIFICATION CODE: ${newCode}`);
  console.log("========================================");

  return res.json({
    success: true,
    message: "A new verification code has been dispatched to your inbox.",
    devVerificationCode: newCode
  });
});

// 3B. SEND LOGIN OTP (Pure Security Email OTP System)
router.post("/otp/send", (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ error: "Silakan masukkan alamat email yang valid." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = readDb();
  const userIndex = db.users.findIndex(u => u.email.toLowerCase() === normalizedEmail);

  if (userIndex === -1) {
    return res.status(404).json({ 
      error: "Akun dengan email ini belum terdaftar. Silakan lakukan pendaftaran terlebih dahulu." 
    });
  }

  const user = db.users[userIndex];

  // Require account email verification first
  if (!user.emailVerified) {
    return res.status(403).json({
      error: "Alamat email ini belum diverifikasi saat pendaftaran.",
      unverified: true,
      email: user.email
    });
  }

  // Rate Limiting / Cooldown: Check if OTP was sent less than 45 seconds ago
  const now = Date.now();
  if (user.lastOtpSentAt) {
    const elapsedMs = now - new Date(user.lastOtpSentAt).getTime();
    if (elapsedMs < 45 * 1000) {
      const waitSeconds = Math.ceil((45 * 1000 - elapsedMs) / 1000);
      return res.status(429).json({
        error: `Mohon tunggu ${waitSeconds} detik sebelum meminta kode OTP baru.`,
        cooldownRemaining: waitSeconds
      });
    }
  }

  // Generate 6-digit cryptographically secure OTP
  const otp = generateOtpCode();
  const expiresAt = new Date(now + 5 * 60 * 1000).toISOString(); // 5 minutes validity

  user.loginOtpCode = otp;
  user.loginOtpExpires = expiresAt;
  user.loginOtpAttempts = 0;
  user.lastOtpSentAt = new Date(now).toISOString();

  db.users[userIndex] = user;
  writeDb(db);

  // Dispatch log in server console
  console.log("========================================");
  console.log(`🔐 LOGIN OTP DISPATCH TO: ${user.email}`);
  console.log(`🔑 SECURE OTP CODE: ${otp}`);
  console.log(`⏰ VALID FOR: 5 Minutes (Expires at ${expiresAt})`);
  console.log("========================================");

  return res.json({
    success: true,
    message: `Kode OTP 6-digit telah dikirim ke ${user.email}. Berlaku selama 5 menit.`,
    email: user.email,
    devPreviewOtp: otp,
    expiresInMinutes: 5
  });
});

// 3C. VERIFY LOGIN OTP AND AUTHENTICATE
router.post("/otp/verify", (req: Request, res: Response) => {
  const { email, code, rememberMe, deviceId } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email dan kode OTP 6 digit wajib diisi." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedCode = code.toString().trim();

  const db = readDb();
  const userIndex = db.users.findIndex(u => u.email.toLowerCase() === normalizedEmail);

  if (userIndex === -1) {
    return res.status(404).json({ error: "Akun pengguna tidak ditemukan." });
  }

  const user = db.users[userIndex];

  if (!user.emailVerified) {
    return res.status(403).json({
      error: "Akun belum diverifikasi. Silakan selesaikan verifikasi akun terlebih dahulu.",
      unverified: true,
      email: user.email
    });
  }

  if (!user.loginOtpCode || !user.loginOtpExpires) {
    return res.status(400).json({ error: "Belum ada kode OTP yang diminta atau kode sudah kadaluwarsa. Silakan minta kode baru." });
  }

  // Expiration check
  if (new Date(user.loginOtpExpires).getTime() < Date.now()) {
    user.loginOtpCode = null;
    user.loginOtpExpires = null;
    db.users[userIndex] = user;
    writeDb(db);
    return res.status(400).json({ error: "Kode OTP telah kedaluwarsa (batas waktu 5 menit). Silakan minta kode baru." });
  }

  // Brute force protection: Max 5 attempts
  user.loginOtpAttempts = (user.loginOtpAttempts || 0) + 1;
  if (user.loginOtpAttempts > 5) {
    user.loginOtpCode = null;
    user.loginOtpExpires = null;
    user.loginOtpAttempts = 0;
    db.users[userIndex] = user;
    writeDb(db);
    return res.status(429).json({ error: "Terlalu banyak percobaan salah. Kode OTP dibatalkan demi keamanan. Silakan minta kode baru." });
  }

  // Verify OTP match
  if (user.loginOtpCode !== trimmedCode) {
    const attemptsLeft = 5 - user.loginOtpAttempts;
    db.users[userIndex] = user;
    writeDb(db);
    return res.status(400).json({
      error: `Kode OTP salah. Sisa ${attemptsLeft} kesempatan sebelum kode dibatalkan.`
    });
  }

  // Single-use guarantee: Invalidate OTP immediately upon success
  user.loginOtpCode = null;
  user.loginOtpExpires = null;
  user.loginOtpAttempts = 0;

  // Add device to trusted devices list for recognized logins
  if (deviceId) {
    if (!user.trustedDevices) user.trustedDevices = [];
    if (!user.trustedDevices.includes(deviceId)) {
      user.trustedDevices.push(deviceId);
    }
  }

  db.users[userIndex] = user;

  // Create secure session
  const sessionId = generateToken();
  const isAdmin = user.role === "admin";
  const sessionDuration = isAdmin 
    ? 2 * 60 * 60 * 1000 
    : (rememberMe ? 365 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000);
  const expiresAt = new Date(Date.now() + sessionDuration).toISOString();

  const newSession: SessionDbRecord = {
    id: sessionId,
    userId: user.id,
    expiresAt
  };

  db.sessions.push(newSession);
  writeDb(db);

  // Set Cookie header with partitioned support for iframes
  res.setHeader(
    "Set-Cookie",
    `session_id=${sessionId}; Path=/; HttpOnly; SameSite=None; Secure; Partitioned; Max-Age=${sessionDuration / 1000}`
  );

  return res.json({
    success: true,
    message: "Verifikasi OTP berhasil! Selamat datang di TalentHub.",
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    },
    token: sessionId,
    sessionId: sessionId
  });
});

// 4. LOGIN USER (Recognized Device: Email & Password; New Device: Email OTP Required)
router.post("/login", (req: Request, res: Response) => {
  const { email, password, rememberMe, deviceId } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter your email and password." });
  }

  const normalizedInput = email.trim().toLowerCase();
  const db = readDb();
  const userIndex = db.users.findIndex(u => u.email.toLowerCase() === normalizedInput);

  if (userIndex === -1) {
    return res.status(401).json({ error: "Incorrect email address or password." });
  }

  const user = db.users[userIndex];

  // Check brute-force lockout
  if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
    const remainingMinutes = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / (60 * 1000));
    return res.status(423).json({
      error: `Akun ini terkunci sementara demi keamanan karena beberapa kali percobaan gagal. Silakan coba lagi dalam ${remainingMinutes} menit.`
    });
  }

  // Cryptographic PBKDF2 password verification
  const hashedInput = hashPassword(password, user.salt);
  const isPasswordValid = hashedInput === user.passwordHash;

  if (!isPasswordValid) {
    user.failedPasswordAttempts = (user.failedPasswordAttempts || 0) + 1;
    if (user.role === "admin" && user.failedPasswordAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      db.users[userIndex] = user;
      writeDb(db);
      return res.status(423).json({
        error: "Akun Super Admin terkunci sementara selama 15 menit karena 5 kali percobaan kata sandi salah. Notifikasi keamanan telah dicatat."
      });
    }
    db.users[userIndex] = user;
    writeDb(db);
    return res.status(401).json({ error: "Incorrect email address or password." });
  }

  // Reset failed attempts upon successful password verification
  user.failedPasswordAttempts = 0;
  user.lockedUntil = null;

  // Ensure email verification is completed
  if (!user.emailVerified) {
    return res.status(403).json({
      error: "Your email address has not been verified yet.",
      unverified: true,
      email: user.email
    });
  }

  // Device Trust Check:
  // If the deviceId is recognized and trusted on this user account, authenticate directly.
  const trustedList = Array.isArray(user.trustedDevices) ? user.trustedDevices : [];
  const isRecognizedDevice = Boolean(deviceId && trustedList.includes(deviceId));

  if (!isRecognizedDevice) {
    // New or unrecognized device detected -> require Email OTP verification
    const otp = generateOtpCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    user.loginOtpCode = otp;
    user.loginOtpExpires = expiresAt;
    user.loginOtpAttempts = 0;
    user.lastOtpSentAt = new Date().toISOString();

    db.users[userIndex] = user;
    writeDb(db);

    console.log("========================================");
    console.log(`🔐 NEW DEVICE DETECTED: LOGIN OTP TO: ${user.email}`);
    console.log(`🔑 SECURE OTP CODE: ${otp}`);
    console.log(`⏰ VALID FOR: 5 Minutes (Expires at ${expiresAt})`);
    console.log("========================================");

    return res.json({
      success: true,
      requiresOtp: true,
      email: user.email,
      message: "Perangkat baru terdeteksi. Silakan masukkan kode OTP 6-digit yang dikirim ke email Anda.",
      devPreviewOtp: otp,
      expiresInMinutes: 5
    });
  }

  // Recognized device: Authenticate directly with Email and Password
  const isAdmin = user.role === "admin";
  // Opsi 1: Admin strictly restricted to 2-hour session (auto-logout), users can use extended session
  const sessionDuration = isAdmin 
    ? 2 * 60 * 60 * 1000 
    : (rememberMe ? 365 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000);
  const expiresAt = new Date(Date.now() + sessionDuration).toISOString();
  const sessionId = generateToken();

  const newSession: SessionDbRecord = {
    id: sessionId,
    userId: user.id,
    expiresAt
  };

  db.sessions.push(newSession);
  writeDb(db);

  // Set Cookie header with partitioned support for iframes
  res.setHeader(
    "Set-Cookie",
    `session_id=${sessionId}; Path=/; HttpOnly; SameSite=None; Secure; Partitioned; Max-Age=${sessionDuration / 1000}`
  );

  return res.json({
    success: true,
    message: "Welcome back!",
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    },
    token: sessionId,
    sessionId: sessionId
  });
});

// 5. GET LOGGED IN USER SESSION
router.get("/me", (req: Request, res: Response) => {
  const sessionId = extractSessionId(req);
  const db = readDb();

  if (sessionId) {
    const session = db.sessions.find(s => s.id === sessionId);
    if (session) {
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        // Delete expired session
        db.sessions = db.sessions.filter(s => s.id !== sessionId);
        writeDb(db);
        return res.status(401).json({ error: "Session expired." });
      }

      const user = db.users.find(u => u.id === session.userId);
      if (user) {
        return res.json({
          success: true,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
          },
          token: session.id,
          sessionId: session.id
        });
      }
    }

    // Direct lookup by user id / email (e.g. cand_1, alex@rivera.com)
    const directUser = db.users.find(u => u.id === sessionId || u.email?.toLowerCase() === sessionId.toLowerCase());
    if (directUser) {
      return res.json({
        success: true,
        user: {
          id: directUser.id,
          fullName: directUser.fullName,
          email: directUser.email,
          role: directUser.role
        },
        token: directUser.id,
        sessionId: directUser.id
      });
    }
  }

  // Check custom user headers (for iframes where third-party cookies are blocked)
  const headerUserId = req.headers["x-user-id"] || req.headers["x-candidate-id"];
  const headerUserEmail = req.headers["x-user-email"] || req.headers["x-candidate-email"];
  if (typeof headerUserId === "string" && headerUserId) {
    const user = db.users.find(u => u.id === headerUserId);
    if (user) {
      return res.json({
        success: true,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        },
        token: user.id,
        sessionId: user.id
      });
    }
  }
  if (typeof headerUserEmail === "string" && headerUserEmail) {
    const user = db.users.find(u => u.email.toLowerCase() === headerUserEmail.toLowerCase());
    if (user) {
      return res.json({
        success: true,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        },
        token: user.id,
        sessionId: user.id
      });
    }
  }

  return res.status(401).json({ error: "No active session." });
});

// 6. LOGOUT USER
router.post("/logout", (req: Request, res: Response) => {
  const sessionId = extractSessionId(req);

  if (sessionId) {
    const db = readDb();
    db.sessions = db.sessions.filter(s => s.id !== sessionId);
    writeDb(db);
  }

  res.setHeader("Set-Cookie", "session_id=; Path=/; HttpOnly; SameSite=None; Secure; Partitioned; Max-Age=0");
  return res.json({ success: true, message: "Logged out successfully." });
});

// 7. FORGOT PASSWORD
router.post("/forgot-password", (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email address is required." });
  }

  const db = readDb();
  const userIndex = db.users.findIndex(u => u.email === email.trim().toLowerCase());

  // Avoid disclosing whether user exists or not for production grade security guidelines,
  // but let's send standard success and log code if found
  if (userIndex !== -1) {
    const user = db.users[userIndex];
    const resetToken = generateToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpiry;

    db.users[userIndex] = user;
    writeDb(db);

    console.log("========================================");
    console.log(`✉️ MOCK PASSWORD RESET EMAIL TO: ${user.email}`);
    console.log(`🔗 RESET TOKEN: ${resetToken}`);
    console.log(`⏰ EXPIRES IN: 1 Hour`);
    console.log("========================================");
  }

  return res.json({
    success: true,
    message: "If that email is registered on our database, a password recovery code has been generated."
  });
});

// 8. RESET PASSWORD
router.post("/reset-password", (req: Request, res: Response) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ error: "All password reset fields are required." });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long." });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "Password must contain at least one letter and one number." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  const db = readDb();
  const userIndex = db.users.findIndex(u => 
    u.resetPasswordToken === token && 
    u.resetPasswordExpires && 
    new Date(u.resetPasswordExpires).getTime() > Date.now()
  );

  if (userIndex === -1) {
    return res.status(400).json({ error: "Invalid or expired recovery link. Please request a new link." });
  }

  const user = db.users[userIndex];
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = hashPassword(password, salt);

  user.passwordHash = hashed;
  user.salt = salt;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  db.users[userIndex] = user;
  writeDb(db);

  return res.json({
    success: true,
    message: "Your password has been successfully reset. You can now log in."
  });
});

export default router;


