import { 
  Candidate, 
  Recruiter, 
  Invitation, 
  Message, 
  TrainingProgram, 
  Scholarship, 
  Internship, 
  CareerArticle,
  JobOpening,
  JobApplication,
  TrainingProposal,
  CandidateScholarshipApplication,
  SkillCategory, 
  SkillLevel,
  DEFAULT_PROFILE_IMAGE
} from "../types";

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "cand_1",
    fullName: "Rizky Pratama",
    email: "rizky.pratama@example.com",
    phone: "+62 812-8765-4321",
    headline: "Senior Full Stack Engineer | React & Node.js Specialist",
    aboutMe: "Senior Full Stack Engineer dengan pengalaman 6+ tahun dalam merancang arsitektur aplikasi web berkinerja tinggi. Berpengalaman memimpin tim engineering, mengimplementasikan TypeScript, React 19, arsitektur Microservices Node.js, dan optimasi database PostgreSQL skala jutaan pengguna aktif.",
    location: "Jakarta Selatan, Indonesia",
    nationality: "Indonesian",
    avatar: DEFAULT_PROFILE_IMAGE,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=400",
    website: "https://rizkypratama.dev",
    github: "https://github.com/rizkypratama",
    linkedin: "https://linkedin.com/in/rizkypratama-dev",
    expectedSalary: "Rp 24.000.000 / bulan",
    availability: "Immediate",
    employmentType: ["Full-time", "Contract"],
    preferredLocation: "Jakarta / Remote",
    openToWork: true,
    remote: true,
    hybrid: true,
    onsite: false,
    relocation: true,
    profileCompletion: 100,
    verified: true,
    atsScore: 94,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34281-large.mp4",
    skills: [
      { id: "sk_1", name: "React", level: SkillLevel.Expert, yearsOfExperience: 5, category: SkillCategory.Programming, endorsements: 28 },
      { id: "sk_2", name: "TypeScript", level: SkillLevel.Expert, yearsOfExperience: 4, category: SkillCategory.Programming, endorsements: 22 },
      { id: "sk_3", name: "Node.js", level: SkillLevel.Expert, yearsOfExperience: 5, category: SkillCategory.Programming, endorsements: 19 },
      { id: "sk_4", name: "System Design", level: SkillLevel.Expert, yearsOfExperience: 4, category: SkillCategory.SoftSkill, endorsements: 14 },
      { id: "sk_5", name: "Docker", level: SkillLevel.Intermediate, yearsOfExperience: 3, category: SkillCategory.Programming, endorsements: 10 },
      { id: "sk_6", name: "Figma to Code", level: SkillLevel.Expert, yearsOfExperience: 4, category: SkillCategory.Design, endorsements: 12 },
    ],
    experience: [
      {
        id: "exp_1",
        company: "PT GoTo Gojek Tokopedia Tbk",
        position: "Senior Software Engineer",
        employmentType: "Full-time",
        startDate: "2024-02",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Lead a core UI performance squad aiming to optimize Next.js rendering pipeline for global SaaS brands.",
          "Design and build internal component libraries integrated across millions of user dashboards."
        ],
        achievements: [
          "Optimized runtime core web vitals resulting in a 22% improvement in global LCP metric.",
          "Mentored 6 associate software engineers in full-stack architecture and robust testing."
        ],
        technologiesUsed: ["React", "TypeScript", "Next.js", "Serverless", "Tailwind CSS"]
      },
      {
        id: "exp_2",
        company: "Tokopedia",
        position: "Software Engineer II",
        employmentType: "Full-time",
        startDate: "2021-08",
        endDate: "2024-01",
        current: false,
        responsibilities: [
          "Developed high-throughput API integrations for payment checkout components handling millions in weekly transaction value.",
          "Maintained robust server-side Node.js and Go backends with automated test suites."
        ],
        achievements: [
          "Reduced payment-form loading latency by 180ms through chunk-splitting and lazy-loading policies.",
          "Redesigned error handling middlewares which trimmed fallback retry timeouts by 30%."
        ],
        technologiesUsed: ["Node.js", "PostgreSQL", "React", "Docker", "Redis"]
      }
    ],
    education: [
      {
        id: "edu_1",
        school: "Universitas Indonesia (UI)",
        degree: "Sarjana Komputer (S.Kom)",
        major: "Computer Science",
        gpa: "3.85",
        graduationYear: 2021,
        activities: "Lead Tutor for Data Structures course, Hackathon Champion"
      }
    ],
    certificates: [
      {
        id: "cert_1",
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services (AWS)",
        issueDate: "2023-05",
        expirationDate: "2026-05",
        credentialId: "AWS-ASA-99881",
        credentialUrl: "https://aws.amazon.com/verification",
        pdfName: "aws_solutions_architect.pdf",
        verified: true
      },
      {
        id: "cert_2",
        name: "React Advanced Core Certificate",
        issuer: "Meta",
        issueDate: "2022-10",
        expirationDate: "Never",
        credentialId: "META-ADV-RX-33",
        credentialUrl: "https://meta.com/verification",
        pdfName: "meta_react_advanced.pdf",
        verified: true
      }
    ],
    portfolio: [
      {
        id: "proj_1",
        title: "SaaS Multi-Tenant Payment Hub",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
        description: "A complete white-label subscription billing gateway dashboard featuring sub-merchant routing, dynamic tax calculations, and a high-performance analytics ledger.",
        role: "Lead Architect",
        technology: ["React", "Node.js", "Tailwind CSS", "Redis", "PostgreSQL"],
        websiteUrl: "https://saas-billing.example.com",
        githubUrl: "https://github.com/alexrivera/payment-hub",
        figmaUrl: "https://figma.com/file/mock-saas-payment",
        youtubeDemo: "https://youtube.com/watch?v=mock-payment"
      },
      {
        id: "proj_2",
        title: "Decentralized Kanban System",
        thumbnail: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?auto=format&fit=crop&q=80&w=600",
        description: "A secure, serverless team sprint organizer powered by custom CRDT algorithms to support real-time state synchronization across offline browser sessions.",
        role: "Solo Creator",
        technology: ["TypeScript", "IndexedDB", "WebSockets", "Vite"],
        websiteUrl: "https://offline-kanban.example.com",
        githubUrl: "https://github.com/alexrivera/kanban-crdt"
      }
    ],
    resumeUrl: "/uploads/alex_rivera_resume.pdf",
    membershipPlan: "Free",
    aiAtsQuotaUsed: 0,
    aiAtsQuotaLimit: 2,
    enrolledTrainings: [
      {
        id: "enr_1",
        trainingId: "tr_1",
        trainingTitle: "Digital Talent Scholarship (DTS) - Full Stack Engineering",
        provider: "Kementerian Komunikasi dan Informatika (Kominfo)",
        format: "Online",
        type: "Government",
        price: 0,
        platformFee: 0,
        providerShare: 0,
        paymentStatus: "free",
        invoiceNumber: "INV-GOV-2026-0811",
        enrolledAt: "2026-08-10",
        status: "in_progress",
        progressPercentage: 75,
        completedModulesCount: 6,
        totalModulesCount: 8,
        schedule: "Setiap Selasa & Kamis, 19:30 - 21:30 WIB",
        startDate: "2026-08-15",
        onlineMeetingPlatform: "Google Meet",
        onlineMeetingUrl: "https://meet.google.com/dts-talenthub-2026",
        lmsUrl: "https://digitalent.kominfo.go.id/classroom",
        communityGroupUrl: "https://t.me/dts_fullstack_2026"
      },
      {
        id: "enr_2",
        trainingId: "tr_2",
        trainingTitle: "Fintech Growth & Performance Marketing Intensive",
        provider: "Indonesia Tech Academy (NGO)",
        format: "Offline",
        type: "NGO",
        price: 0,
        platformFee: 0,
        providerShare: 0,
        paymentStatus: "free",
        invoiceNumber: "INV-NGO-2026-0901",
        enrolledAt: "2026-08-28",
        status: "enrolled",
        progressPercentage: 20,
        completedModulesCount: 1,
        totalModulesCount: 5,
        schedule: "Setiap Sabtu, 09:00 - 16:00 WIB",
        startDate: "2026-09-06",
        qrTicketCode: "TICKET-OFFLINE-78942",
        venueName: "TalentHub Innovation Hub - Menara Cyber 2",
        venueRoom: "Auditorium Lantai 15, Lab 3",
        venueAddress: "Jl. H.R. Rasuna Said Blok X-5 No. 13, RT.7/RW.2, Kuningan Timur, Setiabudi, Jakarta Selatan 12950",
        venueCity: "Jakarta Selatan",
        venueGoogleMapsUrl: "https://maps.google.com/?q=Menara+Cyber+2+Jakarta",
        venueGuidelines: [
          "Bawa laptop pribadi & charger untuk sesi praktikum",
          "Tunjukkan QR Tiket Masuk di meja resepsionis lantai dasar",
          "Pakaian rapi & bersepatu (Smart Casual)"
        ]
      }
    ],
    scholarshipApplications: [
      {
        id: "sch_app_1",
        candidateId: "cand_1",
        candidateName: "Rizky Pratama",
        candidateEmail: "rizky.pratama@example.com",
        candidatePhone: "+62 812-8765-4321",
        candidateAvatar: DEFAULT_PROFILE_IMAGE,
        trainingId: "tr_1",
        trainingTitle: "Digital Talent Scholarship (DTS) - Full Stack Engineering",
        provider: "Kementerian Komunikasi dan Informatika (Kominfo)",
        format: "Online",
        motivationEssay: "Saya sangat berkomitmen memperdalam arsitektur TypeScript tingkat lanjut dan arsitektur database modern untuk membangun solusi teknologi inklusif di Indonesia. Beasiswa ini akan mempercepat kesiapan tim engineering kami dalam memenuhi standar industri global.",
        careerGoals: "Menjadi Principal Cloud & Full-Stack Architect yang memimpin modernisasi sistem digital publik dan membimbing generasi junior developer.",
        portfolioUrl: "https://github.com/rizkypratama",
        linkedinUrl: "https://linkedin.com/in/rizkypratama-dev",
        gpaOrAchievement: "IPK 3.89 / Cumlaude - Teknik Informatika",
        weeklyCommitmentHours: 15,
        submittedAt: "2026-08-28",
        status: "approved",
        adminFeedback: "Aplikasi beasiswa Anda telah disetujui oleh Panitia Seleksi DTS Kominfo. Kuota resmi dan kredensial ruang kelas telah diterbitkan ke dasbor Anda.",
        reviewedAt: "2026-08-30",
        reviewedBy: "Super Admin TalentHub"
      }
    ]
  },
  {
    id: "cand_2",
    fullName: "Annisa Larasati",
    email: "annisa.larasati@example.com",
    phone: "+62 813-1122-3344",
    headline: "Lead UI/UX & Product Designer | Design System Specialist",
    aboutMe: "Lead Product Designer dengan pengalaman 5+ tahun merancang sistem desain (Design System), riset pengalaman pengguna (UX Research), dan antarmuka aplikasi finansial serta perbankan digital. Alumnus FSRD ITB yang berfokus pada standardisasi WCAG AA dan interaksi mikro yang intuitif.",
    location: "Bandung, Jawa Barat",
    nationality: "Indonesian",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200&h=400",
    website: "https://annisa-design.id",
    github: "https://github.com/annisalarasati",
    linkedin: "https://linkedin.com/in/annisa-larasati",
    expectedSalary: "Rp 18.000.000 / bulan",
    availability: "Immediate",
    employmentType: ["Full-time", "Contract"],
    preferredLocation: "Bandung / Remote",
    openToWork: true,
    remote: true,
    hybrid: true,
    onsite: true,
    relocation: true,
    profileCompletion: 95,
    verified: true,
    atsScore: 92,
    skills: [
      { id: "sk_21", name: "Figma UI/UX", level: SkillLevel.Expert, yearsOfExperience: 5, category: SkillCategory.Design, endorsements: 31 },
      { id: "sk_22", name: "Design Systems", level: SkillLevel.Expert, yearsOfExperience: 4, category: SkillCategory.Design, endorsements: 25 },
      { id: "sk_23", name: "User Research", level: SkillLevel.Expert, yearsOfExperience: 4, category: SkillCategory.Design, endorsements: 19 },
      { id: "sk_24", name: "Prototyping", level: SkillLevel.Expert, yearsOfExperience: 5, category: SkillCategory.Design, endorsements: 22 },
    ],
    experience: [
      {
        id: "exp_21",
        company: "PT Solusi Finansial Indonesia",
        position: "Lead Product Designer",
        employmentType: "Full-time",
        startDate: "2023-01",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Memimpin standardisasi Design Token antar platform web dan mobile.",
          "Melakukan riset kegunaan dan validasi alur pembayaran QRIS serta reksa dana online."
        ],
        achievements: [
          "Meningkatkan tingkat konversi checkout sebesar 16% melalui perbaikan alur micro-interaction.",
          "Membangun dokumentasi komponen Figma yang diadopsi oleh 6 squad produk."
        ],
        technologiesUsed: ["Figma", "Design Tokens", "Maze", "UserTesting"]
      }
    ],
    education: [
      {
        id: "edu_21",
        school: "Institut Teknologi Bandung (ITB)",
        degree: "Sarjana Desain (S.Ds)",
        major: "Desain Komunikasi Visual",
        gpa: "3.88",
        graduationYear: 2021,
        activities: "Koordinator Pameran Desain ITB, Juara UX Hackathon Nasional"
      }
    ],
    certificates: [
      {
        id: "cert_21",
        name: "Google UX Design Professional Certificate",
        issuer: "Google Career Certificates",
        issueDate: "2022-03",
        expirationDate: "Never",
        credentialId: "G-UX-882910",
        verified: true
      }
    ],
    portfolio: [
      {
        id: "proj_21",
        title: "Fintech Mobile Banking Re-Architecture",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
        description: "Perombakan total antarmuka aplikasi mobile banking termasuk fitur QRIS transfer instan, pelacak pengeluaran otomatis, dan otentikasi biometrik.",
        role: "Lead Product Designer",
        technology: ["Figma", "Design Systems", "Prototyping"],
        figmaUrl: "https://figma.com/@annisalarasati"
      }
    ]
  },
  {
    id: "cand_3",
    fullName: "Dimas Arya Nugraha",
    email: "dimas.arya@example.com",
    phone: "+62 821-3344-5566",
    headline: "Cloud & DevOps Architect | AWS & Kubernetes Specialist",
    aboutMe: "Cloud DevOps Engineer dengan fokus pada infrastruktur cloud-native, orkestrasi Kubernetes, pipeline CI/CD otomatis, dan keamanan sistem perbankan. Terbiasa menangani high availability deployment di multi-region cloud.",
    location: "Yogyakarta, Indonesia",
    nationality: "Indonesian",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200&h=400",
    website: "https://dimasarya.tech",
    github: "https://github.com/dimasarya-cloud",
    linkedin: "https://linkedin.com/in/dimas-arya-cloud",
    expectedSalary: "Rp 22.000.000 / bulan",
    availability: "Immediate",
    employmentType: ["Full-time", "Contract"],
    preferredLocation: "Yogyakarta / Remote",
    openToWork: true,
    remote: true,
    hybrid: true,
    onsite: false,
    relocation: true,
    profileCompletion: 90,
    verified: true,
    atsScore: 91,
    skills: [
      { id: "sk_31", name: "AWS Cloud", level: SkillLevel.Expert, yearsOfExperience: 5, category: SkillCategory.Programming, endorsements: 24 },
      { id: "sk_32", name: "Kubernetes", level: SkillLevel.Expert, yearsOfExperience: 4, category: SkillCategory.Programming, endorsements: 20 },
      { id: "sk_33", name: "Terraform", level: SkillLevel.Expert, yearsOfExperience: 4, category: SkillCategory.Programming, endorsements: 18 },
      { id: "sk_34", name: "Docker & CI/CD", level: SkillLevel.Expert, yearsOfExperience: 5, category: SkillCategory.Programming, endorsements: 22 }
    ],
    experience: [
      {
        id: "exp_31",
        company: "PT Cloud Akselerasi Nusantara",
        position: "Lead DevOps Engineer",
        employmentType: "Full-time",
        startDate: "2023-03",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Mengelola cluster Kubernetes untuk microservices dengan SLA uptime 99.95%.",
          "Membangun automasi infrastruktur menggunakan Terraform dan Ansible."
        ],
        achievements: [
          "Memangkas waktu deployment dari 45 menit menjadi 8 menit menggunakan GitHub Actions.",
          "Mengurangi biaya operasional cloud bulanan sebesar 25% melalui optimasi autoscaling spot instances."
        ],
        technologiesUsed: ["AWS", "Kubernetes", "Terraform", "Prometheus", "Grafana"]
      }
    ],
    education: [
      {
        id: "edu_31",
        school: "Universitas Gadjah Mada (UGM)",
        degree: "Sarjana Teknik (S.T)",
        major: "Teknologi Informasi",
        gpa: "3.82",
        graduationYear: 2021,
        activities: "Ketua Komunitas Cloud Computing Mahasiswa UGM"
      }
    ],
    certificates: [
      {
        id: "cert_31",
        name: "AWS Certified DevOps Engineer – Professional",
        issuer: "Amazon Web Services",
        issueDate: "2023-06",
        expirationDate: "2026-06",
        credentialId: "AWS-DOP-773910",
        verified: true
      }
    ],
    portfolio: [
      {
        id: "proj_31",
        title: "Enterprise Multi-Region Kubernetes Mesh",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
        description: "Arsitektur cloud hybrid terdistribusi dengan pemulihan bencana otomatis (automated disaster recovery) dan pemantauan metrik waktu nyata.",
        role: "Lead Cloud Architect",
        technology: ["AWS", "Kubernetes", "Terraform", "Istio"],
        githubUrl: "https://github.com/dimasarya-cloud/k8s-mesh"
      }
    ]
  },
  {
    id: "cand_4",
    fullName: "Maya Putri Wulandari",
    email: "maya.putri@example.com",
    phone: "+62 856-7890-1234",
    headline: "Junior Frontend Developer | React & Tailwind CSS Specialist",
    aboutMe: "Frontend Developer lulusan Sistem Informasi Universitas Bina Nusantara dengan antusiasme tinggi pada React, Next.js, dan animasi antarmuka pengguna. Berpengalaman menyelesaikan program magang industri dan membangun aplikasi web interaktif responsif.",
    location: "Jakarta Barat, Indonesia",
    nationality: "Indonesian",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200&h=400",
    website: "https://mayaputri.me",
    github: "https://github.com/mayaputri-dev",
    linkedin: "https://linkedin.com/in/maya-putri-wulandari",
    expectedSalary: "Rp 9.500.000 / bulan",
    availability: "Immediate",
    employmentType: ["Full-time", "Internship"],
    preferredLocation: "Jakarta / Remote",
    openToWork: true,
    remote: true,
    hybrid: true,
    onsite: true,
    relocation: false,
    profileCompletion: 92,
    verified: true,
    atsScore: 89,
    skills: [
      { id: "sk_41", name: "React", level: SkillLevel.Intermediate, yearsOfExperience: 2, category: SkillCategory.Programming, endorsements: 14 },
      { id: "sk_42", name: "JavaScript / TypeScript", level: SkillLevel.Intermediate, yearsOfExperience: 2, category: SkillCategory.Programming, endorsements: 12 },
      { id: "sk_43", name: "Tailwind CSS", level: SkillLevel.Expert, yearsOfExperience: 2, category: SkillCategory.Programming, endorsements: 16 },
      { id: "sk_44", name: "Figma to Code", level: SkillLevel.Intermediate, yearsOfExperience: 2, category: SkillCategory.Design, endorsements: 10 }
    ],
    experience: [
      {
        id: "exp_41",
        company: "PT Bukalapak.com Tbk",
        position: "Frontend Engineering Intern",
        employmentType: "Internship",
        startDate: "2025-06",
        endDate: "2025-12",
        current: false,
        responsibilities: [
          "Membantu pengembangan modul katalog kampanye promosi dan halaman keranjang belanja.",
          "Menerapkan responsive design cross-browser dan menyelesaikan isu accessibility WCAG."
        ],
        achievements: [
          "Mempercepat waktu pemuatan halaman kampanye sebesar 18% dengan lazy loading aset gambar.",
          "Mengonversi lebih dari 20 mockup Figma ke komponen React modular."
        ],
        technologiesUsed: ["React", "JavaScript", "Tailwind CSS", "Git"]
      }
    ],
    education: [
      {
        id: "edu_41",
        school: "Universitas Bina Nusantara (Binus)",
        degree: "Sarjana Komputer (S.Kom)",
        major: "Sistem Informasi",
        gpa: "3.91",
        graduationYear: 2026,
        activities: "Juara 2 Hackathon Mobile App Nasional"
      }
    ],
    certificates: [
      {
        id: "cert_41",
        name: "Full-Stack Web Development Bootcamp",
        issuer: "Hacktiv8 Indonesia",
        issueDate: "2025-04",
        expirationDate: "Never",
        credentialId: "H8-FSD-34421",
        verified: true
      }
    ],
    portfolio: [
      {
        id: "proj_41",
        title: "CleanBento - Healthy Catering Delivery UI",
        thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
        description: "Aplikasi pemesanan katering sehat dengan filter kalori instan, kalkulasi nutrisi, dan simulasi checkout e-wallet.",
        role: "Frontend Engineer",
        technology: ["React", "Tailwind CSS", "Motion"],
        websiteUrl: "https://cleanbento.vercel.app",
        githubUrl: "https://github.com/mayaputri-dev/cleanbento"
      }
    ]
  },
  {
    id: "cand_5",
    fullName: "Fajar Hidayat",
    email: "fajar.hidayat@example.com",
    phone: "+62 813-9876-5432",
    headline: "Mobile Engineer | Flutter & Android Specialist",
    aboutMe: "Mobile Application Developer dengan 4+ tahun pengalaman dalam membangun aplikasi mobile lintas platform (Flutter) dan native Android (Kotlin). Fokus pada arsitektur BLoC, offline-first caching, dan integrasi payment gateway lokal.",
    location: "Surabaya, Jawa Timur",
    nationality: "Indonesian",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200&h=400",
    website: "https://fajarhidayat.dev",
    github: "https://github.com/fajarhidayat-dev",
    linkedin: "https://linkedin.com/in/fajar-hidayat-mobile",
    expectedSalary: "Rp 16.000.000 / bulan",
    availability: "Immediate",
    employmentType: ["Full-time", "Contract"],
    preferredLocation: "Surabaya / Remote",
    openToWork: true,
    remote: true,
    hybrid: true,
    onsite: true,
    relocation: true,
    profileCompletion: 94,
    verified: true,
    atsScore: 90,
    skills: [
      { id: "sk_51", name: "Flutter & Dart", level: SkillLevel.Expert, yearsOfExperience: 4, category: SkillCategory.Programming, endorsements: 22 },
      { id: "sk_52", name: "Android Kotlin", level: SkillLevel.Intermediate, yearsOfExperience: 3, category: SkillCategory.Programming, endorsements: 15 },
      { id: "sk_53", name: "BLoC State Management", level: SkillLevel.Expert, yearsOfExperience: 4, category: SkillCategory.Programming, endorsements: 18 },
      { id: "sk_54", name: "SQLite & Hive", level: SkillLevel.Expert, yearsOfExperience: 4, category: SkillCategory.Programming, endorsements: 16 }
    ],
    experience: [
      {
        id: "exp_51",
        company: "PT Bank Mandiri (Persero) Tbk - Digital Squad",
        position: "Senior Mobile Engineer",
        employmentType: "Full-time",
        startDate: "2023-05",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Mengembangkan modul loyalty point dan pembayaran tagihan pada aplikasi perbankan mobile.",
          "Menerapkan enkripsi AES-256 lokal dan proteksi screen capture untuk keamanan data nasabah."
        ],
        achievements: [
          "Mencapai crash-free session rate sebesar 99.8% pada rilis aplikasi berskala 2 juta pengguna aktif.",
          "Memangkas ukuran aplikasi (APK footprint) sebesar 30% dengan optimasi asset tree-shaking."
        ],
        technologiesUsed: ["Flutter", "Dart", "BLoC", "Kotlin", "REST API"]
      }
    ],
    education: [
      {
        id: "edu_51",
        school: "Telkom University",
        degree: "Sarjana Komputer (S.Kom)",
        major: "Teknik Informatika",
        gpa: "3.78",
        graduationYear: 2022,
        activities: "Juara 1 Lomba Aplikasi Mobile Jawa Timur"
      }
    ],
    certificates: [
      {
        id: "cert_51",
        name: "Google Associate Android Developer",
        issuer: "Google Developers",
        issueDate: "2022-11",
        expirationDate: "Never",
        credentialId: "G-AAD-55421",
        verified: true
      }
    ],
    portfolio: [
      {
        id: "proj_51",
        title: "KasirKu - Mobile POS & Offline Accounting",
        thumbnail: "https://images.unsplash.com/photo-1556742049-0a67e557224d?auto=format&fit=crop&q=80&w=600",
        description: "Aplikasi kasir digital untuk UMKM dengan fitur sinkronisasi cloud offline-first, pencetakan struk bluetooth, dan laporan laba rugi otomatis.",
        role: "Lead Mobile Architect",
        technology: ["Flutter", "Hive DB", "Bluetooth POS"],
        githubUrl: "https://github.com/fajarhidayat-dev/kasirku"
      }
    ]
  },
  {
    id: "cand_6",
    fullName: "Bunga Pratiwi",
    email: "bunga.pratiwi@example.com",
    phone: "+62 821-5566-7788",
    headline: "Product Marketing & Growth Lead | Fintech Specialist",
    aboutMe: "Growth & Product Marketing Lead dengan pengalaman 5+ tahun dalam mengelola strategi akuisisi pengguna, funnel optimasi, dan kemitraan strategis di ekosistem fintech dompet digital. Ahli dalam analitik CAC vs LTV dan retensi pengguna.",
    location: "Tangerang Selatan, Banten",
    nationality: "Indonesian",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200&h=400",
    website: "https://bungapratiwi.id",
    github: "",
    linkedin: "https://linkedin.com/in/bunga-pratiwi-growth",
    expectedSalary: "Rp 17.500.000 / bulan",
    availability: "Immediate",
    employmentType: ["Full-time", "Contract"],
    preferredLocation: "Jakarta / Remote",
    openToWork: true,
    remote: true,
    hybrid: true,
    onsite: true,
    relocation: true,
    profileCompletion: 92,
    verified: true,
    atsScore: 88,
    skills: [
      { id: "sk_61", name: "Growth Marketing", level: SkillLevel.Expert, yearsOfExperience: 5, category: SkillCategory.Marketing, endorsements: 28 },
      { id: "sk_62", name: "Google Analytics 4 & Mixpanel", level: SkillLevel.Expert, yearsOfExperience: 4, category: SkillCategory.Marketing, endorsements: 22 },
      { id: "sk_63", name: "User Retention & Cohort", level: SkillLevel.Expert, yearsOfExperience: 4, category: SkillCategory.Marketing, endorsements: 19 },
      { id: "sk_64", name: "SQL for Analytics", level: SkillLevel.Intermediate, yearsOfExperience: 3, category: SkillCategory.Finance, endorsements: 14 }
    ],
    experience: [
      {
        id: "exp_61",
        company: "PT Espay Debit Indonesia Koe (DANA Indonesia)",
        position: "Senior Growth Marketing Strategist",
        employmentType: "Full-time",
        startDate: "2023-02",
        endDate: "Present",
        current: true,
        responsibilities: [
          "Merancang strategi kampanye promosi digital dan kemitraan merchant ritel nasional.",
          "Menganalisis cohort retensi pengguna bulanan dan mengoptimasi funnel aktivasi akun."
        ],
        achievements: [
          "Menurunkan Cost Per Acquisition (CPA) sebesar 17% dengan pengalihan strategi kanal ke targeted SEO dan referral.",
          "Mendongkrak Monthly Active Users (MAU) sebesar 24% pada kampanye festival belanja akhir tahun."
        ],
        technologiesUsed: ["Mixpanel", "Google Analytics 4", "Tableau", "SQL"]
      }
    ],
    education: [
      {
        id: "edu_61",
        school: "Universitas Padjadjaran (Unpad)",
        degree: "Sarjana Manajemen (S.M)",
        major: "Manajemen Pemasaran",
        gpa: "3.84",
        graduationYear: 2021,
        activities: "Ketua Himpunan Mahasiswa Manajemen Unpad"
      }
    ],
    certificates: [
      {
        id: "cert_61",
        name: "Google Professional Data Analyst",
        issuer: "Google Career Certificates",
        issueDate: "2022-09",
        expirationDate: "Never",
        credentialId: "G-DA-9938192",
        verified: true
      }
    ],
    portfolio: [
      {
        id: "proj_61",
        title: "National Merchant Onboarding Campaign",
        thumbnail: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=600",
        description: "Studi kasus strategi digital peluncuran program kemitraan QRIS UMKM yang berhasil mengakuisisi 45.000 merchant aktif dalam waktu 60 hari.",
        role: "Growth Campaign Lead",
        technology: ["Growth Hacking", "Mixpanel", "Marketing Strategy"]
      }
    ]
  }
];

