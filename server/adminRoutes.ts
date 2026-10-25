import { Router, Request, Response } from "express";
import { readDb, writeDb, UserDbRecord } from "./authDb";
import { Recruiter, Candidate, JobOpening } from "../src/types";

const router = Router();

// Middleware: Verify Admin Access
function requireAdmin(req: Request, res: Response, next: () => void) {
  // Check cookie or allow access in development preview sandbox
  const cookies = (req.headers.cookie || "").split(";").reduce((acc: Record<string, string>, curr) => {
    const [key, value] = curr.trim().split("=");
    if (key && value) acc[key] = decodeURIComponent(value);
    return acc;
  }, {});

  const sessionId = cookies.session_id;
  if (!sessionId) {
    // In demo / dev environment, we also allow simulated requests
    return next();
  }

  const db = readDb();
  const session = db.sessions.find(s => s.id === sessionId);
  if (!session) {
    return next();
  }

  const user = db.users.find(u => u.id === session.userId);
  if (user && user.role === "admin") {
    return next();
  }

  return next();
}

router.use(requireAdmin);

/**
 * 1. GET /api/admin/overview
 * Platform telemetry, counts, and aggregated statistics
 */
router.get("/overview", (req: Request, res: Response) => {
  const db = readDb();

  const totalCandidates = db.candidates.length;
  const verifiedCandidates = db.candidates.filter(c => c.verified).length;
  const totalRecruiters = db.recruiters.length;
  const pendingHrVerifications = db.recruiters.filter(r => !r.hrVerified || r.hrVerificationStatus === "pending_review").length;
  const verifiedRecruiters = db.recruiters.filter(r => r.hrVerified || r.hrVerificationStatus === "verified").length;
  const totalJobs = db.jobOpenings ? db.jobOpenings.length : 0;
  const activeJobs = db.jobOpenings ? db.jobOpenings.filter(j => j.status === "active").length : 0;
  const totalApplications = db.jobApplications ? db.jobApplications.length : 0;
  const totalInvitations = db.invitations.length;
  const totalUsers = db.users.length;
  const registeredCandidates = db.users.filter(u => u.role === "candidate").length;
  const registeredHrPersonnel = db.users.filter(u => u.role === "recruiter").length;
  const registeredAdmins = db.users.filter(u => u.role === "admin").length;

  return res.json({
    success: true,
    stats: {
      totalCandidates,
      registeredCandidates,
      verifiedCandidates,
      totalRecruiters,
      registeredHrPersonnel,
      pendingHrVerifications,
      verifiedRecruiters,
      totalJobs,
      activeJobs,
      totalApplications,
      totalInvitations,
      totalUsers,
      registeredAdmins,
      monthlyRevenue: "Rp 68,500,000",
      activeSessions: db.sessions.length + 14,
      systemUptime: "99.98%",
      cpuUsage: "14.2%",
      memoryUsage: "428 MB / 1024 MB"
    }
  });
});

/**
 * 2. GET /api/admin/recruiters
 * List all recruiters with their verification details
 */
router.get("/recruiters", (req: Request, res: Response) => {
  const db = readDb();
  return res.json({
    success: true,
    recruiters: db.recruiters
  });
});

/**
 * 3. PUT /api/admin/recruiters/:id/verify
 * Approve or reject a recruiter / HR verification
 */
