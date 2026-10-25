import { Router, Request, Response } from "express";
import { readDb, writeDb, NotificationItem } from "./authDb";
import { extractSessionId } from "./authRoutes";
import { Candidate, Invitation, Message, Recruiter, JobOpening, JobApplication } from "../src/types";

const router = Router();

// Middleware: Authenticate Session and retrieve User
function getSessionUser(req: Request, db: any) {
  const sessionId = extractSessionId(req);
  if (!sessionId) return null;

  const session = db.sessions?.find((s: any) => s.id === sessionId);
  if (session) {
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      return null;
    }
    const user = db.users?.find((u: any) => u.id === session.userId);
    if (user) return user;
  }

  const directUser = db.users?.find((u: any) => u.id === sessionId || u.email?.toLowerCase() === sessionId.toLowerCase());
  return directUser || null;
}

// 1. GET CURRENT LOGGED-IN RECRUITER PROFILE
router.get("/me", (req: Request, res: Response) => {
  const db = readDb();
  const user = getSessionUser(req, db);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized. Please log in first." });
  }

  if (user.role !== "recruiter") {
    return res.status(403).json({ error: "Forbidden. Logged-in user is not a recruiter." });
  }

  // Find recruiter profile by matching user.id or rec_1 for default seed sandbox user
  let recruiter = db.recruiters.find(r => r.id === user.id || (user.id === "rec_1" && r.id === "rec_1"));

  // If new recruiter registered but has no profile, initialize default profile
  if (!recruiter) {
    recruiter = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      hrJobTitle: user.hrJobTitle || "Talent Acquisition Lead",
      phone: user.phone || "+62 812-3456-7890",
      companyName: user.companyName || "Tech Enterprise",
      companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
      companyWebsite: user.companyWebsite || `https://${user.email.split('@')[1] || 'company.com'}`,
      industry: "Technology & Professional Services",
      location: user.location || "Jakarta, Indonesia",
      companySize: user.companySize || "51-200 Karyawan",
      companyRegistrationNumber: user.companyRegistrationNumber || "",
      hrLinkedInUrl: user.hrLinkedInUrl || "",
      companyLinkedInUrl: user.companyLinkedInUrl || "",
      companyIdDocName: user.companyIdDocName || "",
      subscriptionTier: "Premium",
      savedCandidateIds: [],
      hrVerified: user.hrVerified ?? true,
      hrVerificationStatus: user.hrVerificationStatus || "verified",
      hrVerificationTier: user.hrVerificationTier || "verified_domain",
      hrVerificationMethod: user.hrVerificationMethod || "corporate_domain",
      authorizedDeclarationAccepted: user.authorizedDeclarationAccepted ?? true
    };
    db.recruiters.push(recruiter);
    writeDb(db);
  }

  return res.json({ recruiter });
});

// 2. UPDATE RECRUITER PROFILE
router.put("/me", (req: Request, res: Response) => {
  const db = readDb();
  const user = getSessionUser(req, db);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  if (user.role !== "recruiter") {
    return res.status(403).json({ error: "Forbidden. Role is not recruiter." });
  }

  const updatedData = req.body;
  const index = db.recruiters.findIndex(r => r.id === user.id || (user.id === "rec_1" && r.id === "rec_1"));

  if (index === -1) {
    return res.status(404).json({ error: "Recruiter profile not found." });
  }

  const existingRecruiter = db.recruiters[index];
  const mergedRecruiter: Recruiter = {
    ...existingRecruiter,
    ...updatedData,
    id: existingRecruiter.id, // Immutable ID
    email: existingRecruiter.email // Immutable Email
  };

  db.recruiters[index] = mergedRecruiter;
  writeDb(db);

  return res.json({ success: true, recruiter: mergedRecruiter });
});

// 3. GET DISPATCHED INVITATIONS
router.get("/invitations", (req: Request, res: Response) => {
  const db = readDb();
  const user = getSessionUser(req, db);

  const recruiterId = user ? (user.id === "rec_1" ? "rec_1" : user.id) : "rec_1";
  const invitations = (db.invitations || []).filter(i => i.recruiterId === recruiterId || i.recruiterId === "rec_1");

  return res.json({ invitations: invitations.length > 0 ? invitations : db.invitations || [] });
});