export const MOCK_RECRUITERS: Recruiter[] = [
  {
    id: "rec_1",
    fullName: "Siti Nurhaliza",
    email: "siti.nurhaliza@digitalnusantara.id",
    hrJobTitle: "Head of Talent Acquisition",
    phone: "+62 811-2345-6789",
    companyName: "PT Digital Solusi Nusantara",
    companyLogo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=100&h=100",
    companyWebsite: "https://digitalnusantara.id",
    companySize: "201-1000 Karyawan",
    companyRegistrationNumber: "098234710129",
    industry: "Enterprise Software & Cloud Platforms",
    location: "Jakarta Selatan, Indonesia",
    subscriptionTier: "Premium",
    savedCandidateIds: ["cand_1", "cand_2"],
    hrVerified: true,
    hrVerificationStatus: "verified",
    authorizedDeclarationAccepted: true
  },
  {
    id: "rec_2",
    fullName: "Budi Santoso",
    email: "budi.santoso@fintechasia.id",
    hrJobTitle: "Lead Tech Talent Recruiter",
    phone: "+62 812-9876-5432",
    companyName: "PT Finansial Inovasi Asia",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
    companyWebsite: "https://fintechasia.id",
    companySize: "51-200 Karyawan",
    companyRegistrationNumber: "123847592019",
    industry: "Financial Technology & E-Payments",
    location: "Jakarta Pusat, Indonesia",
    subscriptionTier: "Enterprise",
    savedCandidateIds: ["cand_2", "cand_3"],
    hrVerified: true,
    hrVerificationStatus: "verified",
    authorizedDeclarationAccepted: true
  },
  {
    id: "rec_3",
    fullName: "Dewi Anggraini",
    email: "dewi.anggraini@logistikglobal.id",
    hrJobTitle: "Senior Talent Acquisition Partner",
    phone: "+62 813-8899-7766",
    companyName: "PT Solusi Logistik Global",
    companyLogo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=100&h=100",
    companyWebsite: "https://logistikglobal.id",
    companySize: "501-1000 Karyawan",
    companyRegistrationNumber: "987654321098",
    industry: "Supply Chain & Smart Logistics",
    location: "Tangerang, Banten",
    subscriptionTier: "Premium",
    savedCandidateIds: ["cand_1", "cand_5"],
    hrVerified: true,
    hrVerificationStatus: "verified",
    authorizedDeclarationAccepted: true
  }
];