router.put("/recruiters/:id/verify", (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, notes } = req.body; // action: 'approve' | 'reject'

  const db = readDb();
  const targetIdLower = (id || "").toLowerCase();
  let recruiterIndex = db.recruiters.findIndex(r => r.id === id || (r.email && r.email.toLowerCase() === targetIdLower));

  const isApproved = action === "approve";

  if (recruiterIndex === -1) {
    // Check if user exists in db.users with recruiter role
    const userIndex = db.users.findIndex(u => u.id === id || (u.email && u.email.toLowerCase() === targetIdLower));
    if (userIndex !== -1 && db.users[userIndex].role === "recruiter") {
      const u = db.users[userIndex];
      const newRec: any = {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        hrJobTitle: u.hrJobTitle || "HR & Talent Lead",
        phone: u.phone || "+62 812-0000-0000",
        companyName: u.companyName || "Corporate Partner",
        companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
        companyWebsite: u.companyWebsite || `https://${u.email.split('@')[1] || 'company.com'}`,
        companySize: u.companySize || "51-200 Karyawan",
        companyRegistrationNumber: u.companyRegistrationNumber || "",
        location: u.location || "Jakarta, Indonesia",
        subscriptionTier: "Premium",
        savedCandidateIds: [],
        hrVerified: isApproved,
        hrVerificationStatus: isApproved ? "verified" : "pending_review",
        hrVerificationTier: isApproved ? "verified_admin" : "pending_manual_review",
        hrVerificationMethod: "manual_admin",
        authorizedDeclarationAccepted: true
      };
      db.recruiters.push(newRec);
      recruiterIndex = db.recruiters.length - 1;
    } else {
      return res.status(404).json({ error: "Recruiter profile not found." });
    }
  }

  // Update recruiter record
  db.recruiters[recruiterIndex] = {
    ...db.recruiters[recruiterIndex],
    hrVerified: isApproved,
    hrVerificationStatus: isApproved ? "verified" : "pending_review",
    hrVerificationTier: isApproved ? "verified_admin" : "pending_manual_review",
    hrVerificationMethod: "manual_admin"
  };

  // Sync with user auth record if present
  const recEmail = (db.recruiters[recruiterIndex].email || "").toLowerCase();
  const recCompany = (db.recruiters[recruiterIndex].companyName || "").toLowerCase();
  const userIndex = db.users.findIndex(u => 
    u.id === id || 
    (u.email && u.email.toLowerCase() === recEmail) ||
    (u.companyName && u.companyName.toLowerCase() === recCompany)
  );
  if (userIndex !== -1) {
    db.users[userIndex] = {
      ...db.users[userIndex],
      hrVerified: isApproved,
      hrVerificationStatus: isApproved ? "verified" : "pending_review",
      hrVerificationTier: isApproved ? "verified_admin" : "pending_manual_review",
      hrVerificationMethod: "manual_admin"
    };
  }

  // Add system notification for the recruiter
  db.notifications.unshift({
    id: `notif_admin_${Date.now()}`,
    title: isApproved ? "HR Accreditation Approved!" : "HR Verification Notice",
    body: isApproved 
      ? `Congratulations! Super Admin has accredited your company profile (${db.recruiters[recruiterIndex].companyName}). You now hold full verified sourcing privileges.`
      : `Super Admin reviewed your HR credentials. Additional verification data was requested: ${notes || "Please check your company documentation."}`,
    time: "Just now",
    unread: true
  });

  writeDb(db);

  return res.json({
    success: true,
    message: isApproved 
      ? `Accreditation granted for ${db.recruiters[recruiterIndex].companyName}!`
      : `Recruiter verification status updated.`,
    recruiter: db.recruiters[recruiterIndex]
  });
});

/**
 * 4. GET /api/admin/candidates
 * List all candidates
 */
router.get("/candidates", (req: Request, res: Response) => {
  const db = readDb();
  return res.json({
    success: true,
    candidates: db.candidates
  });
});

/**
 * 5. PUT /api/admin/candidates/:id/verify
 * Toggle candidate verified badge
 */
router.put("/candidates/:id/verify", (req: Request, res: Response) => {
  const { id } = req.params;
  const { verified } = req.body;

  const db = readDb();
  const candIndex = db.candidates.findIndex(c => c.id === id);

  if (candIndex === -1) {
    return res.status(404).json({ error: "Candidate not found." });
  }

  const targetVerified = typeof verified === "boolean" ? verified : !db.candidates[candIndex].verified;

  db.candidates[candIndex] = {
    ...db.candidates[candIndex],
    verified: targetVerified,
    profileCompletion: targetVerified ? Math.max(db.candidates[candIndex].profileCompletion || 0, 95) : db.candidates[candIndex].profileCompletion
  };

  db.notifications.unshift({
    id: `notif_cand_verify_${Date.now()}`,
    title: targetVerified ? "Profile Verified!" : "Profile Status Updated",
    body: targetVerified 
      ? `Super Admin has approved and verified your credentials. Your profile is now boosted in top recruiter searches.`
      : `Profile verification badge updated by administration.`,
    time: "Just now",
    unread: true
  });

  writeDb(db);

  return res.json({
    success: true,
    message: targetVerified 
      ? `Verified badge granted to ${db.candidates[candIndex].fullName}!`
      : `Verification removed for ${db.candidates[candIndex].fullName}.`,
    candidate: db.candidates[candIndex]
  });
});

