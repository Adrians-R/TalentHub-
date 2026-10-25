/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, 
  Search, 
  GraduationCap, 
  MapPin, 
  Award, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle, 
  Star, 
  Clock, 
  ChevronRight, 
  X, 
  Bookmark, 
  Users, 
  Building2, 
  Plus,
  Video,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  QrCode,
  Calendar,
  Info,
  Check,
  Smartphone,
  Lock,
  Download,
  AlertCircle,
  Copy
} from "lucide-react";
import { TrainingProgram, CandidateScholarshipApplication, Candidate, DEFAULT_PROFILE_IMAGE } from "../types";
import { useLanguage } from "../context/LanguageContext";
import PartnerProposalModal from "./PartnerProposalModal";
import CandidateScholarshipModal from "./CandidateScholarshipModal";

interface TrainingViewProps {
  trainings: TrainingProgram[];
  onTabChange?: (tab: string) => void;
  isLoggedIn?: boolean;
  currentUser?: any;
  onEnrollCourse?: (training: TrainingProgram, paymentDetails?: { method: string; amount: number; platformFee: number }) => void;
  onApplyScholarship?: (application: CandidateScholarshipApplication) => void;
}

export default function TrainingView({ 
  trainings, 
  onTabChange, 
  isLoggedIn = false,
  currentUser,
  onEnrollCourse,
  onApplyScholarship
}: TrainingViewProps) {
  const { isIndonesian } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSkillTag, setSelectedSkillTag] = useState("");
  
  // Modals state
  const [selectedCourse, setSelectedCourse] = useState<TrainingProgram | null>(null);
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [joinedCourses, setJoinedCourses] = useState<string[]>(["tr_1", "tr_2"]);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [scholarshipCourse, setScholarshipCourse] = useState<TrainingProgram | null>(null);
  const [scholarshipSubmittedSuccess, setScholarshipSubmittedSuccess] = useState<string | null>(null);

  // Authentication Required Prompt Modal
  const [authPromptCourse, setAuthPromptCourse] = useState<TrainingProgram | null>(null);

  // Checkout / Payment Modal State for Paid courses
  const [checkoutCourse, setCheckoutCourse] = useState<TrainingProgram | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"qris" | "bca_va" | "mandiri_va" | "credit_card" | "gopay">("qris");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copiedVa, setCopiedVa] = useState(false);

  // Success Confirmation Modal
  const [enrollmentSuccess, setEnrollmentSuccess] = useState<{
    training: TrainingProgram;
    isPaid: boolean;
    ticketCode?: string;
    invoiceNumber?: string;
    paymentMethod?: string;
    amount?: number;
    platformFee?: number;
  } | null>(null);

  // Sample static Learning Paths
  const learningPaths = [
    {
      id: "path_1",
      title: isIndonesian ? "Spesialis Rekayasa Frontend" : "Frontend Engineering Specialist",
      coursesCount: 4,
      duration: isIndonesian ? "12 Minggu" : "12 Weeks",
      level: isIndonesian ? "Pemula hingga Mahir" : "Beginner to Advanced",
      description: isIndonesian 
        ? "Kuasai HTML/CSS inti, React 19, dan Tailwind CSS untuk menarik rekrutmen teknologi langsung."
        : "Acquire the core HTML/CSS, React 19, and Tailwind CSS skill vectors to attract direct tech sourcing.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      accent: "from-blue-500 to-indigo-600"
    },
    {
      id: "path_2",
      title: isIndonesian ? "Pemasar Pertumbuhan Fintech & Performa" : "Fintech Growth & Performance Marketer",
      coursesCount: 3,
      duration: isIndonesian ? "8 Minggu" : "8 Weeks",
      level: isIndonesian ? "Menengah" : "Intermediate",
      description: isIndonesian
        ? "Pelajari analitik corong akuisisi klien, optimalisasi mesin telusur, dan optimasi anggaran digital."
        : "Learn client acquisition funnel analytics, search engine optimization routing, and digital budget optimization.",
      skills: ["Google Analytics", "SEO Optimization", "Tableau", "Marketing Strategy"],
      accent: "from-emerald-500 to-teal-600"
    },
    {
      id: "path_3",
      title: isIndonesian ? "Arsitek UI/UX Produk High-Fidelity" : "High-Fidelity Product UI/UX Architect",
      coursesCount: 3,
      duration: isIndonesian ? "6 Minggu" : "6 Weeks",
      level: isIndonesian ? "Menengah" : "Intermediate",
      description: isIndonesian
        ? "Kuasai translasi riset pengguna, komponen desain Figma berdefinisi tinggi, dan prototipe sistem UI interaktif."
        : "Master user research translation, high-fidelity Figma design components, and interactive UI system prototypes.",
      skills: ["Figma Design", "User Research", "Wireframing", "UI Prototyping"],
      accent: "from-purple-500 to-pink-600"
    }
  ];

  // Popular skill tags for fast filtering
  const popularSkills = [
    "React", "TypeScript", "Figma Design", "SQL", "Tailwind CSS", "Next.js", "Marketing Analytics", "Google Analytics", "SEO Optimization"
  ];

  // Filtering Logic
  const filteredTrainings = trainings.filter(prog => {
    const matchesSearch = prog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prog.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prog.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || prog.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesFormat = selectedFormat === "all" || prog.format.toLowerCase() === selectedFormat.toLowerCase();
    const matchesType = selectedType === "all" || prog.type.toLowerCase() === selectedType.toLowerCase();

    const matchesSkill = !selectedSkillTag || 
      prog.title.toLowerCase().includes(selectedSkillTag.toLowerCase()) ||
      prog.description.toLowerCase().includes(selectedSkillTag.toLowerCase());

    return matchesSearch && matchesCategory && matchesFormat && matchesType && matchesSkill;
  });

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedCourses.includes(id)) {
      setBookmarkedCourses(bookmarkedCourses.filter(b => b !== id));
    } else {
      setBookmarkedCourses([...bookmarkedCourses, id]);
    }
  };

  // Main Registration Flow Trigger
  const handleInitiateEnrollment = (course: TrainingProgram) => {
    // 1. Check Authentication Guard
    if (!isLoggedIn) {
      setSelectedCourse(null);
      setAuthPromptCourse(course);
      return;
    }

    // [PAID_FEATURE_TOGGLE] Paid course checkout bypassed for Free Trial mode.
    // All training courses can be enrolled freely. Uncomment below to restore checkout:
    /*
    const isPaid = (course.price ?? 0) > 0;
    if (isPaid) {
      setSelectedCourse(null);
      setCheckoutCourse(course);
      return;
    }
    */

    // 3. Free / Free Trial instant enrollment
    completeEnrollment(course, false, isIndonesian ? "Masa Uji Coba Gratis" : "Free Trial Access");
  };

  // Finalize Enrollment
  const completeEnrollment = (
    course: TrainingProgram, 
    isPaid: boolean,
    paymentMethodName: string = "Beasiswa / Akses Gratis"
  ) => {
    const price = course.price ?? 0;
    const platformFee = isPaid ? Math.round(price * (course.platformFeeRate ?? 0.10)) : 0;
    const ticketCode = course.format !== "Online" ? `TICKET-${Math.floor(100000 + Math.random() * 900000)}` : undefined;
    const invoiceNumber = isPaid ? `INV-PAY-${Date.now().toString().slice(-6)}` : `INV-FREE-${Date.now().toString().slice(-6)}`;

    // Add to local state
    if (!joinedCourses.includes(course.id)) {
      setJoinedCourses(prev => [...prev, course.id]);
    }

    // Invoke global callback to persist in Candidate account
    if (onEnrollCourse) {
      onEnrollCourse(course, isPaid ? {
        method: paymentMethodName,
        amount: price,
        platformFee
      } : undefined);
    }

    setSelectedCourse(null);
    setCheckoutCourse(null);
    setEnrollmentSuccess({
      training: course,
      isPaid,
      ticketCode,
      invoiceNumber,
      paymentMethod: paymentMethodName,
      amount: price,
      platformFee
    });
  };

  // Simulate Payment Processing
  const handleProcessPayment = () => {
    if (!checkoutCourse) return;
    setIsProcessingPayment(true);

    const methodLabels: Record<string, string> = {
      qris: "QRIS Instant Scan",
      bca_va: "BCA Virtual Account",
      mandiri_va: "Mandiri Virtual Account",
      credit_card: "Kartu Kredit / Debit",
      gopay: "GoPay / E-Wallet"
    };

    setTimeout(() => {
      setIsProcessingPayment(false);
      completeEnrollment(checkoutCourse, true, methodLabels[selectedPaymentMethod]);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14" id="learning-view-container">
      
      {/* 1. HERO SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-5">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-[11px] font-extrabold text-blue-700 border border-blue-100 uppercase tracking-wider">
          <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
          <span>{isIndonesian ? "Katalog Pelatihan & Peningkatan Keterampilan" : "Talent Academy & Skill Vectors"}</span>
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {isIndonesian ? "Tingkatkan Keterampilan Anda." : "Level Up Your Skills."} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            {isIndonesian ? "Ditemukan Langsung Oleh Perekrut." : "Get Discovered Instantly."}
          </span>
        </h1>
        <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {isIndonesian
            ? "Ikuti program pelatihan daring (Online) atau tatap muka langsung (Offline) dengan kurikulum berstandar industri. Setiap program dilengkapi sertifikasi resmi yang tersinkronisasi otomatis ke profil kandidat Anda."
            : "Enroll in high-contrast online live courses or in-person offline bootcamps with industry-validated syllabi. Verified certificates sync directly with your searchable candidate profile."}
        </p>

        {/* Partner Outreach & Proposal Action Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl shadow-slate-950/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-left relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1.5 z-10 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase tracking-wider border border-blue-400/30">
              <Building2 className="h-3 w-3" />
              <span>{isIndonesian ? "Pusat Kemitraan Lembaga & Akademi" : "Partner & Academy Gateway"}</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              {isIndonesian ? "Ingin Mempublikasikan Program Pelatihan Lembaga Anda?" : "Want to Publish Your Organization's Training Program?"}
            </h3>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {isIndonesian
                ? "Daftarkan program bootcamp, akademi, beasiswa, atau program sertifikasi instansi Anda. Super Admin akan meninjau dan mempublikasikannya langsung ke ribuan talenta teknologi terverifikasi."
                : "Submit your bootcamp, certification academy, or scholarship. Super Admin reviews and publishes directly to thousands of vetted talents."}
            </p>
          </div>
          <div className="shrink-0 z-10 w-full sm:w-auto">
            <button
              onClick={() => setIsPartnerModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black tracking-tight shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer hover:scale-[1.02]"
              id="partner-propose-training-btn"
            >
              <Plus className="h-4 w-4 text-white" />
              <span>{isIndonesian ? "Ajukan Program / Kemitraan" : "Propose Training Program"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. LEARNING PATHS */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {isIndonesian ? "Jalur Pembelajaran Terstruktur" : "Structured Learning Paths"}
            </h2>
            <p className="text-xs text-slate-400 font-bold">
              {isIndonesian ? "Kurikulum terpadu yang dirancang khusus untuk spesialisasi dengan permintaan industri tertinggi" : "Curated curriculum sequences designed for high-demand specializations"}
            </p>
          </div>
          <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
            {isIndonesian ? "3 Spesialisasi Tersedia" : "3 Specializations Available"}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {learningPaths.map((path) => (
            <div 
              key={path.id}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between hover:border-slate-200 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-200 to-slate-300 group-hover:h-2 transition-all" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{path.level}</span>
                  <span className="text-[11px] font-extrabold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    {path.coursesCount} {isIndonesian ? "Kursus" : "Courses"} • {path.duration}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {path.description}
                  </p>
                </div>

                {/* Path Skills Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {path.skills.map((skill) => (
                    <span 
                      key={skill}
                      onClick={() => {
                        setSelectedSkillTag(skill);
                        setSearchTerm(skill);
                      }}
                      className="text-[10px] font-extrabold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-2 py-0.5 rounded-md border border-slate-100 cursor-pointer transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-50 mt-6 pt-4 flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="text-[11px] font-extrabold text-emerald-600 flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  {isIndonesian ? "Termasuk Sertifikat Resmi" : "Certificate Included"}
                </span>
                <button
                  onClick={() => {
                    setSearchTerm(path.skills[0]);
                    setSelectedSkillTag(path.skills[0]);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-black text-xs flex items-center group-hover:translate-x-0.5 transition-transform cursor-pointer"
                >
                  <span>{isIndonesian ? "Lihat Kursus" : "View"}</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SEARCH & DIRECTORY GRID */}
      <div className="space-y-6 pt-4">
        {/* Search header & Filter tools */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {isIndonesian ? "Eksplorasi Program & Bootcamp" : "Explore Training Programs"}
            </h2>
            <p className="text-xs text-slate-400 font-bold">
              {isIndonesian ? "Filter berdasarkan format tatap muka (Offline) atau daring interaktif (Online)" : "Filter by online interactive live class or physical offline venue"}
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="search-training-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isIndonesian ? "Cari topik, keahlian, mitra..." : "Search topics, skills, partners..."}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Categories / Formats filters */}
        <div className="space-y-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs">
          {/* Main Category row */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-2">
              {isIndonesian ? "Kategori:" : "Category:"}
            </span>
            {[
              { id: "all", label: isIndonesian ? "Semua Bidang" : "All Subjects" },
              { id: "coding", label: isIndonesian ? "Coding & Teknologi" : "Coding & Tech" },
              { id: "design", label: isIndonesian ? "Desain UI/UX Produk" : "Product UI/UX" },
              { id: "product", label: isIndonesian ? "Manajemen Produk" : "Management" },
              { id: "marketing", label: isIndonesian ? "Pemasaran Digital" : "Marketing" },
              { id: "data", label: isIndonesian ? "Sains Data & AI" : "Data & AI" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id 
                    ? "bg-slate-900 text-white shadow-2xs" 
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sub options row: Type & Format */}
          <div className="flex flex-wrap gap-4 items-center pt-2 border-t border-slate-100">
            
            {/* Format Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                {isIndonesian ? "Format Pembelajaran:" : "Format:"}
              </span>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-bold text-slate-700 outline-none hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <option value="all">{isIndonesian ? "Semua Format (Online & Offline)" : "All Formats"}</option>
                <option value="online">{isIndonesian ? "🌐 Online (Google Meet / Zoom / LMS)" : "🌐 Online (Live / LMS)"}</option>
                <option value="offline">{isIndonesian ? "🏢 Offline (Tatap Muka di Lokasi / Kelas Fisik)" : "🏢 Offline (In-Person Venue)"}</option>
                <option value="hybrid">{isIndonesian ? "⚡ Hybrid (Online + Onsite)" : "⚡ Hybrid"}</option>
              </select>
            </div>

            {/* Sponsor Type Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                {isIndonesian ? "Tipe Biaya & Sponsor:" : "Funding Type:"}
              </span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-bold text-slate-700 outline-none hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <option value="all">{isIndonesian ? "Semua Tipe (Gratis & Berbayar)" : "All Types"}</option>
                <option value="government">{isIndonesian ? "🏛️ Didanai Pemerintah (Kominfo APBN)" : "🏛️ Government Funded"}</option>
                <option value="ngo">{isIndonesian ? "🤝 Beasiswa Penuh NGO / Yayasan" : "🤝 NGO Scholarship"}</option>
                <option value="free">{isIndonesian ? "✨ Akses Gratis Terbuka" : "✨ Free Community"}</option>
                <option value="paid">{isIndonesian ? "💳 Mitra Berbayar (Paid Partner)" : "💳 Paid Partner"}</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {(selectedCategory !== "all" || selectedFormat !== "all" || selectedType !== "all" || searchTerm || selectedSkillTag) && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedFormat("all");
                  setSelectedType("all");
                  setSearchTerm("");
                  setSelectedSkillTag("");
                }}
                className="text-xs font-bold text-red-600 hover:text-red-700 ml-auto flex items-center gap-1 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>{isIndonesian ? "Atur Ulang Filter" : "Reset Filters"}</span>
              </button>
            )}

          </div>
        </div>

        {/* Directory Grid */}
        {filteredTrainings.length === 0 ? (
          <div className="border border-dashed border-slate-200 bg-white rounded-3xl py-16 text-center space-y-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900">
                {isIndonesian ? "Tidak ada program yang cocok dengan filter Anda" : "No programs match your filter"}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold max-w-sm mx-auto">
                {isIndonesian ? "Coba atur ulang filter format atau kata kunci pencarian Anda untuk melihat opsi lainnya." : "Try resetting the format filter or search keyword."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainings.map((prog) => {
              const isBookmarked = bookmarkedCourses.includes(prog.id);
              const isEnrolled = joinedCourses.includes(prog.id);
              const isPaid = (prog.price ?? 0) > 0;

              return (
                <div
                  key={prog.id}
                  id={`course-card-${prog.id}`}
                  onClick={() => setSelectedCourse(prog)}
                  className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between hover:border-blue-200 cursor-pointer group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Course Banner Image */}
                    <div className="h-44 w-full rounded-2xl bg-slate-100 overflow-hidden relative">
                      <img 
                        src={prog.imageUrl} 
                        alt={prog.title} 
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        {/* Format Badge */}
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-xs ${
                          prog.format === "Offline"
                            ? "bg-amber-600 text-white"
                            : prog.format === "Hybrid"
                            ? "bg-purple-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}>
                          {prog.format === "Offline" ? <MapPin className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                          <span>{prog.format}</span>
                        </span>

                        {/* Price Badge */}
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-xs ${
                          isPaid 
                            ? "bg-emerald-600 text-white" 
                            : "bg-slate-900/80 backdrop-blur-xs text-white"
                        }`}>
                          {isPaid ? (prog.priceFormatted || `Rp ${prog.price?.toLocaleString("id-ID")}`) : (isIndonesian ? "Gratis" : "Free")}
                        </span>
                      </div>

                      {/* Bookmark button */}
                      <button
                        onClick={(e) => handleToggleBookmark(prog.id, e)}
                        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors z-10 ${
                          isBookmarked 
                            ? "bg-blue-600 text-white" 
                            : "bg-slate-900/40 text-white hover:bg-slate-900/60"
                        }`}
                      >
                        <Bookmark className="h-3.5 w-3.5 fill-current" />
                      </button>

                      {/* Bottom Info on Image */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                        <span className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{prog.duration}</span>
                        </span>
                        {prog.format === "Offline" && prog.venueCity && (
                          <span className="bg-amber-950/70 text-amber-200 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{prog.venueCity}</span>
                          </span>
                        )}
                        {prog.format === "Online" && (
                          <span className="bg-blue-950/70 text-blue-200 px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            <span>{prog.onlineMeetingPlatform || "Google Meet"}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Title */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                        <span className="truncate max-w-[180px]">{prog.provider}</span>
                        {prog.spotsLeft && (
                          <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-black">
                            {isIndonesian ? `Sisa ${prog.spotsLeft} Kursi` : `${prog.spotsLeft} spots left`}
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {prog.title}
                      </h3>
                      
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                        {prog.description}
                      </p>

                      {/* Location / Schedule snippet */}
                      {prog.format === "Offline" && prog.venueName && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50/70 p-2 rounded-xl border border-amber-100">
                          <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">{prog.venueName}</span>
                        </div>
                      )}
                      {prog.format === "Online" && prog.schedule && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-800 bg-blue-50/70 p-2 rounded-xl border border-blue-100">
                          <Calendar className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{prog.schedule}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between">
                    <div className="flex items-center text-[10px] font-bold text-slate-400 space-x-2">
                      <span className="flex items-center text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current mr-0.5" /> 
                        4.9
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600 mr-0.5" />
                        {isIndonesian ? "Bersertifikat" : "Certified"}
                      </span>
                    </div>

                    <button 
                      type="button"
                      className={`text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center space-x-1 cursor-pointer transition-colors ${
                        isEnrolled 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : "bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white"
                      }`}
                    >
                      <span>{isEnrolled ? (isIndonesian ? "Terdaftar ✓" : "Enrolled ✓") : (isIndonesian ? "Rincian & Daftar" : "Details & Register")}</span>
                      {!isEnrolled && <ArrowRight className="h-3 w-3 ml-0.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. CALL TO ACTION */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_45%)]" />
        
        <div className="space-y-3 max-w-xl relative z-10">
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-500/10 text-xs font-bold text-blue-400 border border-blue-500/20 uppercase tracking-widest">
            <Award className="h-3.5 w-3.5 mr-1" />
            <span>{isIndonesian ? "Jalur Khusus Verifikasi ATS" : "Verified Profile Integration"}</span>
          </span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
            {isIndonesian 
              ? "Selesaikan Pelatihan & Dapatkan Penawaran Gaji Transparan"
              : "Complete Certifications & Get Direct Recruiter Offers"}
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            {isIndonesian
              ? "Setiap modul pelatihan yang diselesaikan akan otomatis meningkatkan skor relevansi pencarian profil Anda bagi perekrut terverifikasi di TalentHub."
              : "Every accredited course you complete automatically boosts your talent ranking in recruiter sourcing searches."}
          </p>
        </div>

        <div className="shrink-0 relative z-10">
          <button 
            onClick={() => {
              if (onTabChange) {
                onTabChange(isLoggedIn ? "candidate-dashboard" : "register");
              }
            }}
            className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
          >
            <span>{isLoggedIn ? (isIndonesian ? "Buka Dasbor Kandidat" : "Go to Dashboard") : (isIndonesian ? "Buat Profil Gratis" : "Create Free Profile")}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. COURSE DETAILS DRAWER / MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Image Header */}
            <div className="h-52 w-full bg-slate-100 relative">
              <img 
                src={selectedCourse.imageUrl} 
                alt={selectedCourse.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              
              <button 
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 p-2 bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/80 text-white rounded-full cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex flex-wrap gap-2 items-center justify-between">
                <div className="flex gap-2">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase shadow-xs ${
                    selectedCourse.format === "Offline"
                      ? "bg-amber-600 text-white"
                      : selectedCourse.format === "Hybrid"
                      ? "bg-purple-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}>
                    {selectedCourse.format === "Offline" ? "🏢 Format Tatap Muka (Offline)" : "🌐 Format Daring (Online Live)"}
                  </span>
                  <span className="text-[10px] font-extrabold bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-lg uppercase">
                    {selectedCourse.type} Sponsor
                  </span>
                </div>
                <span className="text-xs font-black bg-emerald-600 text-white px-3 py-1 rounded-lg shadow-xs">
                  {selectedCourse.price && selectedCourse.price > 0 
                    ? selectedCourse.priceFormatted || `Rp ${selectedCourse.price.toLocaleString("id-ID")}` 
                    : (isIndonesian ? "100% Gratis" : "100% Free")}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Header Info */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                  <span>{isIndonesian ? "Kategori:" : "Category:"} {selectedCourse.category}</span>
                  <span className="flex items-center text-slate-600 font-extrabold"><Clock className="h-3.5 w-3.5 mr-1 text-blue-600" /> {selectedCourse.duration}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {selectedCourse.title}
                </h2>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-slate-500 font-bold">{isIndonesian ? "Penyelenggara Resmi:" : "Official Provider:"}</span>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {selectedCourse.provider}
                  </span>
                </div>
              </div>

              {/* FORMAT CLARITY: Offline vs Online Detailed Section */}
              {selectedCourse.format === "Offline" ? (
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <MapPin className="h-4 w-4 text-amber-700" />
                      <span>{isIndonesian ? "Informasi Lokasi & Kelas Tatap Muka (Offline)" : "Physical Classroom & Venue Details"}</span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      {isIndonesian ? "Presensi Fisik Wajib" : "Onsite Attendance"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <div>
                      <span className="font-extrabold text-slate-900 block">{selectedCourse.venueName || "TalentHub Training Center - Menara Cyber 2"}</span>
                      <span className="text-slate-600 font-medium block">{selectedCourse.venueRoom || "Auditorium Lantai 15, Training Lab 3"}</span>
                      <span className="text-slate-500 font-medium block mt-0.5">{selectedCourse.venueAddress || "Jl. H.R. Rasuna Said Blok X-5 No. 13, Kuningan, Jakarta Selatan 12950"}</span>
                    </div>

                    {selectedCourse.schedule && (
                      <div className="pt-2 border-t border-amber-200/60 flex items-center gap-2 font-bold text-amber-950">
                        <Calendar className="h-3.5 w-3.5 text-amber-700" />
                        <span>{selectedCourse.schedule}</span>
                      </div>
                    )}

                    {selectedCourse.venueGuidelines && (
                      <div className="pt-2 border-t border-amber-200/60 space-y-1">
                        <span className="text-[11px] font-extrabold text-slate-700">{isIndonesian ? "Panduan Kehadiran di Lokasi:" : "Venue Guidelines:"}</span>
                        <ul className="space-y-1 text-[11px] text-slate-600">
                          {selectedCourse.venueGuidelines.map((g, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <Check className="h-3 w-3 text-amber-700 shrink-0" />
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Google Maps Button */}
                    <div className="pt-2">
                      <a
                        href={selectedCourse.venueGoogleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(selectedCourse.venueAddress || selectedCourse.venueName || "Menara Cyber 2 Jakarta")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3.5 py-1.5 rounded-xl transition-colors"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{isIndonesian ? "Buka Petunjuk Arah di Google Maps" : "Open in Google Maps"}</span>
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <Video className="h-4 w-4 text-blue-600" />
                      <span>{isIndonesian ? "Format Daring Interaktif (Online Live)" : "Interactive Online Live Classroom"}</span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {selectedCourse.onlineMeetingPlatform || "Google Meet / Zoom"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700">
                    <p className="text-slate-600 font-medium">
                      {isIndonesian
                        ? "Sesi diselenggarakan secara live interaktif. Anda dapat berdiskusi langsung dengan instruktur, mengerjakan latihan bersama, dan mengakses rekaman kelas 24/7 di portal LMS."
                        : "Live interactive classes with direct instructor Q&A, hands-on coding labs, and 24/7 access to session video archives."}
                    </p>
                    {selectedCourse.schedule && (
                      <div className="flex items-center gap-2 font-bold text-blue-950 bg-blue-100/60 p-2 rounded-xl">
                        <Calendar className="h-3.5 w-3.5 text-blue-700" />
                        <span>{selectedCourse.schedule}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price & Platform Fee Transparency (for Paid courses) */}
              {selectedCourse.price && selectedCourse.price > 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-emerald-600" />
                      <span>{isIndonesian ? "Rincian Biaya Transparan & Layanan TalentHub" : "Transparent Fee Breakdown"}</span>
                    </span>
                    <span className="text-xs font-black text-emerald-700">
                      {selectedCourse.priceFormatted || `Rp ${selectedCourse.price.toLocaleString("id-ID")}`}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200">
                    <div className="flex justify-between text-slate-600">
                      <span>{isIndonesian ? `Biaya Pelatihan (${selectedCourse.provider} - 90%):` : "Course Provider Share (90%):"}</span>
                      <span className="font-bold">Rp {Math.round(selectedCourse.price * 0.9).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="flex items-center gap-1">
                        <span>{isIndonesian ? "Biaya Layanan Platform TalentHub (10%):" : "TalentHub Platform Fee (10%):"}</span>
                        <Info className="h-3 w-3 text-slate-400" title="Biaya pemeliharaan platform, penerbitan sertifikat digital, dan sinkronisasi badge terverifikasi ke recruiter sourcing." />
                      </span>
                      <span className="font-bold text-blue-600">Rp {Math.round(selectedCourse.price * 0.1).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between font-black text-slate-900 pt-2 border-t border-slate-200 text-sm">
                      <span>{isIndonesian ? "Total Pembayaran:" : "Total Payable:"}</span>
                      <span className="text-emerald-700">Rp {selectedCourse.price.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-950">{isIndonesian ? "Program 100% Bebas Biaya (Rp 0)" : "100% Fully Funded Program"}</h4>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      {isIndonesian
                        ? "Didanai secara penuh oleh pemerintah atau yayasan mitra. Tidak ada biaya tersembunyi."
                        : "Fully sponsored by government or partner foundation. No hidden charges."}
                    </p>
                  </div>
                </div>
              )}

              {/* Instructor / Mentor Info */}
              {selectedCourse.instructorName && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex items-center gap-3.5">
                  <img
                    src={selectedCourse.instructorAvatar || DEFAULT_PROFILE_IMAGE}
                    alt={selectedCourse.instructorName}
                    className="h-12 w-12 rounded-2xl object-cover border border-slate-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                    }}
                  />
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      {isIndonesian ? "Instruktur / Pengajar Utama" : "Lead Instructor"}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-xs">{selectedCourse.instructorName}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{selectedCourse.instructorTitle}</p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "Deskripsi Program" : "Program Description"}
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Syllabus Breakdown */}
              {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {isIndonesian ? "Silabus & Modul Pembelajaran:" : "Course Syllabus Modules:"}
                  </h4>
                  <div className="space-y-2">
                    {selectedCourse.syllabus.map((mod) => (
                      <div key={mod.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                        <div className="flex justify-between items-center text-xs font-extrabold text-slate-900">
                          <span>Modul {mod.moduleNumber}: {mod.title}</span>
                          <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{mod.duration}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {mod.topics.map((t, idx) => (
                            <span key={idx} className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-100">
                              • {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 sticky bottom-0 bg-white">
                <button 
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold cursor-pointer transition-colors text-center"
                >
                  {isIndonesian ? "Tutup" : "Close"}
                </button>

                {/* If Scholarship / Free / Government program */}
                {(!selectedCourse.price || selectedCourse.price === 0) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!isLoggedIn) {
                        setSelectedCourse(null);
                        setAuthPromptCourse(selectedCourse);
                        return;
                      }
                      const course = selectedCourse;
                      setSelectedCourse(null);
                      setScholarshipCourse(course);
                    }}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black cursor-pointer transition-all text-center shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>{isIndonesian ? "Ajukan Beasiswa (100% Funded)" : "Apply for Scholarship"}</span>
                  </button>
                )}

                <button 
                  type="button"
                  id="enroll-course-action-btn"
                  onClick={() => handleInitiateEnrollment(selectedCourse)}
                  className={`flex-1 py-3 text-white rounded-2xl text-xs font-extrabold cursor-pointer transition-all text-center shadow-md flex items-center justify-center space-x-2 ${
                    joinedCourses.includes(selectedCourse.id)
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <Award className="h-4 w-4" />
                  <span>
                    {joinedCourses.includes(selectedCourse.id) 
                      ? (isIndonesian ? "Buka Materi (Terdaftar ✓)" : "Open Course (Enrolled ✓)") 
                      : (selectedCourse.price && selectedCourse.price > 0 
                          ? (isIndonesian ? "Daftar & Lanjut Pembayaran" : "Enroll & Pay") 
                          : (isIndonesian ? "Daftar Langsung (Gratis)" : "Direct Instant Enroll"))}
                  </span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. AUTHENTICATION REQUIRED PROMPT MODAL */}
      {/* ------------------------------------------------------------- */}
      {authPromptCourse && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-150 p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Lock className="h-6 w-6" />
              </div>
              <button
                onClick={() => setAuthPromptCourse(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {isIndonesian ? "Masuk atau Daftar Akun Terlebih Dahulu" : "Sign In Required to Enroll"}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {isIndonesian
                  ? `Untuk mendaftar di program "${authPromptCourse.title}", Anda perlu memiliki akun kandidat agar tiket kehadiran (offline) atau akses link Google Meet / LMS (online) dapat tersimpan di dasbor Anda.`
                  : `To enroll in "${authPromptCourse.title}", please sign in or create a candidate account so your classroom credentials and verified certificates can be issued to your profile.`}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <span className="font-extrabold text-slate-800 block">{authPromptCourse.title}</span>
              <div className="flex items-center justify-between text-slate-500 font-bold text-[11px]">
                <span>{authPromptCourse.provider}</span>
                <span className="text-blue-600">{authPromptCourse.format} Format</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthPromptCourse(null);
                  if (onTabChange) onTabChange("login");
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-colors shadow-sm cursor-pointer"
              >
                {isIndonesian ? "Masuk ke Akun Saya" : "Sign In to My Account"}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setAuthPromptCourse(null);
                  if (onTabChange) onTabChange("register");
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {isIndonesian ? "Buat Akun Kandidat Baru (Gratis)" : "Create New Account (Free)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. CHECKOUT & PAYMENT SIMULATION MODAL (FOR PAID COURSES) */}
      {/* ------------------------------------------------------------- */}
      {checkoutCourse && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-150 p-6 sm:p-8 space-y-6 my-6 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100 uppercase">
                  {isIndonesian ? "Checkout & Pembayaran Aman" : "Secure Checkout"}
                </span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {isIndonesian ? "Konfirmasi Pendaftaran Pelatihan" : "Enrollment & Payment"}
                </h3>
              </div>
              <button
                onClick={() => setCheckoutCourse(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Program Summary Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-slate-900">{checkoutCourse.title}</h4>
                  <p className="text-[11px] text-slate-500 font-bold">{checkoutCourse.provider}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  checkoutCourse.format === "Offline" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                }`}>
                  {checkoutCourse.format}
                </span>
              </div>
              {checkoutCourse.schedule && (
                <p className="text-[11px] text-slate-600 font-medium pt-1 border-t border-slate-200">
                  🗓️ {checkoutCourse.schedule}
                </p>
              )}
            </div>

            {/* Pricing & 10% Platform Share Breakdown */}
            <div className="space-y-2 text-xs bg-slate-50/50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                {isIndonesian ? "Rincian Transaksi Transparan" : "Fee Breakdown"}
              </span>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-slate-600">
                  <span>{isIndonesian ? "Biaya Kursus Mitra (90%):" : "Course Provider (90%):"}</span>
                  <span className="font-bold">Rp {Math.round((checkoutCourse.price ?? 0) * 0.9).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>{isIndonesian ? "Biaya Layanan Platform TalentHub (10%):" : "TalentHub Platform Service (10%):"}</span>
                    <Info className="h-3 w-3 text-slate-400" />
                  </span>
                  <span className="font-bold text-blue-600">Rp {Math.round((checkoutCourse.price ?? 0) * 0.1).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 pt-2 border-t border-slate-200 text-sm">
                  <span>{isIndonesian ? "Total Pembayaran:" : "Total Amount:"}</span>
                  <span className="text-emerald-700">Rp {(checkoutCourse.price ?? 0).toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                {isIndonesian ? "Pilih Metode Pembayaran:" : "Select Payment Method:"}
              </label>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod("qris")}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    selectedPaymentMethod === "qris"
                      ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <QrCode className="h-4 w-4 text-blue-600" />
                  <span>QRIS Instant (Gopay/OVO/BCA)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod("bca_va")}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    selectedPaymentMethod === "bca_va"
                      ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>BCA Virtual Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod("mandiri_va")}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    selectedPaymentMethod === "mandiri_va"
                      ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>Mandiri VA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod("credit_card")}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    selectedPaymentMethod === "credit_card"
                      ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-500/20"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>Kartu Kredit / Debit</span>
                </button>
              </div>

              {/* Payment details preview */}
              {selectedPaymentMethod === "qris" && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                  <div className="h-32 w-32 mx-auto bg-white p-2 rounded-xl border border-slate-300 flex items-center justify-center shadow-xs">
                    <QrCode className="h-24 w-24 text-slate-800" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isIndonesian ? "Pindai kode QRIS di atas menggunakan aplikasi m-Banking atau E-Wallet apa pun." : "Scan QR code with any banking or e-wallet app."}
                  </p>
                </div>
              )}

              {selectedPaymentMethod === "bca_va" && (
                <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-700 block">Nomor Virtual Account BCA:</span>
                    <span className="font-mono font-black text-slate-900 text-sm">8801 2948 5710 3921</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("8801294857103921");
                      setCopiedVa(true);
                      setTimeout(() => setCopiedVa(false), 1500);
                    }}
                    className="px-3 py-1.5 bg-white text-blue-700 rounded-lg font-bold text-xs border border-blue-200 cursor-pointer flex items-center gap-1"
                  >
                    {copiedVa ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedVa ? "Tersalin!" : "Salin"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCheckoutCourse(null)}
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold cursor-pointer transition-colors"
              >
                {isIndonesian ? "Batalkan" : "Cancel"}
              </button>

              <button
                type="button"
                id="confirm-payment-btn"
                disabled={isProcessingPayment}
                onClick={handleProcessPayment}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isIndonesian ? "Memverifikasi Pembayaran..." : "Processing..."}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>{isIndonesian ? "Konfirmasi & Bayar Sekarang" : "Confirm & Pay Now"}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. ENROLLMENT & PAYMENT SUCCESS CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {enrollmentSuccess && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-150 p-6 sm:p-8 space-y-6 my-6 animate-in fade-in zoom-in-95 duration-200 text-center">
            
            <div className="h-16 w-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-md">
              <CheckCircle className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {enrollmentSuccess.isPaid ? (isIndonesian ? "Pembayaran Berhasil & Lunas ✓" : "Payment Confirmed ✓") : (isIndonesian ? "Pendaftaran Berhasil ✓" : "Enrolled Successfully ✓")}
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight pt-1">
                {isIndonesian ? "Selamat! Anda Resmi Terdaftar" : "Congratulations! You're Enrolled"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isIndonesian ? "Rincian kelas dan materi pembelajaran telah disimpan di profil Anda." : "Course details and credentials have been linked to your profile."}
              </p>
            </div>

            {/* Offline Format: E-Ticket Presentation */}
            {enrollmentSuccess.training.format === "Offline" ? (
              <div className="bg-amber-50/80 border-2 border-dashed border-amber-300 rounded-3xl p-5 space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-amber-200 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest block">
                      {isIndonesian ? "E-Tiket Masuk Kelas Tatap Muka" : "Offline Entry E-Ticket"}
                    </span>
                    <span className="font-mono text-xs font-black text-slate-900">{enrollmentSuccess.ticketCode || "TICKET-OFFLINE-98231"}</span>
                  </div>
                  <QrCode className="h-8 w-8 text-amber-900" />
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 block">{enrollmentSuccess.training.title}</span>
                    <span className="text-[11px] text-slate-600 font-medium block">{enrollmentSuccess.training.venueName || "TalentHub Training Center - Menara Cyber 2"}</span>
                    <span className="text-[11px] text-slate-500 font-medium block">{enrollmentSuccess.training.venueRoom || "Auditorium Lantai 15, Lab 3"}</span>
                  </div>

                  {enrollmentSuccess.training.schedule && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-950 pt-1">
                      <Calendar className="h-3.5 w-3.5 text-amber-700" />
                      <span>{enrollmentSuccess.training.schedule}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-amber-200/80">
                    <a
                      href={enrollmentSuccess.training.venueGoogleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(enrollmentSuccess.training.venueAddress || "Menara Cyber 2 Jakarta")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300/80 px-3.5 py-1.5 rounded-xl transition-colors"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{isIndonesian ? "Buka Navigasi Google Maps" : "Directions in Google Maps"}</span>
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* Online Format: Google Meet / Zoom Classroom Presentation */
              <div className="bg-blue-50/80 border border-blue-200 rounded-3xl p-5 space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-widest block">
                      {isIndonesian ? "Akses Ruang Kelas Daring (Online)" : "Online Live Classroom Access"}
                    </span>
                    <span className="font-extrabold text-xs text-slate-900">{enrollmentSuccess.training.onlineMeetingPlatform || "Google Meet"}</span>
                  </div>
                  <Video className="h-6 w-6 text-blue-600" />
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className="font-extrabold text-slate-900">{enrollmentSuccess.training.title}</h4>
                  {enrollmentSuccess.training.schedule && (
                    <p className="text-[11px] text-slate-600 font-medium">🗓️ {enrollmentSuccess.training.schedule}</p>
                  )}
                  <div className="pt-2">
                    <a
                      href={enrollmentSuccess.training.onlineMeetingUrl || "https://meet.google.com/dts-talenthub-2026"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors shadow-xs"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>{isIndonesian ? "Uji Coba Tautan Google Meet / Live" : "Open Live Meeting Link"}</span>
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                id="view-in-dashboard-btn"
                onClick={() => {
                  setEnrollmentSuccess(null);
                  if (onTabChange) {
                    onTabChange("candidate-dashboard");
                  }
                }}
                className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isIndonesian ? "Buka di Dasbor Pelatihan Saya" : "View in My Enrolled Trainings"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setEnrollmentSuccess(null)}
                className="w-full py-2.5 text-xs text-slate-500 font-bold hover:text-slate-800 transition-colors cursor-pointer"
              >
                {isIndonesian ? "Kembali ke Katalog Pelatihan" : "Back to Catalog"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Partner Training Proposal & Outreach Modal */}
      <PartnerProposalModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />

      {/* Candidate Scholarship Application Modal */}
      {scholarshipCourse && (
        <CandidateScholarshipModal
          isOpen={!!scholarshipCourse}
          onClose={() => setScholarshipCourse(null)}
          training={scholarshipCourse}
          candidate={currentUser || {
            id: "cand_1",
            fullName: "Alex Rivera",
            email: "alex.rivera@example.com",
            phone: "+62 811-9876-5432",
            avatar: DEFAULT_PROFILE_IMAGE,
            headline: "Senior Software Engineer"
          }}
          onSubmitApplication={(application) => {
            if (onApplyScholarship) {
              onApplyScholarship(application);
            }
            setScholarshipSubmittedSuccess(application.trainingTitle);
          }}
        />
      )}

      {/* Scholarship Submitted Toast / Banner Modal */}
      {scholarshipSubmittedSuccess && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="h-14 w-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {isIndonesian ? "Pengajuan Beasiswa Berhasil Terkirim!" : "Scholarship Application Submitted!"}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                {isIndonesian
                  ? `Berkas Anda untuk program "${scholarshipSubmittedSuccess}" telah tersimpan dan masuk ke tahap kurasi Tim Seleksi TalentHub & Mitra. Anda dapat memantau status seleksi di dasbor pelatihan Anda.`
                  : `Your submission for "${scholarshipSubmittedSuccess}" is now under review. Track your application status live in your Candidate Dashboard.`}
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setScholarshipSubmittedSuccess(null);
                  if (onTabChange) onTabChange("candidate-dashboard");
                }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black cursor-pointer transition-colors shadow-xs"
              >
                {isIndonesian ? "Pantau di Dasbor Kandidat" : "Track in Candidate Dashboard"}
              </button>
              <button
                type="button"
                onClick={() => setScholarshipSubmittedSuccess(null)}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {isIndonesian ? "Kembali ke Katalog" : "Back to Catalog"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