// 4. DISPATCH A NEW INVITATION PITCH
router.post("/invitations", (req: Request, res: Response) => {
  const db = readDb();
  const user = getSessionUser(req, db);

  const { id: incomingId, candidateId, position, message, salaryOffer, interviewLink, scheduledDate } = req.body;

  if (!candidateId || !position || !message) {
    return res.status(400).json({ error: "CandidateId, position, and message are required." });
  }

  const recruiter = (db.recruiters || []).find(r => r.id === user?.id || (user?.id === "rec_1" && r.id === "rec_1")) || 
                    (db.recruiters && db.recruiters[0]) || {
                      id: "rec_1",
                      fullName: "Elena Rostova",
                      companyName: "TechCorp Global",
                      companyLogo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=100&h=100"
                    };

  const newInvitation: Invitation = {
    id: incomingId || ("inv_" + Date.now() + "_" + Math.floor(Math.random() * 1000)),
    recruiterId: recruiter.id,
    recruiterName: recruiter.fullName,
    companyName: recruiter.companyName,
    companyLogo: recruiter.companyLogo,
    candidateId,
    position,
    message,
    salaryOffer: salaryOffer || "Kompetitif Sesuai Pengalaman",
    interviewLink,
    scheduledDate,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  if (!db.invitations) db.invitations = [];
  // Remove if already exists with same id (upsert)
  db.invitations = db.invitations.filter(i => i.id !== newInvitation.id);
  db.invitations.unshift(newInvitation);

  // Send a notification to candidate about the new pitch invitation!
  if (!db.notifications) db.notifications = [];
  const newNotification: NotificationItem = {
    id: "notif_" + Date.now(),
    title: `New Sourcing Invitation: ${position}`,
    body: `${recruiter.companyName} recruiter sent you a direct Sourcing Invitation for a ${position}.`,
    time: "Just now",
    unread: true
  };
  db.notifications.unshift(newNotification);

  writeDb(db);

  return res.status(201).json({ success: true, invitation: newInvitation });
});

// 4b. GET ALL MESSAGES (Recruiter Context)
router.get("/messages", (req: Request, res: Response) => {
  const db = readDb();
  return res.json({ messages: db.messages || [] });
});

// 4c. GET MESSAGE FEED FOR INVITATION CHAT (Recruiter Context)
router.get("/messages/:invitationId", (req: Request, res: Response) => {
  const { invitationId } = req.params;
  const db = readDb();
  const messages = (db.messages || []).filter(m => m.invitationId === invitationId);
  return res.json({ messages });
});

// 4d. GET NOTIFICATIONS (Recruiter Context)
router.get("/notifications", (req: Request, res: Response) => {
  const db = readDb();
  return res.json({ notifications: db.notifications || [] });
});

// 5. POST MESSAGE TO CHAT
router.post("/messages", (req: Request, res: Response) => {
  const { invitationId, content, attachmentName, senderRole: incomingRole } = req.body;
  const db = readDb();
  const user = getSessionUser(req, db);

  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Message content is required." });
  }

  if (!invitationId) {
    return res.status(400).json({ error: "invitationId is required." });
  }

  let invitation = (db.invitations || []).find(i => i.id === invitationId);
  if (!invitation) {
    invitation = {
      id: invitationId,
      recruiterId: user?.role === "recruiter" ? user.id : "rec_1",
      recruiterName: user?.role === "recruiter" ? (user.fullName || "Elena Rostova") : "Elena Rostova",
      companyName: user?.role === "recruiter" ? (user.companyName || "TechCorp Global") : "TechCorp Global",
      companyLogo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=100&h=100",
      candidateId: "cand_1",
      position: "Senior Full-Stack Architect",
      message: "Direct chat session",
      salaryOffer: "Kompetitif",
      status: "pending",
      createdAt: new Date().toISOString()
    };
    if (!db.invitations) db.invitations = [];
    db.invitations.unshift(invitation);
  }

  const isRecruiterSender = incomingRole === "recruiter" || user?.role === "recruiter" || !incomingRole;
  const senderRole: "candidate" | "recruiter" = isRecruiterSender ? "recruiter" : "candidate";

  const newMessage: Message = {
    id: "msg_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    invitationId,
    senderRole,
    content: content.trim(),
    timestamp: new Date().toISOString(),
    attachmentName
  };

  if (!db.messages) db.messages = [];
  db.messages.push(newMessage);

  // Auto-respond with counterpart message for immersive interactive feel
  setTimeout(() => {
    try {
      const refreshedDb = readDb();
      if (!refreshedDb.messages) refreshedDb.messages = [];
      if (!refreshedDb.notifications) refreshedDb.notifications = [];

      if (senderRole === "recruiter") {
        // Candidate replies to recruiter
        const candObj = (refreshedDb.candidates || []).find(c => c.id === invitation.candidateId);
        const candResponse: Message = {
          id: "msg_cand_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          invitationId,
          senderRole: "candidate",
          content: `Hi ${invitation.recruiterName}! Thank you for the update. I have reviewed the requirements, and this sounds like an exceptional fit. Let me know if there's anything else you need before our scheduled call!`,
          timestamp: new Date().toISOString()
        };
        refreshedDb.messages.push(candResponse);

        const recNotif: NotificationItem = {
          id: "notif_cand_" + Date.now(),
          title: `Message from candidate ${candObj?.fullName || "Alex Rivera"}`,
          body: `${candObj?.fullName || "Candidate"} replied to your sourcing chat.`,
          time: "Just now",
          unread: true
        };
        refreshedDb.notifications.unshift(recNotif);
      } else {
        // Recruiter replies to candidate
        const recruiterResponse: Message = {
          id: "msg_rec_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          invitationId,
          senderRole: "recruiter",
          content: `Halo! Terima kasih atas responnya. Saya akan meninjau hal ini bersama tim dan segera menghubungi Anda untuk tahap teknis selanjutnya.`,
          timestamp: new Date().toISOString()
        };
        refreshedDb.messages.push(recruiterResponse);

        const recNotification: NotificationItem = {
          id: "notif_msg_" + Date.now(),
          title: `Pesan baru dari ${invitation.recruiterName || "HR"}`,
          body: `${invitation.companyName || "Perusahaan"} membalas pesan obrolan Anda.`,
          time: "Baru saja",
          unread: true
        };
        refreshedDb.notifications.unshift(recNotification);
      }

      writeDb(refreshedDb);
    } catch (e) {
      console.error("Auto-respond chat simulation failed:", e);
    }
  }, 1800);

  writeDb(db);

  return res.status(200).json({ success: true, message: newMessage });
});