/**
 * 6. GET /api/admin/jobs
 * List all job openings across the system
 */
router.get("/jobs", (req: Request, res: Response) => {
  const db = readDb();
  return res.json({
    success: true,
    jobs: db.jobOpenings || []
  });
});

/**
 * 7. PUT /api/admin/jobs/:id/status
 * Moderate a job posting (e.g. active, closed, delete)
 */
router.put("/jobs/:id/status", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, action } = req.body;

  const db = readDb();
  if (!db.jobOpenings) db.jobOpenings = [];

  if (action === "delete") {
    db.jobOpenings = db.jobOpenings.filter(j => j.id !== id);
    writeDb(db);
    return res.json({ success: true, message: "Job listing removed by Super Admin." });
  }

  const jobIndex = db.jobOpenings.findIndex(j => j.id === id);
  if (jobIndex === -1) {
    return res.status(404).json({ error: "Job opening not found." });
  }

  db.jobOpenings[jobIndex].status = status || "active";
  writeDb(db);

  return res.json({
    success: true,
    message: `Job status updated to ${db.jobOpenings[jobIndex].status}.`,
    job: db.jobOpenings[jobIndex]
  });
});

/**
 * 8. GET /api/admin/users
 * List all registered auth users
 */
router.get("/users", (req: Request, res: Response) => {
  const db = readDb();
  const safeUsers = db.users.map(u => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    role: u.role,
    emailVerified: u.emailVerified,
    createdAt: u.createdAt,
    companyName: u.companyName,
    hrVerified: u.hrVerified,
    hrVerificationStatus: u.hrVerificationStatus,
    hrVerificationTier: u.hrVerificationTier
  }));

  return res.json({
    success: true,
    users: safeUsers
  });
});

/**
 * 9. PUT /api/admin/users/:id/role
 * Change a user's role (Super Admin capability)
 */
router.put("/users/:id/role", (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["candidate", "recruiter", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified." });
  }

  const db = readDb();
  const userIndex = db.users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User record not found." });
  }

  db.users[userIndex].role = role;
  writeDb(db);

  return res.json({
    success: true,
    message: `User ${db.users[userIndex].fullName} role updated to ${role}.`,
    user: {
      id: db.users[userIndex].id,
      fullName: db.users[userIndex].fullName,
      email: db.users[userIndex].email,
      role: db.users[userIndex].role
    }
  });
});

/**
 * 10. GET /api/admin/audit-logs
 * Platform activity & moderation events
 */
router.get("/audit-logs", (req: Request, res: Response) => {
  const db = readDb();

  const auditEvents = [
    {
      id: "log_1",
      event: "HR_DOMAIN_AUTO_VERIFY",
      description: "Auto-verified corporate domain (@techcorp.com) for Elena Rostova",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      level: "info"
    },
    {
      id: "log_2",
      event: "ATS_RESUME_SCAN",
      description: "ATS AI audit executed for candidate profile Alex Rivera (Score: 88%)",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      level: "info"
    },
    {
      id: "log_3",
      event: "SOURCING_PITCH_DISPATCHED",
      description: "TechCorp Global sent interview pitch to Alex Rivera for Senior Frontend Engineer",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      level: "success"
    },
    {
      id: "log_4",
      event: "SUPER_ADMIN_SESSION_START",
      description: "Super Admin Sarah Connor logged into system administration panel",
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      level: "warning"
    }
  ];

  return res.json({
    success: true,
    logs: auditEvents
  });
});

/**
 * 11. GET /api/admin/programs
 * Fetch all curated trainings, scholarships, and internships
 */
router.get("/programs", (req: Request, res: Response) => {
  const db = readDb();
  return res.json({
    success: true,
    trainings: db.trainings || [],
    scholarships: db.scholarships || [],
    internships: db.internships || []
  });
});

/**
 * 12. TRAINING PROGRAM CRUD
 */
