/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, 
  Clock, 
  Heart, 
  Share2, 
  ArrowUpRight, 
  ChevronRight, 
  Send, 
  CheckCircle, 
  Flame, 
  Percent, 
  FileCheck, 
  MessageSquareCode,
  Banknote
} from "lucide-react";
import { CareerArticle } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface CareerArticlesViewProps {
  articles: CareerArticle[];
  onTabChange?: (tab: string) => void;
}

export default function CareerArticlesView({ articles, onTabChange }: CareerArticlesViewProps) {
  const { isIndonesian, formatCurrency } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [articleLikes, setArticleLikes] = useState<Record<string, number>>({});
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Resume Score Calculator State
  const [wordCount, setWordCount] = useState<"short" | "normal" | "long">("normal");
  const [hasPortfolio, setHasPortfolio] = useState(true);
  const [skillsListed, setSkillsListed] = useState("7");
  const [resumeScore, setResumeScore] = useState<number | null>(null);
  const [resumeTips, setResumeTips] = useState<string[]>([]);

  // Salary Negotiator State
  const [negotiatorRole, setNegotiatorRole] = useState("Senior Frontend Engineer");
  const [negotiatorExp, setNegotiatorExp] = useState("mid");
  const [targetSalary, setTargetSalary] = useState("25.000.000");
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const categories = [
    { id: "all", label: isIndonesian ? "Semua Artikel Panduan" : "All Handbook Articles" },
    { id: "tips", label: isIndonesian ? "Strategi Rekrutmen Terbalik" : "Reversed Strategy" },
    { id: "interview", label: isIndonesian ? "Persiapan Wawancara" : "Interview Preparation" },
    { id: "resume", label: isIndonesian ? "Tips Resume & CV" : "Resume & CV Tips" },
    { id: "portfolio", label: isIndonesian ? "Desain Portofolio" : "Portfolio Design" },
    { id: "salary", label: isIndonesian ? "Negosiasi Gaji" : "Salary Negotiation" },
  ];

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticleLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail("");
      }, 3000);
    }
  };

  // Interactive Tools Logics
  const handleCalculateResumeScore = () => {
    let score = 65; // Base score
    const tips: string[] = [];

    if (wordCount === "normal") {
      score += 15;
    } else {
      tips.push(isIndonesian 
        ? "CV Anda terlalu pendek atau terlalu panjang. Jaga isi di bawah 1-2 halaman ringkas." 
        : "Your CV is too compact or bloated. Keep content under 1-2 concise pages maximum.");
    }

    if (hasPortfolio) {
      score += 15;
    } else {
      tips.push(isIndonesian 
        ? "Tautan portofolio belum ada. Perekrut di TalentHub membutuhkan URL proyek yang berfungsi." 
        : "Missing portfolio link. Recruiters on TalentHub require verified URLs showing working builds.");
    }

    const skillsCount = parseInt(skillsListed) || 0;
    if (skillsCount >= 5 && skillsCount <= 10) {
      score += 10;
    } else if (skillsCount > 10) {
      score += 5;
      tips.push(isIndonesian 
        ? "Terlalu banyak keahlian umum dapat mengurangi fokus profil. Prioritaskan 6 keahlian terkuat Anda." 
        : "Too many general keywords can dilute your profile. Prioritize your 6 strongest, verified vectors.");
    } else {
      tips.push(isIndonesian 
        ? "Tambahkan minimal 5 lencana keahlian untuk memicu pencarian database recruiter." 
        : "Add at least 5 structured skill badges to trigger database searches.");
    }

    setResumeScore(Math.min(score, 100));
    setResumeTips(tips.length > 0 ? tips : [
      isIndonesian 
        ? "Resume Anda memenuhi kriteria keterlihatan tertinggi kami. Anda siap dihubungi recruiter!" 
        : "Your resume matches our highest-contrast discoverability vector criteria. You are fully ready!"
    ]);
  };

  const handleGenerateNegotiationScript = () => {
    const yearsText = negotiatorExp === "junior" ? "3+" : negotiatorExp === "mid" ? "5+" : "8+";
    const template = isIndonesian 
      ? `Halo Tim Rekrutmen / Talent Acquisition,

Terima kasih atas Undangan Sourcing langsung terkait posisi ${negotiatorRole}. Saya sangat antusias dengan roadmap teknologi dan produk tim Anda.

Berdasarkan pengalaman ${yearsText} tahun saya dalam pengembangan aplikasi skala produksi dan portofolio terverifikasi di TalentHub, ekspektasi kompensasi yang saya targetkan berada di kisaran Rp ${targetSalary} / bulan, sepadan dengan dampak dan kontribusi langsung yang dapat saya berikan.

Apakah kisaran tersebut sesuai dengan parameter anggaran yang dialokasikan oleh tim Anda untuk posisi ini? Saya akan sangat senang menjadwalkan sesi diskusi lanjutan.

Salam hangat,
[Nama Anda]`
      : `Hello Sourcing Director,

Thank you for sending this direct Sourcing Invitation regarding the ${negotiatorRole} position. I am highly excited by your team's cloud scale roadmap.

Based on my ${yearsText} years of active production operation and my verified portfolio metrics on TalentHub, I am targeting a base bracket in the range of Rp ${targetSalary} / month, commensurate with the level of impact and immediate contribution I will deliver.

Could you please confirm if this matches your team's allocated budget parameters for this workspace? I would love to schedule a discovery chat.

Best regards,
[Your Name]`;
    
    setGeneratedScript(template);
  };

  // Additional mock articles to satisfy the MVP requirements and ensure "No blank pages"
  const handbookArticles: CareerArticle[] = [
    ...articles,
    {
      id: "art_3",
      title: isIndonesian ? "Arsitektur Portofolio: Mendesain Studi Kasus yang Menjual Diri Sendiri" : "The Portfolio Architecture: Design Case Studies that Hire Themselves",
      category: "Portfolio",
      author: "Elena Rostova (TechCorp)",
      date: "2026-07-08",
      readTime: isIndonesian ? "7 mnt baca" : "7 min read",
      excerpt: isIndonesian ? "Perekrut tidak hanya membaca source code—mereka ingin melihat produk nyata berjalan. Pelajari cara menyajikan proyek Next.js Anda sebagai studi kasus visual yang kaya metrik dan arsitektur sistem." : "Recruiters don't read source code—they watch products work. Learn how to present your Next.js projects as rich visual case studies showing bottlenecks, metrics, and systems design.",
      content: "",
      imageUrl: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&q=80&w=400",
      likes: 156
    },
    {
      id: "art_4",
      title: isIndonesian ? "Anchoring Taktis: Menegosiasikan Kompensasi dalam Rekrutmen Terbalik" : "Tactical Anchoring: Negotiating Compensation in a Reversed Funnel",
      category: "Salary",
      author: "Budi Santoso (GoVentures)",
      date: "2026-07-12",
      readTime: isIndonesian ? "6 mnt baca" : "6 min read",
      excerpt: isIndonesian ? "Ketika perekrut yang pertama kali menghubungi Anda, Anda memiliki daya tawar langsung. Kuasai seni anchoring kisaran gaji tanpa mengorbankan peluang dengan mitra korporat." : "When recruiters pitch to you first, you hold immediate tactical leverage. Master the art of budget anchoring without scaring away elite corporate partners.",
      content: "",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
      likes: 213
    }
  ];

  const filteredArticles = handbookArticles.filter(art => {
    const matchesCategory = selectedCategory === "all" || art.category.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(art.category.toLowerCase());
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || art.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-16" id="career-tips-container">
      
      {/* 1. HERO SECTION: Content-focused display branding */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-[11px] font-extrabold text-blue-700 border border-blue-100 uppercase tracking-wider">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{isIndonesian ? "Buku Panduan Rekrutmen Terbalik" : "The Reversed Recruitment Handbook"}</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {isIndonesian ? (
            <>
              Berhenti Mengirim Resume. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Biarkan Perusahaan Menghubungi Anda.</span>
            </>
          ) : (
            <>
              Stop Sending Resumes. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Start Sourcing Conversations.</span>
            </>
          )}
        </h1>
        <p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          {isIndonesian 
            ? "Pelajari strategi dari para ahli mengenai tata letak portofolio modern, video perkenalan STAR-method, dan lencana sertifikasi digital untuk menjadikan profil Anda dicari oleh para perekrut teratas." 
            : "Read expert strategies detailing modern portfolio layouts, star-method introductory videos, and digital badge credential loops to turn yourself into a high-visibility candidate vector."}
        </p>
      </div>

      {/* 2. INTERACTIVE TOOLS CONTAINER (Two-Column Bento Grid) */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center">
            <Flame className="h-5 w-5 text-amber-500 mr-2" />
            {isIndonesian ? "Alat Akselerator Karier Kandidat" : "Candidate Accelerator Widgets"}
          </h2>
          <p className="text-xs text-slate-400 font-bold">
            {isIndonesian ? "Toolkit simulasi interaktif yang dirancang oleh konsultan HR TalentHub" : "Interactive simulation toolkits built by TalentHub HR advisors"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Tool A: Resume Discoverability / ATS Calculator */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs hover:border-slate-200 transition-all space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {isIndonesian ? "Kalkulator Keterlihatan & Skor ATS" : "Discoverability Vector Calculator"}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold">
                    {isIndonesian ? "Perkirakan tingkat keterlihatan profil Anda di pencarian rekruter" : "Estimate your database discoverability rating"}
                  </p>
                </div>
              </div>

              {/* Form elements */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isIndonesian ? "Panjang & Konten CV" : "CV Content/Length"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "short", label: isIndonesian ? "Pendek (< 1 hlm)" : "Short (< 1 pg)" },
                      { id: "normal", label: isIndonesian ? "Ideal (1-2 hlm)" : "Target (1-2 pgs)" },
                      { id: "long", label: isIndonesian ? "Panjang (3+ hlm)" : "Long (3+ pgs)" },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setWordCount(opt.id as any)}
                        className={`py-2 rounded-lg text-[11px] font-bold border transition-all text-center ${
                          wordCount === opt.id 
                            ? "bg-slate-900 text-white border-slate-900" 
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isIndonesian ? "Memiliki URL Portofolio Aktif?" : "Has Active Portfolio URL?"}
                  </span>
                  <button 
                    onClick={() => setHasPortfolio(!hasPortfolio)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                      hasPortfolio 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    {hasPortfolio 
                      ? (isIndonesian ? "Ya, Tautan Aktif" : "Yes, Working Link") 
                      : (isIndonesian ? "Belum Ada Tautan" : "No Portfolio Link")}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {isIndonesian ? "Jumlah Keahlian Spesifik Terdaftar" : "Specific Skills Listed on Profile"}
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    value={skillsListed}
                    onChange={(e) => setSkillsListed(e.target.value)}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-0.5">
                    <span>1 {isIndonesian ? "keahlian" : "skill badge"}</span>
                    <span className="text-blue-600 font-extrabold">{skillsListed} {isIndonesian ? "keahlian" : "skill badges"}</span>
                    <span>15 {isIndonesian ? "keahlian" : "badges"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score output & Action */}
            <div className="space-y-4 pt-4 border-t border-slate-50">
              {resumeScore !== null && (
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-800">
                      {isIndonesian ? "Peringkat Skor ATS Anda:" : "Your ATS Vector Rating:"}
                    </span>
                    <span className="text-xl font-black text-blue-600">{resumeScore}%</span>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block">
                      {isIndonesian ? "Rekomendasi Optimalisasi:" : "Recommendations:"}
                    </span>
                    <ul className="text-[11px] text-slate-600 font-semibold space-y-1 pl-1">
                      {resumeTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-1.5 text-blue-500">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <button 
                onClick={handleCalculateResumeScore}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer text-center"
              >
                {isIndonesian ? "Hitung Skor Keterlihatan CV" : "Calculate Discoverability Vector Score"}
              </button>
            </div>
          </div>

          {/* Tool B: Salary Anchoring Script Generator */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs hover:border-slate-200 transition-all space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <MessageSquareCode className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {isIndonesian ? "Pembuat Skrip Negosiasi Gaji" : "Compensation Anchoring Pitch Builder"}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold">
                    {isIndonesian ? "Buat template pesan profesional untuk menjawab tawaran perekrut" : "Generate professional template scripts for recruiter intros"}
                  </p>
                </div>
              </div>

              {/* Form elements */}
              <div className="space-y-3.5 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isIndonesian ? "Posisi / Peran Target" : "Target Role Title"}
                    </label>
                    <input 
                      type="text" 
                      value={negotiatorRole}
                      onChange={(e) => setNegotiatorRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isIndonesian ? "Target Gaji (IDR/Bulan)" : "Target Base Salary (IDR/Month)"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        Rp
                      </span>
                      <input 
                        type="text" 
                        value={targetSalary}
                        onChange={(e) => setTargetSalary(e.target.value)}
                        className="w-full pl-8 pr-3 bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isIndonesian ? "Tingkat Pengalaman" : "Relevant Vector Experience"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "junior", label: isIndonesian ? "Junior (1-3 thn)" : "Entry (1-3 yrs)" },
                      { id: "mid", label: isIndonesian ? "Menengah (4-6 thn)" : "Mid (4-6 yrs)" },
                      { id: "senior", label: isIndonesian ? "Senior (7+ thn)" : "Senior (7+ yrs)" },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setNegotiatorExp(opt.id)}
                        className={`py-2 rounded-lg text-[10px] font-bold border transition-all text-center ${
                          negotiatorExp === opt.id 
                            ? "bg-slate-900 text-white border-slate-900" 
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Script output & Action */}
            <div className="space-y-4 pt-4 border-t border-slate-50">
              {generatedScript && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isIndonesian ? "Skrip Balasan Siap Salin:" : "Bespoke Pitch script (Copy ready):"}
                  </span>
                  <textarea 
                    readOnly 
                    value={generatedScript}
                    rows={6}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] font-mono font-medium text-slate-700 leading-normal focus:outline-hidden"
                  />
                </div>
              )}

              <button 
                onClick={handleGenerateNegotiationScript}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer text-center"
              >
                {isIndonesian ? "Buat Skrip Negosiasi Gaji" : "Build Anchoring Pitch Script"}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. ARTICLES DIRECTORY: Searching and categorized lists */}
      <div className="space-y-8">
        
        {/* Row header with category filters */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {isIndonesian ? "Publikasi Strategi & Tips Sourcing" : "Sourcing & Strategy Publications"}
            </h2>
            <p className="text-xs text-slate-400 font-bold">
              {isIndonesian ? "Strategi terpercaya yang ditulis langsung oleh pemimpin rekrutmen dan career coach terkemuka" : "Unfiltered strategies written directly by vetted recruitment leaders and NGO career coaches"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full xl:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <input 
                type="text"
                placeholder={isIndonesian ? "Cari artikel panduan..." : "Search publications..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 outline-none focus:bg-white"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat.id 
                      ? "bg-slate-900 text-white shadow-2xs" 
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Publications Grid */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-150 py-16 text-center text-slate-400 text-xs font-semibold">
            {isIndonesian ? "Tidak ada publikasi yang cocok dengan kata kunci pencarian Anda." : "No active publications found matching your search term."}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredArticles.map((art) => {
              const currentLikes = (art.likes) + (articleLikes[art.id] || 0);

              return (
                <div 
                  key={art.id} 
                  id={`article-card-${art.id}`}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row"
                >
                  {/* Thumbnail */}
                  <div className="md:w-2/5 h-48 md:h-auto relative shrink-0 bg-slate-100">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-white/95 text-slate-800 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase shadow-xs border border-slate-50">
                      {art.category}
                    </span>
                  </div>

                  {/* Content info */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold">
                        <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {art.readTime}</span>
                        <span>•</span>
                        <span>{art.date}</span>
                      </div>
                      
                      <h3 className="font-extrabold text-slate-950 text-sm leading-snug hover:text-blue-600 transition-colors line-clamp-2">
                        {art.title}
                      </h3>
                      
                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-3.5">
                      <span className="text-[10px] text-slate-400 font-bold truncate max-w-[120px]">
                        {isIndonesian ? "Oleh:" : "By:"} {art.author}
                      </span>
                      
                      <div className="flex items-center space-x-3 shrink-0">
                        <button
                          onClick={(e) => handleLike(art.id, e)}
                          className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Heart className={`h-3.5 w-3.5 ${articleLikes[art.id] ? "fill-red-500 text-red-500" : ""}`} />
                          <span>{currentLikes}</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            // Display complete text or message
                          }}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-0.5 cursor-pointer"
                        >
                          <span>{isIndonesian ? "Baca" : "Read"}</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 4. PREMIUM NEWSLETTER BLOCK */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-3xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/5 rounded-full filter blur-xl" />
        
        <div className="space-y-3 max-w-lg relative z-10">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {isIndonesian ? "Dapatkan Taktik Rekrutmen Terbalik Setiap Minggu" : "Acquire Weekly Reversed Sourcing Tactics"}
          </h2>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            {isIndonesian 
              ? "Setiap Selasa, terima 1 strategi aplikatif yang memandu cara kandidat terbaik menyusun portofolio, menetapkan kisaran gaji, dan menuntaskan wawancara dengan sukses." 
              : "Every Tuesday, receive 1 actionable strategy highlighting how top candidates configure their profiles, set pricing bounds, and manage initial interview sourcing rounds successfully."}
          </p>
        </div>

        <div className="w-full md:w-80 shrink-0 relative z-10">
          {newsletterSubscribed ? (
            <div className="bg-emerald-50 border border-emerald-150 p-4 rounded-xl flex items-center space-x-2 text-emerald-700 text-xs font-bold animate-in fade-in duration-200">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span>{isIndonesian ? "Langganan Panduan Berhasil Dikonfirmasi ✓" : "Handbook Subscription Confirmed ✓"}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribeNewsletter} className="flex gap-2">
              <input 
                type="email"
                required
                placeholder={isIndonesian ? "Masukkan alamat email..." : "Enter email address..."}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400"
              />
              <button 
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
