/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import authRoutes from "./server/authRoutes";
import candidateRoutes from "./server/candidateRoutes";
import recruiterRoutes from "./server/recruiterRoutes";
import adminRoutes from "./server/adminRoutes";
import { readDb, writeDb } from "./server/authDb";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/admin", adminRoutes);
const PORT = 3000;

// Initialize Gemini safely with a guard
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

/**
 * Public Endpoint: Fetch All Curated Educational Programs (Trainings, Scholarships, Internships)
 */
app.get("/api/programs", (req: Request, res: Response) => {
  const db = readDb();
  res.json({
    success: true,
    trainings: db.trainings || [],
    scholarships: db.scholarships || [],
    internships: db.internships || []
  });
});

/**
 * Public Endpoint: Propose Partnership, Training Program, or Send Inquiries/Reports to Super Admin Inbox
 */
app.post("/api/programs/proposals", (req: Request, res: Response) => {
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
    requirements: Array.isArray(req.body.requirements) 
      ? req.body.requirements 
      : typeof req.body.requirements === "string" 
      ? req.body.requirements.split("\n").map((r: string) => r.trim()).filter(Boolean)
      : ["Warga Negara Indonesia (WNI)"],
    registrationLink: req.body.registrationLink || "https://talenthub.id",
    imageUrl: req.body.imageUrl || "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=300",
    submittedAt: new Date().toISOString(),
    status: "pending" as const,
    adminNotes: ""
  };

  if (!db.proposals) db.proposals = [];
  db.proposals.unshift(newProposal);
  writeDb(db);

  return res.json({
    success: true,
    proposal: newProposal,
    message: "Pengajuan kemitraan program pelatihan berhasil dikirim ke Pusat Pesan Super Admin."
  });
});

/**
 * Endpoint: AI Resume Analysis & ATS Checker
 * Evaluates raw resume text, provides a score, and suggestions.
 */
app.post("/api/ai/analyze-resume", async (req: Request, res: Response) => {
  const { resumeText, targetHeadline } = req.body;

  if (!resumeText) {
    return res.status(400).json({ error: "Resume text is required" });
  }

  const ai = getAiClient();

  if (!ai) {
    // Elegant fallback simulation if the developer doesn't have an active Gemini API key set up yet
    console.warn("GEMINI_API_KEY not found or default. Running mock/simulated analysis.");
    
    // Create highly customized simulated feedback based on the target headline
    const mockScore = Math.floor(Math.random() * 15) + 75; // 75 - 90
    return res.json({
      score: mockScore,
      analysis: {
        summary: `Your profile displays excellent core competencies aligned with ${targetHeadline || "technical roles"}. However, visual structure and keyword indexing can be boosted.`,
        formattingScore: "Excellent (Margins, structure and bullet formatting are optimal)",
        atsKeywordsMatched: ["React", "TypeScript", "Node.js", "Git", "REST APIs"],
        atsKeywordsMissing: ["System Design", "CI/CD Pipeline", "Unit Testing", "Microservices"],
        improvements: [
          "Incorporate strong action verbs (e.g., 'Architected', 'Pioneered') at the start of each experience description.",
          "Add quantitative metrics (e.g., 'Reduced loading latency by 180ms') to back up your technical achievements.",
          "Group your programming skills into distinct subcategories (e.g., Languages, Frameworks, Tools) to assist search algorithms.",
          "Ensure your professional email and LinkedIn URL are clearly visible in the header margin."
        ],
        targetRoleMatch: `82% Match for target: ${targetHeadline || "Software Engineer"}`
      },
      simulated: true
    });
  }

  try {
    const prompt = `
      You are an elite corporate technical recruiter and ATS (Applicant Tracking System) expert.
      Please evaluate the following resume text and provide a professional, deep, and constructive audit.
      Target Headline / Role: ${targetHeadline || "General Full-Stack Developer"}
      Resume Content:
      ---
      ${resumeText}
      ---

      Please return the response as a valid JSON object matching this structure:
      {
        "score": number (0 to 100),
        "analysis": {
          "summary": "string summary of the resume strength and alignment",
          "formattingScore": "string review of formatting/structure quality",
          "atsKeywordsMatched": ["array of strings (keywords matched)"],
          "atsKeywordsMissing": ["array of strings (keywords missing that are critical for this headline)"],
          "improvements": ["array of strings of highly specific, actionable improvements"],
          "targetRoleMatch": "string stating role alignment percentage and summary"
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "ATS score out of 100" },
            analysis: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                formattingScore: { type: Type.STRING },
                atsKeywordsMatched: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                atsKeywordsMissing: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                improvements: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                targetRoleMatch: { type: Type.STRING }
              },
              required: ["summary", "formattingScore", "atsKeywordsMatched", "atsKeywordsMissing", "improvements", "targetRoleMatch"]
            }
          },
          required: ["score", "analysis"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText.trim());
    return res.json({ ...data, simulated: false });
  } catch (error: any) {
    console.error("Gemini API Error in resume analysis:", error);
    return res.status(500).json({ 
      error: "Failed to analyze resume via Gemini API. Fallback simulator triggered.",
      details: error.message
    });
  }
});

/**
 * Endpoint: AI Skill Gap Analysis
 * Compares current skills against a target role, suggests skills to acquire,
 * and recommends types of training programs to look for.
 */
app.post("/api/ai/skill-gap", async (req: Request, res: Response) => {
  const { currentSkills, targetRole } = req.body;

  if (!targetRole) {
    return res.status(400).json({ error: "Target role is required" });
  }

  const ai = getAiClient();

  if (!ai) {
    // Safe mock fallback
    return res.json({
      targetRole,
      matchPercentage: 70,
      skillsAcquired: currentSkills || ["JavaScript", "HTML/CSS"],
      gapSkills: ["Docker", "Kubernetes", "System Architecture", "TypeScript", "CI/CD"],
      recommendations: [
        "Take a certified devops program or a container course to learn Docker.",
        "Practice building robust REST APIs with TypeScript instead of vanilla JS.",
        "Read articles on distributed computing and standard microservice API gateways."
      ],
      simulated: true
    });
  }

  try {
    const prompt = `
      You are an expert technical architect and career advisor.
      Analyze the candidate's current skills: [${(currentSkills || []).join(", ")}]
      against the requirements of the target role: "${targetRole}".
      
      Determine:
      1. What relevant skills they already possess.
      2. The critical gap skills they are missing.
      3. A realistic matching percentage (0 to 100).
      4. Actionable recommendations to close the skill gap.

      Please return the response as a valid JSON object matching this structure:
      {
        "targetRole": "string",
        "matchPercentage": number,
        "skillsAcquired": ["array of strings"],
        "gapSkills": ["array of strings"],
        "recommendations": ["array of strings of specific training and learning directions"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetRole: { type: Type.STRING },
            matchPercentage: { type: Type.INTEGER },
            skillsAcquired: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            gapSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["targetRole", "matchPercentage", "skillsAcquired", "gapSkills", "recommendations"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText.trim());
    return res.json({ ...data, simulated: false });
  } catch (error: any) {
    console.error("Gemini API Error in skill-gap analysis:", error);
    return res.status(500).json({ 
      error: "Failed to perform skill gap analysis via Gemini API.",
      details: error.message
    });
  }
});

// -------------------------------------------------------------
// VITE OR STATIC FILE SERVING MIDDLEWARE
// -------------------------------------------------------------

async function setupMiddleware() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving built static files from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

setupMiddleware();