export const MOCK_INVITATIONS: Invitation[] = [
  {
    id: "inv_1",
    recruiterId: "rec_1",
    recruiterName: "Siti Nurhaliza",
    companyName: "PT Digital Solusi Nusantara",
    companyLogo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=100&h=100",
    candidateId: "cand_1",
    position: "Senior Full-Stack Architect",
    message: "Halo Rizky, kami sangat terkesan dengan portofolio React 19 dan arsitektur backend Node.js Anda. Kami sedang membangun platform cloud enterprise dan ingin mengundang Anda untuk sesi perkenalan wawancara teknis.",
    salaryOffer: "Rp 26.000.000 - Rp 32.000.000 / bulan",
    interviewLink: "https://meet.google.com/abc-defg-hij",
    scheduledDate: "2026-10-28T10:00",
    status: "scheduled",
    createdAt: "2026-10-20T14:30"
  },
  {
    id: "inv_2",
    recruiterId: "rec_2",
    recruiterName: "Budi Santoso",
    companyName: "PT Finansial Inovasi Asia",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
    candidateId: "cand_2",
    position: "Lead UI/UX Product Designer",
    message: "Halo Annisa, sistem desain perbankan dan studi kasus CleanBento karya Anda sangat memukau! Kami sedang mencari Lead Designer untuk produk pembayaran digital kami. Mari berdiskusi via Google Meet.",
    salaryOffer: "Rp 18.000.000 - Rp 22.000.000 / bulan",
    interviewLink: "https://meet.google.com/xyz-uvw-rst",
    scheduledDate: "2026-10-29T14:00",
    status: "scheduled",
    createdAt: "2026-10-22T09:15"
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: "msg_1",
    invitationId: "inv_1",
    senderRole: "recruiter",
    content: "Halo Rizky! Terima kasih atas respon cepatnya. Saya sudah mengirimkan tautan Google Meet untuk jadwal wawancara teknis hari Senin. Apakah jadwal tersebut sudah pas?",
    timestamp: "2026-10-21T15:00:00"
  },
  {
    id: "msg_2",
    invitationId: "inv_1",
    senderRole: "candidate",
    content: "Halo Bu Siti! Ya, hari Senin pukul 10:00 WIB sangat cocok. Saya telah meninjau stack teknologi PT Digital Solusi Nusantara dan sangat antusias. Sampai jumpa Senin!",
    timestamp: "2026-10-21T16:20:00"
  }
];

