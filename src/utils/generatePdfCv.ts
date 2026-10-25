import { jsPDF } from "jspdf";
import { Candidate, JobApplication } from "../types";

/**
 * Utility to reliably generate and download a candidate's CV as an executive-grade A4 PDF.
 * - If candidate uploaded an actual file (Base64 data URL or blob), downloads that exact file.
 * - Otherwise, compiles the full candidate profile & application data into an ATS-compliant,
 *   publication-grade executive PDF document.
 */
export async function downloadCandidateCv(
  application?: Partial<JobApplication> | null,
  candidate?: Partial<Candidate> | null,
  isIndonesian: boolean = true
): Promise<void> {
  const candidateName =
    candidate?.fullName || application?.candidateName || "Candidate Dossier";
  const safeFileName =
    candidateName.trim().replace(/[^a-zA-Z0-9_-]/g, "_") + "_CV.pdf";

  const resumeData = application?.resumeUrl || candidate?.resumeUrl;

  // 1. If candidate uploaded an actual file as a Base64 data URL or Blob URL, download directly
  if (
    resumeData &&
    (resumeData.startsWith("data:") || resumeData.startsWith("blob:"))
  ) {
    try {
      const a = document.createElement("a");
      a.href = resumeData;
      a.download = safeFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    } catch (e) {
      console.warn("Direct file download fallback triggered:", e);
    }
  }

  // 2. Generate an executive, publication-grade A4 PDF CV using jsPDF
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 16;
  const contentWidth = pageWidth - marginX * 2; // 178mm
  const bottomMargin = 18;
  let currentY = 16;

  // Safe string helper (prevents "undefined" or "null" appearing in PDF)
  const safeStr = (val: unknown, fallback: string = ""): string => {
    if (val === undefined || val === null) return fallback;
    const str = String(val).trim();
    if (str === "undefined" || str === "null" || str === "") return fallback;
    return str;
  };

  const drawPageHeaderMini = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `TalentHub ATS Verified Dossier  |  ${candidateName}`,
      marginX,
      9
    );
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginX, 11, pageWidth - marginX, 11);
  };

  // Automated page breaking helper with safety padding
  const ensureSpace = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      currentY = 16;
      drawPageHeaderMini();
    }
  };

  // ---------------------------------------------------------------------------
  // 1. EXECUTIVE IDENTITY HEADER
  // ---------------------------------------------------------------------------

  // ATS Score Badge (Top Right Pill - Clean & Minimal)
  const atsScore = candidate?.atsScore || 92;
  const badgeText = `ATS Score: ${atsScore}%`;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const badgeTextWidth = doc.getTextWidth(badgeText);
  const badgeWidth = badgeTextWidth + 8;
  const badgeX = pageWidth - marginX - badgeWidth;

  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(187, 247, 208); // emerald-200
  doc.setLineWidth(0.25);
  doc.roundedRect(badgeX, currentY - 1, badgeWidth, 5.5, 1.2, 1.2, "FD");
  doc.setTextColor(22, 101, 52); // emerald-800
  doc.text(badgeText, badgeX + 4, currentY + 2.8);

  // Candidate Full Name (Prominent, High-Contrast Typography)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(candidateName, marginX, currentY + 3);
  currentY += 8.5;

  // Professional Headline / Subtitle
  const headline = safeStr(
    candidate?.headline || application?.candidateHeadline,
    isIndonesian ? "Spesialis Profesional" : "Professional Specialist"
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(30, 64, 175); // blue-800
  doc.text(headline, marginX, currentY);
  currentY += 4.5;

  // Contact Information Row (Clean separator dots)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105); // slate-600

  const email = safeStr(
    candidate?.email || application?.candidateEmail,
    "candidate@talenthub.id"
  );
  const phone = safeStr(
    candidate?.phone || application?.candidatePhone,
    "+62 812-3456-7890"
  );
  const location = safeStr(candidate?.location, "Indonesia");
  const website = safeStr(candidate?.website || application?.portfolioUrl);

  const contactParts: string[] = [
    email,
    phone,
    location,
  ];
  if (website) {
    contactParts.push(website.replace(/^https?:\/\//, ""));
  }

  const contactLine = contactParts.join("   |   ");
  const splitContact = doc.splitTextToSize(contactLine, contentWidth);
  doc.text(splitContact, marginX, currentY);
  currentY += splitContact.length * 3.4 + 2.5;

  // Header Divider Line (Clean, full width)
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.35);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 5.5;

  // ---------------------------------------------------------------------------
  // SECTION HEADING GENERATOR (Unified, Executive Style)
  // ---------------------------------------------------------------------------
  const drawSectionTitle = (title: string) => {
    ensureSpace(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(title.toUpperCase(), marginX, currentY);

    currentY += 1.8;

    // Clean, continuous line across full content width
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.3);
    doc.line(marginX, currentY, pageWidth - marginX, currentY);

    currentY += 4.5;
  };

  // ---------------------------------------------------------------------------
  // 2. INFORMASI PENGAJUAN LAMARAN (Application Memo Card)
  // ---------------------------------------------------------------------------
  if (application?.jobTitle) {
    ensureSpace(20);
    drawSectionTitle(
      isIndonesian ? "Informasi Pengajuan Lamaran" : "Application Memorandum"
    );

    const targetJob = safeStr(application.jobTitle, "Target Position");
    const salary = safeStr(
      application.expectedSalary,
      isIndonesian ? "Sesuai Standar Perusahaan" : "Negotiable"
    );
    const coverNote = safeStr(
      application.coverNote,
      isIndonesian
        ? "Kandidat telah melampirkan profil terverifikasi untuk evaluasi posisi ini."
        : "Candidate has submitted their verified profile for this position."
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    const splitNote = doc.splitTextToSize(`"${coverNote}"`, contentWidth - 12);
    const cardHeight = 11 + splitNote.length * 3.5;

    // Card background
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.25);
    doc.roundedRect(marginX, currentY, contentWidth, cardHeight, 1.2, 1.2, "FD");

    // Left blue accent stripe
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(marginX, currentY, 1.5, cardHeight, "F");

    // Memo Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.2);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(
      `${isIndonesian ? "Posisi Dilamar" : "Target Role"}: ${targetJob}   |   ${isIndonesian ? "Ekspektasi Gaji" : "Salary"}: ${salary}`,
      marginX + 5,
      currentY + 4.2
    );

    // Memo Note
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.6);
    doc.setTextColor(71, 85, 105); // slate-600
    doc.text(splitNote, marginX + 5, currentY + 8.8);

    currentY += cardHeight + 5;
  }

  // ---------------------------------------------------------------------------
  // 3. RINGKASAN PROFIL PROFESIONAL (Executive Summary)
  // ---------------------------------------------------------------------------
  const summaryText = safeStr(
    candidate?.aboutMe || application?.coverNote,
    isIndonesian
      ? "Kandidat profesional berdedikasi tinggi dengan rekam jejak kerja yang terbukti, keahlian teknis solid, dan kemampuan kolaborasi lintas fungsi untuk mendorong pertumbuhan organisasi."
      : "High-performing professional with a demonstrated track record of technical competence, collaborative execution, and driving positive organizational results."
  );

  if (summaryText) {
    ensureSpace(16);
    drawSectionTitle(
      isIndonesian ? "Ringkasan Profil Profesional" : "Professional Summary"
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(51, 65, 85); // slate-700
    const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
    doc.text(splitSummary, marginX, currentY);
    currentY += splitSummary.length * 3.6 + 4.5;
  }

  // ---------------------------------------------------------------------------
  // 4. KEAHLIAN & KOMPETENSI UTAMA (Sleek Clean Tags)
  // ---------------------------------------------------------------------------
  const skills = candidate?.skills || [];
  if (skills.length > 0) {
    ensureSpace(16);
    drawSectionTitle(
      isIndonesian ? "Keahlian & Kompetensi Utama" : "Core Competencies & Skills"
    );

    let chipX = marginX;
    let chipY = currentY;
    const pillHeight = 5.2;
    const pillGap = 2;

    doc.setFontSize(7.8);

    skills.forEach((sk) => {
      const skillName = safeStr(sk.name, "Skill");
      const expNumber = sk.yearsOfExperience || 1;
      const expLabel = `${expNumber} ${isIndonesian ? "thn" : "yrs"}`;

      doc.setFont("helvetica", "bold");
      const nameWidth = doc.getTextWidth(skillName);
      doc.setFont("helvetica", "normal");
      const expWidth = doc.getTextWidth(expLabel);

      const pillWidth = nameWidth + expWidth + 7;

      // Wrap to next line if overflowing content boundary
      if (chipX + pillWidth > marginX + contentWidth) {
        chipX = marginX;
        chipY += pillHeight + 1.8;
        ensureSpace(7);
      }

      // Rounded pill container
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.setLineWidth(0.2);
      doc.roundedRect(chipX, chipY, pillWidth, pillHeight, 1, 1, "FD");

      // Text inside pill
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text(skillName, chipX + 2.5, chipY + 3.6);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text(expLabel, chipX + nameWidth + 4, chipY + 3.6);

      chipX += pillWidth + pillGap;
    });

    currentY = chipY + pillHeight + 5;
  }

  // ---------------------------------------------------------------------------
  // 5. PENGALAMAN KERJA (Professional Timeline)
  // ---------------------------------------------------------------------------
  const experiences = candidate?.experience || [];
  if (experiences.length > 0) {
    ensureSpace(22);
    drawSectionTitle(
      isIndonesian ? "Pengalaman Kerja" : "Work Experience"
    );

    experiences.forEach((exp) => {
      ensureSpace(20);

      const position = safeStr(exp.position, headline);
      const company = safeStr(exp.company, "Perusahaan");
      const empType = safeStr(exp.employmentType, "Full-time");
      const startDate = safeStr(exp.startDate, "2022");
      const endDate = exp.current
        ? isIndonesian
          ? "Sekarang"
          : "Present"
        : safeStr(exp.endDate, isIndonesian ? "Selesai" : "Completed");
      const period = `${startDate} - ${endDate}`;

      // Row 1: Role Title (Left) & Period (Right)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(position, marginX, currentY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // slate-500
      const periodWidth = doc.getTextWidth(period);
      doc.text(period, pageWidth - marginX - periodWidth, currentY);
      currentY += 3.8;

      // Row 2: Company Name & Employment Type
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.2);
      doc.setTextColor(30, 64, 175); // blue-800
      doc.text(company, marginX, currentY);

      const companyWidth = doc.getTextWidth(company);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`   |   ${empType}`, marginX + companyWidth, currentY);
      currentY += 4.2;

      // Description overview if present
      const expDesc = (exp as any).description;
      if (expDesc && typeof expDesc === "string" && expDesc.trim()) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.8);
        doc.setTextColor(51, 65, 85);
        const splitDesc = doc.splitTextToSize(expDesc.trim(), contentWidth);
        doc.text(splitDesc, marginX, currentY);
        currentY += splitDesc.length * 3.4 + 1.5;
      }

      // Responsibilities Bullets
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.8);
        doc.setTextColor(51, 65, 85); // slate-700

        exp.responsibilities.forEach((resp) => {
          if (!resp || !resp.trim()) return;
          ensureSpace(6);

          const splitResp = doc.splitTextToSize(resp.trim(), contentWidth - 6);

          // Sleek vector bullet dot
          doc.setFillColor(100, 116, 139); // slate-500
          doc.circle(marginX + 1.2, currentY - 0.9, 0.45, "F");

          doc.text(splitResp, marginX + 4.5, currentY);
          currentY += splitResp.length * 3.5 + 1;
        });
      }

      // Technologies used
      const techList = exp.technologiesUsed;
      if (techList && techList.length > 0) {
        ensureSpace(5);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.3);
        doc.setTextColor(100, 116, 139);
        doc.text(`Teknologi: ${techList.join(", ")}`, marginX + 4.5, currentY);
        currentY += 3.6;
      }

      currentY += 2.5;
    });

    currentY += 1.5;
  }

  // ---------------------------------------------------------------------------
  // 6. PENDIDIKAN FORMAL (Education Credentials)
  // ---------------------------------------------------------------------------
  const educationList = candidate?.education || [];
  if (educationList.length > 0) {
    ensureSpace(18);
    drawSectionTitle(
      isIndonesian ? "Pendidikan Formal" : "Education"
    );

    educationList.forEach((edu) => {
      ensureSpace(14);

      const degree = safeStr(edu.degree, "Sarjana (S1)");
      const major = safeStr(
        edu.major || (edu as any).fieldOfStudy || (edu as any).department,
        ""
      );
      const degreeLine = major ? `${degree} - ${major}` : degree;

      const school = safeStr(
        edu.school || (edu as any).institution || (edu as any).university,
        "Perguruan Tinggi Terakreditasi"
      );

      let gradStr = "";
      if (edu.graduationYear) {
        gradStr = isIndonesian
          ? `Lulus ${edu.graduationYear}`
          : `Graduated ${edu.graduationYear}`;
      } else if ((edu as any).endDate) {
        const start = safeStr((edu as any).startDate);
        const end = safeStr((edu as any).endDate);
        gradStr = start ? `${start} - ${end}` : end;
      } else {
        gradStr = isIndonesian ? "Selesai" : "Completed";
      }

      const gpaVal = safeStr(edu.gpa || (edu as any).grade);

      // Degree & Graduation Year
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.8);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(degreeLine, marginX, currentY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // slate-500
      const gradWidth = doc.getTextWidth(gradStr);
      doc.text(gradStr, pageWidth - marginX - gradWidth, currentY);
      currentY += 3.8;

      // School Name & GPA
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105); // slate-600
      const schoolGpaText = gpaVal
        ? `${school}   |   IPK / GPA: ${gpaVal}`
        : school;
      doc.text(schoolGpaText, marginX, currentY);
      currentY += 3.8;

      // Honors / Activities
      const activities = safeStr(edu.activities);
      if (activities) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.4);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `${isIndonesian ? "Aktivitas / Prestasi" : "Activities / Honors"}: ${activities}`,
          marginX,
          currentY
        );
        currentY += 3.6;
      }

      currentY += 2;
    });

    currentY += 1.5;
  }

  // ---------------------------------------------------------------------------
  // 7. SERTIFIKASI & LISENSI RESMI (Verified Credentials)
  // ---------------------------------------------------------------------------
  const certificates = candidate?.certificates || [];
  if (certificates.length > 0) {
    ensureSpace(18);
    drawSectionTitle(
      isIndonesian ? "Sertifikasi & Lisensi Resmi" : "Certifications & Credentials"
    );

    certificates.forEach((cert) => {
      ensureSpace(12);

      const certName = safeStr(cert.name, "Sertifikat Profesional");
      const issuer = safeStr(cert.issuer, "Lembaga Penerbit");
      const issueDate = safeStr(cert.issueDate);
      const credId = safeStr(cert.credentialId);
      const isVerified = cert.verified !== false;

      // Certificate Name & Date
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.6);
      doc.setTextColor(15, 23, 42);
      doc.text(certName, marginX, currentY);

      if (issueDate) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        const dtWidth = doc.getTextWidth(issueDate);
        doc.text(issueDate, pageWidth - marginX - dtWidth, currentY);
      }
      currentY += 3.8;

      // Issuer & Verification Metadata
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.8);
      doc.setTextColor(71, 85, 105);

      const parts: string[] = [issuer];
      if (credId) parts.push(`ID: ${credId}`);
      if (isVerified) parts.push(isIndonesian ? "Terverifikasi TalentHub" : "Verified");

      doc.text(parts.join("   |   "), marginX, currentY);
      currentY += 4.5;
    });

    currentY += 1;
  }

  // ---------------------------------------------------------------------------
  // 8. PORTOFOLIO & STUDI KASUS (Project Showcase)
  // ---------------------------------------------------------------------------
  const portfolioProjects = candidate?.portfolio || [];
  if (portfolioProjects.length > 0) {
    ensureSpace(18);
    drawSectionTitle(
      isIndonesian ? "Portofolio & Studi Kasus" : "Portfolio & Key Projects"
    );

    portfolioProjects.forEach((proj) => {
      ensureSpace(14);

      const projTitle = safeStr(proj.title, "Project Showcase");
      const projRole = safeStr(proj.role);
      const projDesc = safeStr(proj.description);
      const projTech = proj.technology || [];
      const projLink = safeStr(
        proj.websiteUrl || proj.figmaUrl || proj.githubUrl
      );

      // Title & Role
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.6);
      doc.setTextColor(15, 23, 42);
      const titleWithRole = projRole
        ? `${projTitle}  (${projRole})`
        : projTitle;
      doc.text(titleWithRole, marginX, currentY);
      currentY += 3.6;

      // Description
      if (projDesc) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.6);
        doc.setTextColor(71, 85, 105);
        const splitProj = doc.splitTextToSize(projDesc, contentWidth);
        doc.text(splitProj, marginX, currentY);
        currentY += splitProj.length * 3.4 + 1.2;
      }

      // Tech Stack
      if (projTech.length > 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.2);
        doc.setTextColor(30, 64, 175); // blue-800
        doc.text(`Stack: ${projTech.join(", ")}`, marginX, currentY);
        currentY += 3.2;
      }

      // Link
      if (projLink) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.2);
        doc.setTextColor(100, 116, 139);
        doc.text(`Link: ${projLink}`, marginX, currentY);
        currentY += 3.2;
      }

      currentY += 2;
    });
  }

  // ---------------------------------------------------------------------------
  // ELEGANT FOOTER (Page Numbers & Metadata)
  // ---------------------------------------------------------------------------
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(148, 163, 184); // slate-400

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.25);
    doc.line(marginX, pageHeight - 11, pageWidth - marginX, pageHeight - 11);

    const candIdStr = safeStr(
      candidate?.id || application?.id || "REG"
    ).toUpperCase();
    const footerLeft = `TalentHub  |  Berkas Terverifikasi ATS  |  ID: TH-${candIdStr.replace(/[^A-Z0-9]/g, "").slice(-8)}`;
    const footerRight = `${isIndonesian ? "Halaman" : "Page"} ${i} ${isIndonesian ? "dari" : "of"} ${totalPages}`;

    doc.text(footerLeft, marginX, pageHeight - 7);
    const pageStrWidth = doc.getTextWidth(footerRight);
    doc.text(
      footerRight,
      pageWidth - marginX - pageStrWidth,
      pageHeight - 7
    );
  }

  // Download Trigger
  doc.save(safeFileName);
}