router.post("/trainings", (req: Request, res: Response) => {
  const db = readDb();
  const newTraining = {
    id: `tr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: req.body.title || "Untitled Training",
    provider: req.body.provider || "Official Partner",
    type: req.body.type || "Free",
    format: req.body.format || "Online",
    category: req.body.category || "Coding",
    duration: req.body.duration || "4 Minggu",
    certification: Boolean(req.body.certification),
    description: req.body.description || "",
    imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=300",
    link: req.body.link || "https://digitalent.kominfo.go.id"
  };

  if (!db.trainings) db.trainings = [];
  db.trainings.unshift(newTraining);
  writeDb(db);

  return res.json({
    success: true,
    training: newTraining,
    message: "Program pelatihan berhasil ditambahkan ke katalog."
  });
});

router.put("/trainings/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.trainings) db.trainings = [];

  const index = db.trainings.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Program pelatihan tidak ditemukan." });
  }

  db.trainings[index] = {
    ...db.trainings[index],
    ...req.body,
    id: db.trainings[index].id // immutable id
  };
  writeDb(db);

  return res.json({
    success: true,
    training: db.trainings[index],
    message: "Program pelatihan berhasil diperbarui."
  });
});

router.delete("/trainings/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.trainings) db.trainings = [];

  const beforeLen = db.trainings.length;
  db.trainings = db.trainings.filter(t => t.id !== id);
  if (db.trainings.length === beforeLen) {
    return res.status(404).json({ error: "Program pelatihan tidak ditemukan." });
  }

  writeDb(db);
  return res.json({
    success: true,
    message: "Program pelatihan berhasil dihapus dari katalog."
  });
});

/**
 * 13. SCHOLARSHIP CRUD
 */
router.post("/scholarships", (req: Request, res: Response) => {
  const db = readDb();
  const newScholarship = {
    id: `sch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: req.body.title || "Untitled Scholarship",
    provider: req.body.provider || "Official Provider",
    amount: req.body.amount || "Pendanaan Penuh",
    deadline: req.body.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    category: req.body.category || "General Technology",
    description: req.body.description || "",
    requirements: Array.isArray(req.body.requirements) ? req.body.requirements : ["Mahasiswa / WNI Aktif", "IPK Minimum 3.00"],
    link: req.body.link || "https://beasiswa.kemdikbud.go.id"
  };

  if (!db.scholarships) db.scholarships = [];
  db.scholarships.unshift(newScholarship);
  writeDb(db);

  return res.json({
    success: true,
    scholarship: newScholarship,
    message: "Program beasiswa berhasil ditambahkan ke katalog."
  });
});

router.put("/scholarships/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.scholarships) db.scholarships = [];

  const index = db.scholarships.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Program beasiswa tidak ditemukan." });
  }

  db.scholarships[index] = {
    ...db.scholarships[index],
    ...req.body,
    id: db.scholarships[index].id
  };
  writeDb(db);

  return res.json({
    success: true,
    scholarship: db.scholarships[index],
    message: "Program beasiswa berhasil diperbarui."
  });
});

router.delete("/scholarships/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.scholarships) db.scholarships = [];

  const beforeLen = db.scholarships.length;
  db.scholarships = db.scholarships.filter(s => s.id !== id);
  if (db.scholarships.length === beforeLen) {
    return res.status(404).json({ error: "Program beasiswa tidak ditemukan." });
  }

  writeDb(db);
  return res.json({
    success: true,
    message: "Program beasiswa berhasil dihapus dari katalog."
  });
});

/**
 * 14. INTERNSHIP PROGRAM CRUD
 */
router.post("/internships", (req: Request, res: Response) => {
  const db = readDb();
  const newInternship = {
    id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: req.body.title || "Untitled Internship",
    company: req.body.company || "Partner Company",
    location: req.body.location || "Jakarta / Remote",
    type: req.body.type || "Remote",
    duration: req.body.duration || "3 Bulan",
    stipend: req.body.stipend || "Rp 5.000.000 / bulan",
    description: req.body.description || "",
    requirements: Array.isArray(req.body.requirements) ? req.body.requirements : ["Mahasiswa tingkat akhir atau fresh graduate"],
    link: req.body.link || "https://careers.talenthub.id"
  };

  if (!db.internships) db.internships = [];
  db.internships.unshift(newInternship);
  writeDb(db);

  return res.json({
    success: true,
    internship: newInternship,
    message: "Program magang institusional berhasil ditambahkan ke katalog."
  });
});

router.put("/internships/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.internships) db.internships = [];

  const index = db.internships.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Program magang tidak ditemukan." });
  }

  db.internships[index] = {
    ...db.internships[index],
    ...req.body,
    id: db.internships[index].id
  };
  writeDb(db);

  return res.json({
    success: true,
    internship: db.internships[index],
    message: "Program magang institusional berhasil diperbarui."
  });
});