export const MOCK_TRAININGS: TrainingProgram[] = [
  {
    id: "tr_1",
    title: "Digital Talent Scholarship (DTS) - Full Stack Engineering",
    provider: "Kementerian Komunikasi dan Informatika (Kominfo)",
    providerLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=120",
    type: "Government",
    price: 0,
    priceFormatted: "Gratis (Didanai Penuh APBN)",
    platformFeeRate: 0,
    format: "Online",
    category: "Coding",
    duration: "12 Minggu (Part-time)",
    schedule: "Setiap Selasa & Kamis, 19:30 - 21:30 WIB",
    startDate: "2026-09-15",
    endDate: "2026-12-10",
    certification: true,
    certificateIssuer: "Badan Litbang SDM Kominfo & BNSP",
    description: "Kurikulum resmi berstandar industri dengan pendanaan penuh pemerintah yang mencakup TypeScript modern, PostgreSQL database, microservices Express, dan React 19.",
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=600",
    link: "https://digitalent.kominfo.go.id",
    spotsLeft: 42,
    totalSpots: 150,
    onlineMeetingPlatform: "Google Meet",
    onlineMeetingUrl: "https://meet.google.com/dts-talenthub-2026",
    lmsUrl: "https://digitalent.kominfo.go.id/classroom",
    communityGroupUrl: "https://t.me/dts_fullstack_2026",
    instructorName: "Ir. Hendra Kusuma, M.Kom",
    instructorTitle: "Lead Cloud Architect & Kominfo Senior Assessor",
    instructorAvatar: DEFAULT_PROFILE_IMAGE,
    requirements: [
      "WNI usia 18-35 tahun",
      "Memiliki dasar pemrograman web (HTML, CSS, JS)",
      "Berkomitmen menghadiri minimal 85% sesi interaktif online"
    ],
    syllabus: [
      { id: "mod_1", moduleNumber: 1, title: "Modern TypeScript & Advanced JavaScript Primitives", duration: "2 Minggu", topics: ["Generics", "Type Narrowing", "Async Control Flow"] },
      { id: "mod_2", moduleNumber: 2, title: "Scalable Backend with Express & PostgreSQL", duration: "3 Minggu", topics: ["RESTful Standards", "Drizzle ORM", "Connection Pooling"] },
      { id: "mod_3", moduleNumber: 3, title: "React 19 & Component Lifecycle Optimization", duration: "4 Minggu", topics: ["Server Components", "State Persistence", "Tailwind UI"] },
      { id: "mod_4", moduleNumber: 4, title: "Capstone Project & BNSP Certification Exam", duration: "3 Minggu", topics: ["CI/CD Pipeline", "Production Deployment", "Final Presentation"] }
    ]
  },
  {
    id: "tr_2",
    title: "Fintech Growth & Performance Marketing Intensive",
    provider: "Indonesia Tech Academy (NGO)",
    providerLogo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=120",
    type: "NGO",
    price: 0,
    priceFormatted: "Gratis (Beasiswa Penuh NGO)",
    platformFeeRate: 0,
    format: "Offline",
    category: "Marketing",
    duration: "6 Minggu (Tatap Muka)",
    schedule: "Setiap Sabtu & Minggu, 09:00 - 16:00 WIB",
    startDate: "2026-09-20",
    endDate: "2026-10-31",
    certification: true,
    certificateIssuer: "Indonesia Tech Academy Certified Growth Marketer",
    description: "Bootcamp beasiswa offline intensif yang berfokus pada analitik akuisisi nasabah digital, Google Ads, perutean SEO performa tinggi, dan strategi anggaran digital di ruang kelas modern.",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600",
    link: "https://techacademy-ngo.org",
    spotsLeft: 8,
    totalSpots: 30,
    venueName: "TalentHub Innovation Hub - Menara Cyber 2",
    venueRoom: "Auditorium Lantai 15, Lab 3",
    venueAddress: "Jl. H.R. Rasuna Said Blok X-5 No. 13, RT.7/RW.2, Kuningan Timur, Setiabudi, Jakarta Selatan 12950",
    venueCity: "Jakarta Selatan",
    venueGoogleMapsUrl: "https://maps.google.com/?q=Menara+Cyber+2+Jakarta",
    venueGuidelines: [
      "Bawa laptop pribadi & charger untuk sesi lab praktikum",
      "Tunjukkan QR Tiket Masuk di meja resepsionis lantai dasar",
      "Pakaian rapi & bersepatu (Smart Casual)",
      "Disediakan coffee break & makan siang di venue"
    ],
    instructorName: "Dian Pratama, MBA",
    instructorTitle: "VP of Growth Marketing at FinTech Global",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    requirements: [
      "Lulusan D3/S1 atau fresh graduate bidang Bisnis/Komunikasi/Teknik",
      "Membawa laptop pribadi dengan browser Chrome terkini",
      "Dapat hadir secara fisik di Menara Cyber 2 Kuningan Jakarta"
    ],
    syllabus: [
      { id: "mod_21", moduleNumber: 1, title: "Fintech Customer Acquisition Funnel Strategy", duration: "1 Minggu", topics: ["CAC vs LTV", "Cohort Analytics", "Attribution Models"] },
      { id: "mod_22", moduleNumber: 2, title: "Google Performance Max & Meta Conversion API", duration: "2 Minggu", topics: ["Bidding Strategies", "Retargeting", "Creative Matrix"] },
      { id: "mod_23", moduleNumber: 3, title: "SEO Infrastructure & Organic Search Domination", duration: "2 Minggu", topics: ["Technical SEO", "Semantic Indexing", "Backlink Equity"] },
      { id: "mod_24", moduleNumber: 4, title: "Live War Room & Real Ad Spend Simulation", duration: "1 Minggu", topics: ["Budget Allocation", "A/B Testing", "Executive Pitch"] }
    ]
  },
  {
    id: "tr_3",
    title: "React & Next.js Advanced Architecture",
    provider: "Komunitas Pengembang Web Indonesia",
    providerLogo: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=120",
    type: "Free",
    price: 0,
    priceFormatted: "Gratis (Akses Terbuka)",
    platformFeeRate: 0,
    format: "Online",
    category: "Coding",
    duration: "Mandiri (Self-paced)",
    schedule: "Akses Fleksibel 24/7",
    startDate: "Kapan saja",
    certification: false,
    description: "Pembelajaran mandiri mendalam mengenai React Server Components, optimasi performa rendering web vitals, state management terdistribusi, dan deployment cloud.",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600",
    link: "https://nextjs.org/learn",
    onlineMeetingPlatform: "LMS Classroom",
    onlineMeetingUrl: "https://community.talenthub.id/learn-react",
    lmsUrl: "https://community.talenthub.id/courses/nextjs-architecture",
    instructorName: "Komunitas Open Source Indonesia",
    instructorTitle: "Senior Core Contributors",
    requirements: [
      "Koneksi internet stabil",
      "Pengetahuan dasar JavaScript ES6+"
    ],
    syllabus: [
      { id: "mod_31", moduleNumber: 1, title: "Server-side Rendering vs Client Hydration", duration: "2 Jam", topics: ["Streaming SSR", "Suspense Boundaries"] },
      { id: "mod_32", moduleNumber: 2, title: "Server Actions & Caching Strategies", duration: "3 Jam", topics: ["Revalidation", "Optimistic Updates"] },
      { id: "mod_33", moduleNumber: 3, title: "Edge Middleware & Authentication Guard", duration: "2 Jam", topics: ["JWT Edge Auth", "Geolocation Routing"] }
    ]
  },
  {
    id: "tr_4",
    title: "Professional UI/UX & Design System Masterclass",
    provider: "Design League Jakarta",
    providerLogo: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&q=80&w=120",
    type: "Paid",
    price: 450000,
    priceFormatted: "Rp 450.000",
    platformFeeRate: 0.10,
    format: "Online",
    category: "Design",
    duration: "4 Sesi Live (Akhir Pekan)",
    schedule: "Setiap Sabtu, 10:00 - 13:00 WIB (4 Minggu)",
    startDate: "2026-09-19",
    endDate: "2026-10-10",
    certification: true,
    certificateIssuer: "Design League Certified Design System Specialist",
    description: "Masterclass intensif online via Zoom Live bersama Head of Design. Kuasai pembuatan wireframing modern, prototipe Figma berdefinisi tinggi, standar aksesibilitas WCAG AA, dan token desain.",
    imageUrl: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&q=80&w=600",
    link: "https://designleague.id",
    spotsLeft: 12,
    totalSpots: 50,
    onlineMeetingPlatform: "Zoom",
    onlineMeetingUrl: "https://zoom.us/j/9128374652",
    lmsUrl: "https://classroom.designleague.id",
    communityGroupUrl: "https://discord.gg/designleague-masterclass",
    instructorName: "Maya Natasha, S.Ds",
    instructorTitle: "Head of Product Design at Unicorn Tech",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    requirements: [
      "Memiliki akun Figma (bisa akun Free/Student)",
      "Laptop atau PC dengan layar resolusi minimal Full HD",
      "Kemampuan dasar riset pengguna atau desain visual"
    ],
    syllabus: [
      { id: "mod_41", moduleNumber: 1, title: "Foundations: Design Tokens, Grid & Typography Math", duration: "Sesi 1", topics: ["Variable Tokens", "8pt Grid System", "WCAG 2.1 Contrast"] },
      { id: "mod_42", moduleNumber: 2, title: "Component Architecture & Auto Layout Mastery", duration: "Sesi 2", topics: ["Component Properties", "Nested Slots", "Interactive States"] },
      { id: "mod_43", moduleNumber: 3, title: "Multi-Brand Design Systems & Handoff Workflow", duration: "Sesi 3", topics: ["Code Sync", "Figma to Tailwind Token Plugin", "Documentation Hub"] },
      { id: "mod_44", moduleNumber: 4, title: "Design System Portfolio Defense & 1-on-1 Feedback", duration: "Sesi 4", topics: ["Portfolio Review", "Live Critiques", "Certificate Issuance"] }
    ]
  },
  {
    id: "tr_5",
    title: "Executive Offline Product Management Masterclass",
    provider: "Product Guild Indonesia",
    providerLogo: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=120",
    type: "Paid",
    price: 1200000,
    priceFormatted: "Rp 1.200.000",
    platformFeeRate: 0.10,
    format: "Offline",
    category: "Product",
    duration: "4 Minggu (Tatap Muka Intensif)",
    schedule: "Setiap Sabtu, 09:00 - 17:00 WIB",
    startDate: "2026-09-26",
    endDate: "2026-10-17",
    certification: true,
    certificateIssuer: "Product Guild Executive Certified Product Manager (ECPM)",
    description: "Pelatihan tatap muka eksklusif di Sudirman Central Business District untuk calon Product Manager & Lead. Mencakup PRD berstandar global, metrik produk, roadmap eksekutif, dan simulasi pitching investor.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600",
    link: "https://productguild.id",
    spotsLeft: 5,
    totalSpots: 25,
    venueName: "Menara Mandiri Tower 1, Lt. 12 (SCBD)",
    venueRoom: "Executive Boardroom & Training Suite A",
    venueAddress: "Jl. Jend. Sudirman Kav. 54-55, Senayan, Kebayoran Baru, Jakarta Selatan 12190",
    venueCity: "Jakarta Selatan",
    venueGoogleMapsUrl: "https://maps.google.com/?q=Menara+Mandiri+Sudirman+Jakarta",
    venueGuidelines: [
      "Wajib menunjukkan QR E-Ticket & KTP asli di lobi utama",
      "Pakaian Formal / Business Smart",
      "Disediakan Coffee Break, Executive Lunch, & Networking Dinner di sesi penutupan"
    ],
    instructorName: "Raditya Wicaksono",
    instructorTitle: "Chief Product Officer (CPO) & Former Gojek VP",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    requirements: [
      "Pengalaman kerja minimal 1-2 tahun di bidang teknologi / bisnis / desain / rekayasa",
      "Membawa laptop untuk live workshop penyusunan PRD & Financial Model",
      "Komitmen kehadiran tatap muka di SCBD Jakarta"
    ],
    syllabus: [
      { id: "mod_51", moduleNumber: 1, title: "Strategic Product Discovery & Market Opportunity Sizing", duration: "Sesi 1", topics: ["TAM SAM SOM", "Customer Interviews", "Opportunity Solution Tree"] },
      { id: "mod_52", moduleNumber: 2, title: "Executive PRDs, User Story Mapping & Tech Feasibility", duration: "Sesi 2", topics: ["Technical PRD Standard", "API First Architecture", "Sprint Estimation"] },
      { id: "mod_53", moduleNumber: 3, title: "Product Analytics, Unit Economics & North Star Metric", duration: "Sesi 3", topics: ["Mixpanel / Amplitude", "Cohorts & Churn Prevention", "Pricing Psychology"] },
      { id: "mod_54", moduleNumber: 4, title: "C-Level Roadmap Defense & Capstone Product Pitch", duration: "Sesi 4", topics: ["Executive Stakeholder Buy-in", "Live Board Defense", "Networking Dinner"] }
    ]
  },
  {
    id: "tr_6",
    title: "AI Analytics & Data Engineering Hybrid Sprint",
    provider: "Data Science Indonesia & Cloud Partner",
    providerLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=120",
    type: "Paid",
    price: 750000,
    priceFormatted: "Rp 750.000",
    platformFeeRate: 0.10,
    format: "Hybrid",
    category: "Data",
    duration: "5 Minggu (Hybrid Online + Onsite Hackathon)",
    schedule: "Online: Rabu 19:30 WIB • Offline Hackathon: Sabtu Minggu ke-5 di Kuningan",
    startDate: "2026-10-01",
    endDate: "2026-11-05",
    certification: true,
    certificateIssuer: "Data Science Indonesia Certified Data Engineer",
    description: "Program hybrid unik yang memadukan kuliah online interaktif mengenai pipeline data cloud dan pipeline AI dengan hackathon onsite tatap muka 1 hari di Jakarta.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
    link: "https://datascience.or.id",
    spotsLeft: 15,
    totalSpots: 40,
    venueName: "CoHive 101 Mega Kuningan",
    venueRoom: "Event Space Ground Floor",
    venueAddress: "Jl. Mega Kuningan Barat Blok E.4.7 No. 1, Setiabudi, Jakarta Selatan 12950",
    venueCity: "Jakarta Selatan",
    venueGoogleMapsUrl: "https://maps.google.com/?q=CoHive+101+Mega+Kuningan",
    venueGuidelines: [
      "Sesi online dapat diikuti dari mana saja via Zoom",
      "Sesi hackathon offline hari Sabtu memerlukan kehadiran di CoHive Mega Kuningan",
      "Peserta mendapatkan cloud compute voucher senilai Rp 500.000"
    ],
    onlineMeetingPlatform: "Zoom",
    onlineMeetingUrl: "https://zoom.us/j/9384756201",
    lmsUrl: "https://lms.datascience.or.id",
    instructorName: "Dr. Budi Santoso, Ph.D",
    instructorTitle: "Principal Data Architect & AI Researcher",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    requirements: [
      "Dasar SQL dan Python data manipulation (pandas)",
      "Laptop dengan RAM minimal 8GB"
    ],
    syllabus: [
      { id: "mod_61", moduleNumber: 1, title: "Modern Data Lakehouse & SQL Pipelines", duration: "1 Minggu", topics: ["DuckDB", "dbt Cloud", "Data Warehousing"] },
      { id: "mod_62", moduleNumber: 2, title: "Streaming Data & Real-time ETL Architecture", duration: "1 Minggu", topics: ["Apache Kafka", "Event Streams", "Change Data Capture"] },
      { id: "mod_63", moduleNumber: 3, title: "Vector Embeddings & Gemini API Pipelines", duration: "2 Minggu", topics: ["Semantic Search", "pgvector", "RAG Systems"] },
      { id: "mod_64", moduleNumber: 4, title: "Onsite 12-Hour Data & AI Hackathon", duration: "1 Hari Onsite", topics: ["Live Data Ingestion", "Model Pipeline", "Jury Presentation"] }
    ]
  }
];