// 6. TOGGLE BOOKMARK FOR RECRUITER
router.post("/bookmarks", (req: Request, res: Response) => {
  const { candidateId } = req.body;
  const db = readDb();
  const user = getSessionUser(req, db);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  if (user.role !== "recruiter") {
    return res.status(403).json({ error: "Forbidden." });
  }

  const recruiterIndex = db.recruiters.findIndex(r => r.id === user.id || (user.id === "rec_1" && r.id === "rec_1"));
  if (recruiterIndex === -1) {
    return res.status(404).json({ error: "Recruiter profile not found." });
  }

  const recruiter = db.recruiters[recruiterIndex];
  if (!recruiter.savedCandidateIds) {
    recruiter.savedCandidateIds = [];
  }

  const hasBookmark = recruiter.savedCandidateIds.includes(candidateId);
  if (hasBookmark) {
    recruiter.savedCandidateIds = recruiter.savedCandidateIds.filter(id => id !== candidateId);
  } else {
    recruiter.savedCandidateIds.push(candidateId);
  }

  db.recruiters[recruiterIndex] = recruiter;
  writeDb(db);

  return res.json({ success: true, savedCandidateIds: recruiter.savedCandidateIds });
});

// 7. GET JOBS POSTED BY RECRUITER
router.get("/jobs", (req: Request, res: Response) => {
  const db = readDb();
  const user = getSessionUser(req, db);

  const recruiterId = user ? user.id : "rec_1";
  const rawJobs = (db.jobOpenings || []).filter(j => j.recruiterId === recruiterId || recruiterId === "rec_1" || recruiterId === "admin_1");
  
  // Calculate dynamic applicantCount to match real application records
  const jobs = rawJobs.map(j => {
    const matchingCount = (db.jobApplications || []).filter(a => a.jobId === j.id).length;
    return {
      ...j,
      applicantCount: matchingCount
    };
  });

  return res.json({ jobs });
});