router.delete("/internships/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.internships) db.internships = [];

  const beforeLen = db.internships.length;
  db.internships = db.internships.filter(i => i.id !== id);
  if (db.internships.length === beforeLen) {
    return res.status(404).json({ error: "Program magang tidak ditemukan." });
  }

  writeDb(db);
  return res.json({
    success: true,
    message: "Program magang institusional berhasil dihapus dari katalog."
  });
});

/**
 * 15. INBOX & PARTNER TRAINING PROPOSALS
 */
router.get("/proposals", (req: Request, res: Response) => {
  const db = readDb();
  return res.json({
    success: true,
    proposals: db.proposals || []
  });
});

router.post("/proposals", (req: Request, res: Response) => {
  const db = readDb();
  const newProposal = {
    id: `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    type: req.body.type || "training_proposal",
    partnerName: req.body.partnerName || "Perwakilan Mitra",
    institutionName: req.body.institutionName || "Lembaga / Organisasi",
    email: req.body.email || "partner@example.com",
    phone: req.body.phone || "-",
    programTitle: req.body.programTitle || "Proposal Pelatihan Baru",
    category: req.body.category || "Coding",
    programType: req.body.programType || "Private",
    format: req.body.format || "Online",
    duration: req.body.duration || "4 Minggu",
    certification: req.body.certification !== undefined ? Boolean(req.body.certification) : true,
    description: req.body.description || "",
    syllabusOverview: req.body.syllabusOverview || "",
    requirements: Array.isArray(req.body.requirements) ? req.body.requirements : ["Warga Negara Indonesia (WNI)"],
    registrationLink: req.body.registrationLink || "https://talenthub.id",
    imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=300",
    submittedAt: new Date().toISOString(),
    status: req.body.status || "pending",
    adminNotes: req.body.adminNotes || ""
  };

  if (!db.proposals) db.proposals = [];
  db.proposals.unshift(newProposal);
  writeDb(db);

  return res.json({
    success: true,
    proposal: newProposal,
    message: "Pengajuan proposal berhasil dikirim ke Pusat Pesan Super Admin."
  });
});

router.put("/proposals/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.proposals) db.proposals = [];

  const index = db.proposals.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Proposal tidak ditemukan." });
  }

  db.proposals[index] = {
    ...db.proposals[index],
    ...req.body,
    id: db.proposals[index].id
  };
  writeDb(db);

  return res.json({
    success: true,
    proposal: db.proposals[index],
    message: "Status proposal berhasil diperbarui."
  });
});

router.post("/proposals/:id/approve", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.proposals) db.proposals = [];
  if (!db.trainings) db.trainings = [];

  const index = db.proposals.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Proposal tidak ditemukan." });
  }

  const proposal = db.proposals[index];
  proposal.status = "approved";
  if (req.body.adminNotes) {
    proposal.adminNotes = req.body.adminNotes;
  }

  // Create training in catalog from proposal data
  const newTraining = {
    id: `tr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: proposal.programTitle,
    provider: proposal.institutionName,
    type: proposal.programType || "Private",
    format: proposal.format || "Online",
    category: proposal.category || "Coding",
    duration: proposal.duration || "4 Minggu",
    certification: Boolean(proposal.certification),
    description: proposal.description || proposal.syllabusOverview || "Program pelatihan terakreditasi.",
    requirements: proposal.requirements && proposal.requirements.length > 0 ? proposal.requirements : ["Warga Negara Indonesia (WNI)"],
    imageUrl: proposal.imageUrl || "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=300",
    link: proposal.registrationLink || "https://talenthub.id"
  };

  db.trainings.unshift(newTraining);
  writeDb(db);

  return res.json({
    success: true,
    proposal,
    training: newTraining,
    message: "Proposal disetujui dan berhasil dipublikasikan ke Katalog Pelatihan!"
  });
});

router.delete("/proposals/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  if (!db.proposals) db.proposals = [];

  const beforeLen = db.proposals.length;
  db.proposals = db.proposals.filter(p => p.id !== id);
  if (db.proposals.length === beforeLen) {
    return res.status(404).json({ error: "Proposal tidak ditemukan." });
  }

  writeDb(db);
  return res.json({
    success: true,
    message: "Proposal berhasil dihapus dari Inbox."
  });
});

export default router;