export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "sch_1",
    title: "Beasiswa Talenta Digital Indonesia 2026",
    provider: "Yayasan Inovasi Digital & Google",
    amount: "Rp 50.000.000 Biaya Kuliah + Rp 3.500.000 Uang Saku / bulan",
    deadline: "2026-09-15",
    category: "Computer Science & Data Science",
    description: "Beasiswa penuh untuk mahasiswa sarjana di Indonesia yang menempuh pendidikan di bidang ilmu komputer dan teknologi informasi, dilengkapi pendampingan karier intensif.",
    requirements: ["Mahasiswa aktif di Perguruan Tinggi Indonesia", "IPK minimal 3.30", "Mengunggah portofolio proyek digital atau inovasi"],
    link: "https://beasiswadigital.id",
    quota: 50,
    applicantCount: 1000,
    selectionStage: "Kurasi Berkas & Tes Kompetensi"
  },
  {
    id: "sch_2",
    title: "Dana Hibah Inovasi Startup LPDP & Telkom",
    provider: "Telkom Indonesia & LPDP",
    amount: "Rp 150.000.000 Dana Hibah Pengembangan",
    deadline: "2026-10-01",
    category: "Tech Entrepreneurship",
    description: "Dana hibah peluncuran produk digital untuk tim perintis, mencakup fasilitas server cloud, infrastruktur API, dan bimbingan mentor teknis senior.",
    requirements: ["Warga Negara Indonesia (WNI)", "Mahasiswa tingkat akhir atau fresh graduate", "Mengajukan proposal teknis & prototype MVP"],
    link: "https://lpdp.kemenkeu.go.id",
    quota: 25,
    applicantCount: 750,
    selectionStage: "Penilaian Proposal & Pitching"
  }
];