// 8. POST NEW JOB OPENING BY HR
router.post("/jobs", (req: Request, res: Response) => {
  const db = readDb();
  const user = getSessionUser(req, db);

  let recruiter = db.recruiters.find(r => r.id === (user?.id || "rec_1")) || db.recruiters[0];

  const {
    title,
    department,
    location,
    workplaceType,
    employmentType,
    experienceLevel,
    salaryMin,
    salaryMax,
    salaryFormatted,
    description,
    responsibilities,
    requirements,
    skills,
    benefits,
    deadline
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Job title and description are required." });
  }

  const newJob: JobOpening = {
    id: `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    recruiterId: recruiter.id,
    recruiterName: recruiter.fullName,
    companyName: recruiter.companyName,
    companyLogo: recruiter.companyLogo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
    companyWebsite: recruiter.companyWebsite || "https://techcorp-global.com",
    title,
    department: department || "Engineering",
    location: location || "Jakarta / Remote",
    workplaceType: workplaceType || "Remote",
    employmentType: employmentType || "Full-time",
    experienceLevel: experienceLevel || "Mid-level",
    salaryMin: Number(salaryMin) || 15000000,
    salaryMax: Number(salaryMax) || 25000000,
    salaryFormatted: salaryFormatted || `Rp ${Number(salaryMin || 15000000).toLocaleString("id-ID")} - Rp ${Number(salaryMax || 25000000).toLocaleString("id-ID")} / bln`,
    description,
    responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split("\n").filter(Boolean) : []),
    requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split("\n").filter(Boolean) : []),
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map((s: string) => s.trim()).filter(Boolean) : ["React", "TypeScript"]),
    benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split("\n").filter(Boolean) : ["Asuransi Kesehatan", "Remote Friendly", "Bonus Tahunan"]),
    status: "active",
    applicantCount: 0,
    postedAt: new Date().toISOString().split("T")[0],
    deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  };

  if (!db.jobOpenings) {
    db.jobOpenings = [];
  }
  db.jobOpenings.unshift(newJob);

  const notif: NotificationItem = {
    id: "notif_job_posted_" + Date.now(),
    title: "Lowongan Berhasil Dipublikasikan",
    body: `Lowongan "${newJob.title}" kini aktif dan dapat dilamar oleh ribuan talenta.`,
    time: "Just now",
    unread: true
  };
  db.notifications.unshift(notif);

  writeDb(db);

  return res.status(201).json({ success: true, job: newJob });
});

// 9. UPDATE JOB OPENING
router.put("/jobs/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const jobIndex = (db.jobOpenings || []).findIndex(j => j.id === id);

  if (jobIndex === -1) {
    return res.status(404).json({ error: "Job opening not found." });
  }

  const existing = db.jobOpenings[jobIndex];
  const updatedJob: JobOpening = {
    ...existing,
    ...req.body,
    id: existing.id,
    recruiterId: existing.recruiterId
  };

  db.jobOpenings[jobIndex] = updatedJob;
  writeDb(db);

  return res.json({ success: true, job: updatedJob });
});

// 10. GET APPLICANTS FOR A SPECIFIC JOB
router.get("/jobs/:id/applicants", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();

  const applicants = (db.jobApplications || []).filter(a => a.jobId === id);
  return res.json({ applicants, applications: applicants, total: applicants.length });
});

// 11. UPDATE APPLICATION STATUS (Reviewing, Interview, Offered, Rejected)
router.put("/applications/:appId/status", (req: Request, res: Response) => {
  const { appId } = req.params;
  const { status, interviewDate, meetLink, offerSalary, offerStartDate, offerNotes } = req.body;
  const db = readDb();

  const appIndex = (db.jobApplications || []).findIndex(a => a.id === appId);
  if (appIndex === -1) {
    return res.status(404).json({ error: "Application not found." });
  }

  const app = db.jobApplications[appIndex];

  // Business Rule 1: Rejection cannot be undone (irreversible decision)
  if (app.status === "rejected" && status !== "rejected") {
    return res.status(400).json({
      error: "Status lamaran yang telah ditolak bersifat permanen dan tidak dapat diubah kembali."
    });
  }

  // Business Rule 2: Cannot reject once an offer is extended or accepted
  if ((app.status === "offered" || app.status === "accepted") && status === "rejected") {
    return res.status(400).json({
      error: "Tawaran pekerjaan telah diberikan atau diterima kandidat. Lamaran tidak dapat ditolak."
    });
  }

  app.status = status;
  if (interviewDate !== undefined) app.interviewDate = interviewDate;
  if (meetLink !== undefined) app.meetLink = meetLink;
  if (offerSalary !== undefined) app.offerSalary = offerSalary;
  if (offerStartDate !== undefined) app.offerStartDate = offerStartDate;
  if (offerNotes !== undefined) app.offerNotes = offerNotes;

  db.jobApplications[appIndex] = app;

  // Add notification to candidate
  const statusLabels: Record<string, string> = {
    reviewing: "Sedang Ditinjau HR",
    interview: "Diundang ke Tahap Wawancara",
    offered: "Menerima Tawaran Pekerjaan Resmi",
    accepted: "Tawaran Pekerjaan Telah Diterima",
    rejected: "Status Diperbarui"
  };

  const notif: NotificationItem = {
    id: "notif_app_status_" + Date.now(),
    title: `Status Lamaran: ${statusLabels[status] || status}`,
    body: `${app.companyName} telah memperbarui status lamaran Anda untuk "${app.jobTitle}".`,
    time: "Just now",
    unread: true
  };
  db.notifications.unshift(notif);

  writeDb(db);

  return res.json({ success: true, application: app });
});

export default router;