export const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: "int_1",
    title: "UI/UX Designer Intern (Remote / Hybrid)",
    company: "Tokopedia Design Ops",
    location: "Jakarta / Remote",
    type: "Remote",
    duration: "6 Bulan",
    stipend: "Rp 5.500.000 / bulan",
    description: "Bekerja sama dengan tim design ops untuk menyusun komponen antarmuka modern, panduan design system, dan menjalankan sesi pengujian kegunaan dengan pengguna nyata.",
    requirements: ["Menguasai Figma", "Pemahaman dasar HTML/CSS", "Portofolio desain dengan minimal 2 studi kasus"],
    link: "https://careers.tokopedia.com"
  },
  {
    id: "int_2",
    title: "AI Engineering & Full Stack Intern",
    company: "Nusantara Intelligent Systems",
    location: "Jakarta & Bandung",
    type: "Hybrid",
    duration: "3 Bulan",
    stipend: "Rp 6.500.000 / bulan",
    description: "Integrasikan API model bahasa besar (Gemini API) ke dalam alur kerja produktivitas perusahaan, tulis skrip validasi otomatis, dan bangun antarmuka interaktif.",
    requirements: ["Pemrograman TypeScript / Python tingkat menengah", "Memahami konsep REST API & basis data", "Mahasiswa tahun ke-3 atau 4"],
    link: "https://nusantara-ai.id"
  }
];

export const MOCK_ARTICLES: CareerArticle[] = [
  {
    id: "art_1",
    title: "Hentikan Melamar Membabi-buta: Kuasai Paradigma 'Perekrutan Terbalik'",
    category: "Tips",
    author: "Elena Rostova (TechCorp)",
    date: "2026-08-01",
    readTime: "5 menit baca",
    excerpt: "Mengirim ratusan CV ke portal lowongan kerja konvensional semakin tidak efektif. Perekrut modern kini mencari kandidat terverifikasi langsung di basis data talenta. Begini cara membuat portofolio Anda mudah ditemukan.",
    content: "Lanskap perekrutan sedang mengalami revolusi besar. Selama bertahun-tahun, pencari kerja mengirim CV ke dalam sistem ATS otomatis tanpa kejelasan. Kini, perusahaan terdepan menggunakan basis data terstruktur untuk menemukan kandidat secara proaktif. Dengan membangun profil digital yang lengkap dengan keahlian terverifikasi, skor ATS tinggi, dan status ketersediaan yang jelas, manajer perekrutan akan langsung mendatangi Anda dengan tawaran gaji transparan dalam mata uang Rupiah.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
    likes: 142
  },
  {
    id: "art_2",
    title: "Panduan Menyiapkan Video Perkenalan 1 Menit yang Menarik Minat Perekrut",
    category: "Interview",
    author: "Budi Santoso (GoVentures)",
    date: "2026-08-10",
    readTime: "4 menit baca",
    excerpt: "Video pengenalan diri bukan sekadar membaca ulang CV Anda. Pelajari cara merangkum keahlian utama, pencapaian teknis terbesar, dan masalah yang mampu Anda selesaikan dalam waktu kurang dari 60 detik.",
    content: "Perekrut rata-rata menghabiskan waktu sangat singkat untuk membaca PDF resume. Namun, video perkenalan singkat berdurasi 1 menit di profil Anda ditonton hingga 75% dari waktu peninjauan. Jangan habiskan waktu untuk menyebutkan riwayat sekolah secara kaku. Gunakan 15 detik pertama untuk memperkenalkan diri, 30 detik untuk menceritakan tantangan teknis nyata yang berhasil Anda selesaikan, dan 15 detik terakhir untuk menjelaskan tumpukan teknologi yang ingin Anda kembangkan.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=400",
    likes: 98
  }
];

export const MOCK_JOB_OPENINGS: JobOpening[] = [
  {
    id: "job_1",
    recruiterId: "rec_1",
    recruiterName: "Elena Rostova",
    companyName: "TechCorp Global",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
    companyWebsite: "https://techcorp-global.com",
    title: "Senior Full Stack React & Node.js Engineer",
    department: "Core Platform Squad",
    location: "Jakarta / Remote",
    workplaceType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryMin: 28000000,
    salaryMax: 38000000,
    salaryFormatted: "Rp 28.000.000 - Rp 38.000.000 / bln",
    description: "Kami mencari Senior Full Stack Engineer berpengalaman untuk memimpin evolusi arsitektur web platform SaaS global kami. Anda akan merancang sistem berkinerja tinggi, mengoptimalkan Web Vitals, dan bekerja bersama squad insinyur berbakat.",
    responsibilities: [
      "Mengembangkan komponen frontend modular menggunakan Next.js, React, dan TypeScript berdefinisi tinggi.",
      "Membangun REST API dan microservices berbasis Node.js yang mampu menangani jutaan permintaan bulanan.",
      "Mengoptimalkan Core Web Vitals (LCP, FID/INP, CLS) serta waktu rendering client-side.",
      "Melakukan review kode dan membimbing insinyur tingkat menengah/junior."
    ],
    requirements: [
      "Pengalaman 4+ tahun dalam pengembangan web modern dengan React dan Node.js.",
      "Keahlian mendalam dalam TypeScript, state management, dan CSS Tailwind.",
      "Pemahaman kuat tentang basis data PostgreSQL, Redis caching, dan container Docker.",
      "Portofolio atau rekam jejak proyek terverifikasi."
    ],
    skills: ["React", "TypeScript", "Node.js", "Next.js", "PostgreSQL", "Docker", "Tailwind CSS"],
    benefits: [
      "Asuransi Kesehatan Kelas 1 (Keluarga & Diri Sendiri)",
      "Kebijakan Kerja 100% Remote / WFH Fleksibel",
      "Tunjangan Perangkat & Workspace Rp 15.000.000",
      "Anggaran Belajar & Konferensi Tahunan Rp 10.000.000",
      "Bonus Kinerja Tahunan & Saham Karyawan (ESOP)"
    ],
    status: "active",
    applicantCount: 4,
    postedAt: "2026-08-18",
    deadline: "2026-09-30"
  },
  {
    id: "job_2",
    recruiterId: "rec_2",
    recruiterName: "Budi Santoso",
    companyName: "GoVentures Tech",
    companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=100&h=100",
    companyWebsite: "https://goventures.tech",
    title: "Lead Cloud Solutions & Backend Architect",
    department: "Infrastructure & Platform Engineering",
    location: "Jakarta, Indonesia",
    workplaceType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Lead",
    salaryMin: 35000000,
    salaryMax: 48000000,
    salaryFormatted: "Rp 35.000.000 - Rp 48.000.000 / bln",
    description: "GoVentures Tech mengundang Cloud Architect visioner untuk memimpin modernisasi infrastruktur transaksi mikro multi-cloud kami dengan keandalan 99.99% uptime.",
    responsibilities: [
      "Merancang topologi cloud Google Cloud Platform (GCP) dan Kubernetes terdistribusi.",
      "Mengintegrasikan pipeline CI/CD otomatis, zero-downtime deployment, dan monitoring Datadog/Prometheus.",
      "Mengoptimalkan efisiensi biaya server cloud dan latensi transaksi database."
    ],
    requirements: [
      "Pengalaman 5+ tahun sebagai Backend / Cloud Architect.",
      "Sertifikasi Google Cloud Professional Architect atau AWS Certified Solutions Architect adalah nilai tambah besar.",
      "Menguasai Kubernetes, Terraform, Go / Node.js, dan distributed caching."
    ],
    skills: ["Google Cloud", "Kubernetes", "Docker", "Node.js", "System Design", "Terraform", "PostgreSQL"],
    benefits: [
      "Gaji Sangat Kompetitif + Bonus Kuartalan",
      "Model Kerja Hybrid (2 Hari Kantor SCBD, 3 Hari Remote)",
      "Asuransi Swasta Internasional Lengkap Rawat Inap & Gigi",
      "Gym & Wellness Allowance"
    ],
    status: "active",
    applicantCount: 3,
    postedAt: "2026-08-20",
    deadline: "2026-09-25"
  },
  {
    id: "job_3",
    recruiterId: "rec_3",
    recruiterName: "Maya Putri",
    companyName: "Tokopedia Design Ops",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100&h=100",
    companyWebsite: "https://tokopedia.com",
    title: "Senior UI/UX Product Designer (Design Systems)",
    department: "Customer Experience Design",
    location: "Jakarta / Hybrid",
    workplaceType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryMin: 22000000,
    salaryMax: 30000000,
    salaryFormatted: "Rp 22.000.000 - Rp 30.000.000 / bln",
    description: "Bergabunglah dengan tim Design Ops Tokopedia untuk mematangkan design system terpadu kami yang melayani puluhan juta pengguna aktif setiap harinya.",
    responsibilities: [
      "Menyusun dan memelihara library token Figma, autolayout components, dan standar aksesibilitas WCAG AA.",
      "Berkolaborasi dengan tim Frontend Engineer untuk sinkronisasi token Figma ke kode React / Tailwind.",
      "Menjalankan sesi user testing kualitatif dan kuantitatif pada alur checkout."
    ],
    requirements: [
      "Portofolio desain UI/UX dengan minimal 3 studi kasus produk digital nyata.",
      "Keahlian tingkat lanjut di Figma (Variables, AutoLayout, Interactive Components).",
      "Pemahaman dasar HTML, CSS, dan keterbatasan teknis frontend."
    ],
    skills: ["Figma to Code", "UI/UX Design", "Design Systems", "Prototyping", "User Research", "Tailwind CSS"],
    benefits: [
      "Paket Asuransi Jiwa & Kesehatan Komprehensif",
      "Tunjangan Transportasi & Parkir",
      "Akses Langganan Kursus & Software Desain Premium"
    ],
    status: "active",
    applicantCount: 4,
    postedAt: "2026-08-15",
    deadline: "2026-09-15"
  },
  {
    id: "job_4",
    recruiterId: "rec_4",
    recruiterName: "Rudi Hartono",
    companyName: "Nusantara Intelligent Systems",
    companyLogo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100",
    companyWebsite: "https://nusantara-ai.id",
    title: "AI Solutions & Full Stack LLM Engineer",
    department: "AI Research & Innovation Lab",
    location: "Bandung / Remote",
    workplaceType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    salaryMin: 24000000,
    salaryMax: 34000000,
    salaryFormatted: "Rp 24.000.000 - Rp 34.000.000 / bln",
    description: "Membangun antarmuka cerdas dan integrasi agen AI generasi baru memanfaatkan Gemini API, function calling, RAG pipeline, dan arsitektur respons real-time.",
    responsibilities: [
      "Mengintegrasikan @google/genai SDK dan endpoint LLM ke dalam aplikasi web enterprise.",
      "Mendesain prompt engineering terstruktur, semantic search embeddings, dan vector storage.",
      "Membangun antarmuka interaktif yang responsif dan minim latensi."
    ],
    requirements: [
      "Pengalaman 2+ tahun dengan TypeScript / Python dan RESTful APIs.",
      "Pemahaman mendalam mengenai arsitektur LLM, embedding vectors, dan grounding data.",
      "Pengalaman membuat aplikasi web modern dengan React atau Next.js."
    ],
    skills: ["AI Engineering", "TypeScript", "Python", "React", "Gemini API", "Vector DB", "Node.js"],
    benefits: [
      "100% Remote dari mana saja di Indonesia",
      "Kredit komputasi cloud & API AI tanpa batas untuk eksperimen",
      "Peluang publikasi riset dan paten produk"
    ],
    status: "active",
    applicantCount: 3,
    postedAt: "2026-08-19",
    deadline: "2026-09-28"
  },
  {
    id: "job_5",
    recruiterId: "rec_1",
    recruiterName: "Elena Rostova",
    companyName: "TechCorp Global",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
    companyWebsite: "https://techcorp-global.com",
    title: "DevOps & SRE Specialist (Kubernetes / CI-CD)",
    department: "Cloud Operations",
    location: "Jakarta / Onsite",
    workplaceType: "Onsite",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryMin: 25000000,
    salaryMax: 35000000,
    salaryFormatted: "Rp 25.000.000 - Rp 35.000.000 / bln",
    description: "Meningkatkan ketahanan sistem enterprise kami, mengelola cluster Kubernetes produksi, dan mengoptimalkan pipeline deployment otomatis.",
    responsibilities: [
      "Mengelola cluster Kubernetes skala besar pada cloud provider ternama.",
      "Membangun dan memelihara pipeline CI/CD GitHub Actions yang aman dan cepat.",
      "Memastikan standar keamanan ISO/IEC 27001 dan audit kepatuhan data."
    ],
    requirements: [
      "3+ tahun pengalaman hands-on DevOps / Site Reliability Engineering.",
      "Mahir dalam Docker, Kubernetes, Helm, Terraform, dan Linux system internals."
    ],
    skills: ["Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Cloud Security"],
    benefits: [
      "Tunjangan Lembur & On-Call Fair Compensation",
      "Catering Makan Siang Gratis & Snack Bar",
      "Asuransi Kesehatan Top-tier"
    ],
    status: "active",
    applicantCount: 2,
    postedAt: "2026-08-12",
    deadline: "2026-09-18"
  },
  {
    id: "job_6",
    recruiterId: "rec_5",
    recruiterName: "Siti Rahma",
    companyName: "Traveloka Labs",
    companyLogo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=100&h=100",
    companyWebsite: "https://traveloka.com",
    title: "Frontend Web Developer (Next.js & Performance)",
    department: "Flight & Accommodation Booking Web",
    location: "Jakarta / Remote",
    workplaceType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    salaryMin: 18000000,
    salaryMax: 26000000,
    salaryFormatted: "Rp 18.000.000 - Rp 26.000.000 / bln",
    description: "Membangun pengalaman pencarian tiket dan reservasi hotel berkecepatan tinggi dengan Next.js Server Components, micro-frontends, dan animasi halus.",
    responsibilities: [
      "Mengembangkan fitur checkout dan live itinerary yang responsif di seluruh perangkat mobile & desktop.",
      "Menerapkan caching strategi mutakhir dan dynamic imports untuk optimasi kecepatan koneksi lambat."
    ],
    requirements: [
      "Pengalaman 2-4 tahun dengan React, Next.js, dan CSS Frameworks.",
      "Pemahaman baik tentang SEO teknis, accessibility, dan cross-browser compatibility."
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Web Performance"],
    benefits: [
      "Voucher Diskon Traveling Tahunan Rp 12.000.000",
      "Jadwal Kerja Fleksibel (Flexible Working Hours)",
      "Asuransi Rawat Jalan & Inap Lengkap"
    ],
    status: "active",
    applicantCount: 4,
    postedAt: "2026-08-17",
    deadline: "2026-09-30"
  }
];

export const MOCK_JOB_APPLICATIONS: JobApplication[] = [
  {
    id: "app_1",
    jobId: "job_1",
    jobTitle: "Senior Full Stack React & Node.js Engineer",
    companyName: "TechCorp Global",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
    recruiterId: "rec_1",
    candidateId: "cand_1",
    candidateName: "Alex Rivera",
    candidateEmail: "alex.rivera@example.com",
    candidatePhone: "+62 811-9876-5432",
    candidateAvatar: DEFAULT_PROFILE_IMAGE,
    candidateHeadline: "Senior Full Stack Engineer | React & Node.js Specialist",
    expectedSalary: "Rp 28.000.000 / bulan",
    coverNote: "Halo Ibu Elena, saya sangat antusias melamar posisi Senior Full Stack Engineer di TechCorp Global. Dengan pengalaman 5+ tahun mengoptimalkan sistem web berskala besar dan arsitektur Next.js, saya yakin dapat langsung memberikan dampak positif pada performa platform.",
    resumeUrl: "https://alexrivera.dev/resume.pdf",
    portfolioUrl: "https://alexrivera.dev",
    appliedAt: "2026-08-21",
    status: "reviewing"
  },
  {
    id: "app_2",
    jobId: "job_1",
    jobTitle: "Senior Full Stack React & Node.js Engineer",
    companyName: "TechCorp Global",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
    recruiterId: "rec_1",
    candidateId: "cand_2",
    candidateName: "Sarah Chen",
    candidateEmail: "sarah.chen@example.com",
    candidatePhone: "+62 812-3456-7890",
    candidateAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    candidateHeadline: "Junior Frontend Developer | Active UI Enthusiast | Fresh Graduate",
    expectedSalary: "Rp 26.000.000 / bulan",
    coverNote: "Saya telah mempelajari tantangan teknis tumpukan Next.js di TechCorp Global dan siap membuktikan keahlian integrasi komponen React serta optimalisasi Web Vitals.",
    resumeUrl: "https://sarahchen.me/sarah_chen_cv.pdf",
    portfolioUrl: "https://sarahchen.me",
    interviewDate: "2026-08-28, 14:00 WIB (Google Meet)",
    meetLink: "https://meet.google.com/qwe-rtyu-iop",
    appliedAt: "2026-08-22",
    status: "interview"
  },
  {
    id: "app_3",
    jobId: "job_1",
    jobTitle: "Senior Full Stack React & Node.js Engineer",
    companyName: "TechCorp Global",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
    recruiterId: "rec_1",
    candidateId: "cand_3",
    candidateName: "Marcus Vance",
    candidateEmail: "marcus.vance@example.com",
    candidatePhone: "+62 821-4455-6677",
    candidateAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    candidateHeadline: "Product Marketing Lead | Growth Strategist | Fintech Specialist",
    expectedSalary: "Rp 32.000.000 / bulan",
    coverNote: "Kombinasi pengalaman rekayasa backend, analitik data terdistribusi, dan kepemimpinan squad engineering saya sangat selaras dengan kebutuhan TechCorp.",
    resumeUrl: "https://vancestrategy.id/marcus_vance_dossier.pdf",
    portfolioUrl: "https://vancestrategy.id",
    appliedAt: "2026-08-19",
    status: "offered"
  },
  {
    id: "app_4",
    jobId: "job_1",
    jobTitle: "Senior Full Stack React & Node.js Engineer",
    companyName: "TechCorp Global",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
    recruiterId: "rec_1",
    candidateId: "cand_4",
    candidateName: "Bunga Pratiwi",
    candidateEmail: "bunga.pratiwi@example.com",
    candidatePhone: "+62 813-2233-4455",
    candidateAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    candidateHeadline: "Lead UI/UX Designer & Design System Specialist",
    expectedSalary: "Rp 29.000.000 / bulan",
    coverNote: "Memiliki keahlian kuat dalam TypeScript frontend, design-to-code pipeline, dan optimasi performa browser. Siap bergabung segera.",
    resumeUrl: "https://bungapratiwi.design/bunga_pratiwi_cv.pdf",
    portfolioUrl: "https://bungapratiwi.design",
    appliedAt: "2026-08-23",
    status: "applied"
  }
];

export const MOCK_PROPOSALS: TrainingProposal[] = [
  {
    id: "prop_1",
    type: "training_proposal",
    partnerName: "Hendra Wijaya, M.Kom",
    institutionName: "Cloud Computing Academy Indonesia (AWS Partner)",
    email: "hendra.wijaya@cloudacademy.id",
    phone: "+62 812-8899-7711",
    programTitle: "AWS Certified Solutions Architect & DevOps Masterclass",
    category: "Coding",
    programType: "Government",
    format: "Online",
    duration: "10 Minggu",
    certification: true,
    description: "Program intensif persiapan sertifikasi AWS Solutions Architect Associate dan praktik CI/CD pipeline berbasis Kubernetes untuk 100 talenta muda terpilih.",
    syllabusOverview: "Modul 1: AWS VPC & Networking; Modul 2: EKS & Microservices; Modul 3: Terraform Infrastructure as Code; Modul 4: Capstone Proyek Skala Besar.",
    requirements: [
      "Warga Negara Indonesia (WNI)",
      "Memiliki dasar Linux dan jaringan komputer",
      "Berkomitmen 15 jam per minggu selama 10 minggu"
    ],
    registrationLink: "https://cloudacademy.id/aws-masterclass-2026",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=300",
    submittedAt: "2026-08-28T11:20:00.000Z",
    status: "pending",
    adminNotes: "Mitra telah mengirim silabus via email, perlu konfirmasi kuota beasiswa via WhatsApp."
  },
  {
    id: "prop_2",
    type: "training_proposal",
    partnerName: "Citra Lestari",
    institutionName: "Nusantara UX Guild",
    email: "citra.lestari@uxguild.org",
    phone: "+62 813-7744-1122",
    programTitle: "Human-Centered AI & Spatial UI Design Bootcamp",
    category: "Design",
    programType: "NGO",
    format: "Online",
    duration: "6 Minggu",
    certification: true,
    description: "Pelatihan desain antarmuka interaktif dan etika desain produk AI untuk desainer produk muda yang ingin memasuki industri teknologi global.",
    syllabusOverview: "Modul 1: Design Thinking untuk Sistem AI; Modul 2: Design Tokens & Component Libraries; Modul 3: Figma Prototyping Lanjutan; Modul 4: Portfolio Defense.",
    requirements: [
      "Portofolio desain UI dasar (Figma/Behance)",
      "Mahasiswa tingkat akhir atau profesional transisi karir"
    ],
    registrationLink: "https://uxguild.org/spatial-ai-design",
    imageUrl: "https://images.unsplash.com/photo-1581291518655-9523c932deb2?auto=format&fit=crop&q=80&w=300",
    submittedAt: "2026-08-25T09:45:00.000Z",
    status: "under_review",
    adminNotes: "Diskusi via telepon dijadwalkan hari Rabu. Kerjasama beasiswa gratis untuk 50 talenta TalentHub."
  },
  {
    id: "prop_3",
    type: "complaint",
    partnerName: "Rizky Ramadhani",
    institutionName: "Alumni Batch 3 DTS",
    email: "rizky.ramadhani@gmail.com",
    phone: "+62 818-5544-3322",
    programTitle: "Laporan Tautan Pendaftaran Kominfo DTS Tidak Dapat Dibuka",
    category: "Coding",
    programType: "Government",
    format: "Online",
    duration: "12 Minggu",
    certification: true,
    description: "Tautan pendaftaran untuk program Digital Talent Scholarship Kominfo di kartu pelatihan menampilkan error 404 saat dibuka pada siang hari ini.",
    requirements: [],
    registrationLink: "https://digitalent.kominfo.go.id",
    submittedAt: "2026-08-29T14:10:00.000Z",
    status: "pending",
    adminNotes: "Periksa kembali URL pendaftaran Kominfo apakah ada perubahan tautan pendaftaran batch baru."
  }
];

export const MOCK_SCHOLARSHIP_APPLICATIONS: CandidateScholarshipApplication[] = [
  {
    id: "sch_app_1",
    candidateId: "cand_1",
    candidateName: "Alex Rivera",
    candidateEmail: "alex.rivera@example.com",
    candidatePhone: "+62 811-9876-5432",
    candidateAvatar: DEFAULT_PROFILE_IMAGE,
    trainingId: "tr_1",
    trainingTitle: "Digital Talent Scholarship (DTS) - Full Stack Engineering",
    provider: "Kementerian Komunikasi dan Informatika (Kominfo)",
    format: "Online",
    motivationEssay: "Saya sangat berkomitmen memperdalam arsitektur TypeScript tingkat lanjut dan arsitektur database modern untuk membangun solusi teknologi inklusif di Indonesia. Beasiswa ini akan mempercepat kesiapan tim engineering kami dalam memenuhi standar industri global.",
    careerGoals: "Menjadi Principal Cloud & Full-Stack Architect yang memimpin modernisasi sistem digital publik dan membimbing generasi junior developer.",
    portfolioUrl: "https://github.com/alexrivera",
    linkedinUrl: "https://linkedin.com/in/alex-rivera-dev",
    gpaOrAchievement: "IPK 3.89 / Cumlaude - Teknik Informatika",
    weeklyCommitmentHours: 15,
    submittedAt: "2026-08-28",
    status: "approved",
    adminFeedback: "Aplikasi beasiswa Anda telah disetujui oleh Panitia Seleksi DTS Kominfo. Kuota resmi dan kredensial ruang kelas telah diterbitkan ke dasbor Anda.",
    reviewedAt: "2026-08-30",
    reviewedBy: "Super Admin TalentHub"
  },
  {
    id: "sch_app_2",
    candidateId: "cand_2",
    candidateName: "Sarah Jenkins",
    candidateEmail: "sarah.j@example.com",
    candidatePhone: "+62 812-3456-7890",
    candidateAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    trainingId: "tr_2",
    trainingTitle: "Fintech Growth & Performance Marketing Intensive",
    provider: "Indonesia Tech Academy (NGO)",
    format: "Offline",
    motivationEssay: "Sebagai lulusan baru dengan passion di dunia digital marketing & fintech analytics, program tatap muka di Innovation Hub ini akan memberikan pengalaman langsung mengelola live campaign budget dan attribution model.",
    careerGoals: "Bekerja sebagai Performance Marketing Specialist di industri fintech unicorn dalam 6 bulan pasca kelulusan bootcamp.",
    portfolioUrl: "https://sarahjenkins.design",
    linkedinUrl: "https://linkedin.com/in/sarahjenkins-growth",
    gpaOrAchievement: "Juara 2 National Marketing Pitch 2025",
    weeklyCommitmentHours: 20,
    submittedAt: "2026-08-31",
    status: "under_review",
    adminFeedback: "Berkas Anda sedang dalam proses kurasi tahap akhir bersama komite seleksi beasiswa Indonesia Tech Academy."
  }
];


