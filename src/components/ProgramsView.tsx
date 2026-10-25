/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Award, 
  MapPin, 
  Calendar, 
  Banknote, 
  FileText, 
  Search, 
  ArrowUpRight, 
  Clock, 
  UserCheck, 
  BookOpen, 
  X, 
  ChevronRight, 
  Bookmark, 
  Info,
  Building2,
  Users,
  ShieldCheck,
  GraduationCap
} from "lucide-react";
import { TrainingProgram, Scholarship, Internship } from "../types";
import { MOCK_SCHOLARSHIPS, MOCK_INTERNSHIPS } from "../data/mockData";
import { useLanguage } from "../context/LanguageContext";
import PartnerProposalModal from "./PartnerProposalModal";

interface ProgramsViewProps {
  trainings: TrainingProgram[];
  scholarships?: Scholarship[];
  internships?: Internship[];
  activeTab: string; // "programs-scholarships" or "programs-internships" etc
  onTabChange?: (tab: string) => void;
}

export default function ProgramsView({ 
  trainings, 
  scholarships = MOCK_SCHOLARSHIPS, 
  internships = MOCK_INTERNSHIPS, 
  activeTab, 
  onTabChange 
}: ProgramsViewProps) {
  const { isIndonesian } = useLanguage();
  // Determine initial subtab based on activeTab string
  const getInitialSubTab = () => {
    if (activeTab === "programs-scholarships") return "scholarships";
    if (activeTab === "programs-internships") return "internships";
    return "bootcamps";
  };

  const [subTab, setSubTab] = useState<"bootcamps" | "scholarships" | "internships">(getInitialSubTab() as any);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");

  // Detailed Modal/Drawer state
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<TrainingProgram | null>(null);

  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [appliedItems, setAppliedItems] = useState<string[]>([]);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  // Update subTab when prop activeTab changes
  useEffect(() => {
    if (activeTab === "programs-scholarships") {
      setSubTab("scholarships");
    } else if (activeTab === "programs-internships") {
      setSubTab("internships");
    }
  }, [activeTab]);

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(item => item !== id));
    } else {
      setSavedItems([...savedItems, id]);
    }
  };

  const handleApplyItem = (id: string) => {
    if (!appliedItems.includes(id)) {
      setAppliedItems([...appliedItems, id]);
    }
  };

  // Upcoming programs/events timeline (highly detailed and realistic)
  const upcomingEvents = [
    {
      id: "ev_1",
      date: isIndonesian ? "24 Juli 2026" : "July 24, 2026",
      title: isIndonesian ? "Webinar Informasi Beasiswa Google ASEAN Pioneer" : "Google ASEAN Pioneer Scholarship webinar",
      type: isIndonesian ? "Sesi Informasi" : "Info Session",
      time: "14:00 WIB"
    },
    {
      id: "ev_2",
      date: isIndonesian ? "05 Agustus 2026" : "August 05, 2026",
      title: isIndonesian ? "Batas Akhir Pendaftaran Pelatihan Digital Kominfo" : "Ministry of Communication Application Deadline",
      type: isIndonesian ? "Batas Akhir" : "Deadline",
      time: "23:59 WIB"
    },
    {
      id: "ev_3",
      date: isIndonesian ? "12 Agustus 2026" : "August 12, 2026",
      title: isIndonesian ? "Klinik Tanya Jawab Magang UI/UX & Design Ops" : "Airbnb Design Ops Internship Q&A Clinic",
      type: isIndonesian ? "Lokakarya" : "Workshop",
      time: "10:00 WIB"
    },
    {
      id: "ev_4",
      date: isIndonesian ? "01 September 2026" : "September 01, 2026",
      title: isIndonesian ? "Pengajuan Proposal Hibah Inovasi Digital LPDP" : "Indonesia Digital Innovation LPDP Submission",
      type: isIndonesian ? "Batas Akhir" : "Deadline",
      time: "17:00 WIB"
    }
  ];

  // List of bootcamps (filtered trainings)
  const bootcamps = trainings.filter(t => t.type === "Government" || t.type === "NGO" || t.category === "Coding");

  // Effective list of scholarships and internships
  const activeScholarships = scholarships && scholarships.length > 0 ? scholarships : MOCK_SCHOLARSHIPS;
  const activeInternships = internships && internships.length > 0 ? internships : MOCK_INTERNSHIPS;

  // Filtering Logic based on active subtab
  const filteredBootcamps = bootcamps.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.provider.toLowerCase().includes(searchTerm.toLowerCase()) || b.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || b.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesFormat = formatFilter === "all" || b.format.toLowerCase() === formatFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const filteredScholarships = activeScholarships.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.provider.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || s.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredInternships = activeInternships.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase()) || i.company.toLowerCase().includes(searchTerm.toLowerCase()) || i.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || i.title.toLowerCase().includes(categoryFilter.toLowerCase()) || i.description.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesFormat = formatFilter === "all" || i.type.toLowerCase() === formatFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesFormat;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-200" id="programs-view-root">
      
      {/* 1. HERO SECTION: Clean premium branding */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_50%)]" />
        <div className="max-w-3xl space-y-6 relative z-10">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-xs font-bold text-blue-400 border border-blue-500/20 uppercase tracking-widest">
            <Award className="h-3.5 w-3.5 mr-1" />
            <span>{isIndonesian ? "Program Karier Didanai" : "Funded Career Programs"}</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            {isIndonesian ? "Beasiswa, Magang &" : "Scholarships, Internships &"} <br className="hidden sm:inline" /> 
            {isIndonesian ? "Bootcamp yang Didanai Pemerintah." : "Government-Sponsored Bootcamps."}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            {isIndonesian
              ? "Dapatkan pelatihan berstandar tinggi dan jalur masuk karier yang didanai penuh oleh pemimpin industri, kementerian digital, dan yayasan beasiswa. Daftarkan diri untuk memperoleh sertifikat resmi dan mempercepat penemuan profil oleh tim HR."
              : "Acquire elite training and career entry pathways sponsored entirely by corporate leaders, digital ministries, and foundation grants. Apply directly to unlock validated credentials and fast-track HR discoverability."}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsPartnerModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black tracking-tight shadow-md shadow-blue-600/30 transition-all cursor-pointer hover:scale-[1.02]"
              id="programs-partner-propose-btn"
            >
              <Building2 className="h-4 w-4 text-blue-200" />
              <span>{isIndonesian ? "Ajukan Kemitraan Program Baru" : "Propose New Program"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THREE-TAB INTERFACE & TIMELINE COLLABORATION */}
      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Left 3 columns: Program lists and Search/Filters */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Tabs header & Filter Row */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Category tabs */}
              <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100 space-x-1">
                {[
                  { id: "bootcamps", label: isIndonesian ? "Pelatihan & Bootcamp" : "Training & Bootcamps" },
                  { id: "scholarships", label: isIndonesian ? "Beasiswa & Hibah" : "Scholarships & Grants" },
                  { id: "internships", label: isIndonesian ? "Magang Langsung" : "Direct Internships" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSubTab(t.id as any);
                      if (onTabChange) {
                        onTabChange(t.id === "bootcamps" ? "training" : `programs-${t.id}`);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      subTab === t.id 
                        ? "bg-white text-slate-900 shadow-xs border border-slate-100" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Course counters */}
              <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full uppercase">
                {subTab === "bootcamps" && `${filteredBootcamps.length} ${isIndonesian ? "Bootcamp aktif" : "Bootcamps active"}`}
                {subTab === "scholarships" && `${filteredScholarships.length} ${isIndonesian ? "Beasiswa aktif" : "Scholarships active"}`}
                {subTab === "internships" && `${filteredInternships.length} ${isIndonesian ? "Magang aktif" : "Internships active"}`}
              </span>
            </div>

            {/* Filter controls */}
            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder={isIndonesian ? "Filter kata kunci..." : "Filter by keyword..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-hidden transition-all"
                />
              </div>

              {/* Category filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-100 transition-colors"
              >
                <option value="all">{isIndonesian ? "Semua Bidang" : "All Specialties"}</option>
                <option value="coding">{isIndonesian ? "Pemrograman Software" : "Software Coding"}</option>
                <option value="design">{isIndonesian ? "Desain Produk" : "Product Design"}</option>
                <option value="marketing">{isIndonesian ? "Pemasaran Digital" : "Digital Marketing"}</option>
                <option value="data">{isIndonesian ? "Sains Data" : "Data Science"}</option>
              </select>

              {/* Format Filter (Only shown if applicable to bootcamps/internships) */}
              <select
                value={formatFilter}
                disabled={subTab === "scholarships"}
                onChange={(e) => setFormatFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="all">{isIndonesian ? "Semua Format / Lokasi" : "Any Format / Location"}</option>
                <option value="online">{isIndonesian ? "Daring / Remote" : "Online / Remote"}</option>
                <option value="offline">{isIndonesian ? "Tatap Muka / Kantor" : "Offline / In-person"}</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

          </div>

          {/* List display */}
          <div className="space-y-6">
            
            {/* BOOTCAMPS VIEW */}
            {subTab === "bootcamps" && (
              filteredBootcamps.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-xs font-semibold">
                  {isIndonesian ? "Tidak ada bootcamp aktif yang cocok dengan filter Anda." : "No active bootcamps found matching your filters."}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {filteredBootcamps.map((prog) => {
                    const isSaved = savedItems.includes(prog.id);
                    const isApplied = appliedItems.includes(prog.id);
                    return (
                      <div 
                        key={prog.id}
                        onClick={() => setSelectedTraining(prog)}
                        className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-slate-200 hover:shadow-xs transition-all flex flex-col justify-between group cursor-pointer relative"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                              {prog.type} Bootcamp
                            </span>
                            <button
                              onClick={(e) => handleToggleSave(prog.id, e)}
                              className={`p-1.5 rounded-full border transition-colors ${
                                isSaved ? "bg-amber-500 border-amber-500 text-white" : "bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-800"
                              }`}
                            >
                              <Bookmark className="h-3 w-3 fill-current" />
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <h3 className="font-extrabold text-slate-950 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                              {prog.title}
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400">
                              {isIndonesian ? "Sponsor:" : "Sponsor:"} {prog.provider} • {prog.duration}
                            </p>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                              {prog.description}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-slate-50 mt-5 pt-3 flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {prog.format} Format
                          </span>
                          <button
                            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 ${
                              isApplied ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-150 text-slate-700"
                            }`}
                          >
                            <span>{isApplied ? (isIndonesian ? "Terdaftar ✓" : "Applied ✓") : (isIndonesian ? "Detail" : "Details")}</span>
                            {!isApplied && <ChevronRight className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* SCHOLARSHIPS VIEW */}
            {subTab === "scholarships" && (
              filteredScholarships.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-xs font-semibold">
                  {isIndonesian ? "Tidak ada beasiswa aktif yang cocok dengan filter Anda." : "No active scholarships found matching your filters."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredScholarships.map((sch) => {
                    const isSaved = savedItems.includes(sch.id);
                    const isApplied = appliedItems.includes(sch.id);
                    return (
                      <div 
                        key={sch.id}
                        onClick={() => setSelectedScholarship(sch)}
                        className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-slate-200 hover:shadow-xs transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group cursor-pointer"
                      >
                        <div className="space-y-2.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              {isIndonesian ? "Pendanaan Penuh (Seleksi)" : "Full Funding (Competitive)"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">• {isIndonesian ? "Kategori:" : "Category:"} {sch.category}</span>
                            <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md font-extrabold">
                              {isIndonesian ? `Kuota: ${sch.quota || 50} Kursi` : `Quota: ${sch.quota || 50} Spots`}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-slate-950 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                            {sch.title}
                          </h3>
                          
                          <p className="text-xs text-slate-400 font-bold">
                            {isIndonesian ? "Diselenggarakan oleh:" : "Granted by:"} {sch.provider}
                          </p>
                          
                          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">
                            {sch.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {sch.requirements.slice(0, 2).map((req, idx) => (
                              <span key={idx} className="text-[9px] font-extrabold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                {isIndonesian ? "Syarat:" : "Requirement:"} {req}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex md:flex-col items-end justify-between md:justify-center shrink-0 w-full md:w-auto border-t md:border-t-0 border-slate-50 pt-4 md:pt-0">
                          {/* Desktop: Scholarship Quota & Selection status instead of upfront cost breakdown */}
                          <div className="text-right space-y-1 pb-2.5 hidden md:block">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                              {isIndonesian ? "Kuota Beasiswa" : "Scholarship Quota"}
                            </span>
                            <div className="flex items-center justify-end space-x-1.5 text-xs font-black text-slate-900">
                              <Users className="h-3.5 w-3.5 text-purple-600" />
                              <span>{sch.quota ? `${sch.quota} ${isIndonesian ? "Kursi Terpilih" : "Spots Available"}` : (isIndonesian ? "50 Kursi Terpilih" : "50 Spots Available")}</span>
                            </div>
                            <span className="text-[10px] text-purple-700 font-bold block">
                              {sch.applicantCount 
                                ? `${sch.applicantCount.toLocaleString(isIndonesian ? 'id-ID' : 'en-US')}+ ${isIndonesian ? "Pendaftar • Tahap Seleksi" : "Applicants • In Selection"}`
                                : (isIndonesian ? "1.000+ Pendaftar • Tahap Seleksi" : "1,000+ Applicants • In Selection")}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium block">
                              {isIndonesian ? "*Rincian dana diberikan pasca lolos seleksi" : "*Funding breakdown revealed upon selection"}
                            </span>
                          </div>

                          {/* Mobile: Compact Quota display */}
                          <div className="block md:hidden pb-2 w-full text-left">
                            <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5">
                              <Users className="h-3 w-3 text-purple-600" />
                              <span>
                                {isIndonesian 
                                  ? `Kuota: ${sch.quota || 50} Kursi (${(sch.applicantCount || 1000).toLocaleString('id-ID')}+ Pendaftar • Tahap Seleksi)` 
                                  : `Quota: ${sch.quota || 50} Spots (${(sch.applicantCount || 1000).toLocaleString('en-US')}+ Applicants • In Selection)`}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 w-full md:w-auto">
                            <button
                              onClick={(e) => handleToggleSave(sch.id, e)}
                              className={`p-2.5 rounded-xl border transition-colors ${
                                isSaved ? "bg-amber-500 border-amber-500 text-white" : "bg-slate-50 border-slate-150 text-slate-400 hover:text-slate-700"
                              }`}
                            >
                              <Bookmark className="h-3.5 w-3.5 fill-current" />
                            </button>
                            <button 
                              className={`flex-1 md:flex-initial text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1 justify-center ${
                                isApplied ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-950 text-white hover:bg-slate-800"
                              }`}
                            >
                              <span>{isApplied ? (isIndonesian ? "Terdaftar ✓" : "Applied ✓") : (isIndonesian ? "Tinjau Beasiswa" : "Review Grant")}</span>
                              {!isApplied && <ChevronRight className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* INTERNSHIPS VIEW */}
            {subTab === "internships" && (
              filteredInternships.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-xs font-semibold">
                  {isIndonesian ? "Tidak ada lowongan magang aktif yang cocok dengan filter Anda." : "No active internships found matching your filters."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInternships.map((intern) => {
                    const isSaved = savedItems.includes(intern.id);
                    const isApplied = appliedItems.includes(intern.id);
                    return (
                      <div 
                        key={intern.id}
                        onClick={() => setSelectedInternship(intern)}
                        className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-slate-200 hover:shadow-xs transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group cursor-pointer"
                      >
                        <div className="space-y-2.5 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                              {intern.type} {isIndonesian ? "Magang" : "Internship"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">• {isIndonesian ? "Durasi:" : "Duration:"} {intern.duration}</span>
                          </div>

                          <h3 className="font-extrabold text-slate-950 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                            {intern.title}
                          </h3>
                          
                          <p className="text-xs text-slate-400 font-bold">
                            {isIndonesian ? "Perusahaan:" : "Company:"} {intern.company} • {isIndonesian ? "Lokasi:" : "Location:"} {intern.location}
                          </p>
                          
                          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">
                            {intern.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {intern.requirements.slice(0, 2).map((req, idx) => (
                              <span key={idx} className="text-[9px] font-extrabold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                {isIndonesian ? "Syarat:" : "Required:"} {req}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex md:flex-col items-end justify-between md:justify-center shrink-0 w-full md:w-auto border-t md:border-t-0 border-slate-50 pt-4 md:pt-0">
                          <div className="text-right space-y-0.5 pb-2 hidden md:block">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                              {isIndonesian ? "Uang Saku Bulanan" : "Monthly Stipend"}
                            </span>
                            <span className="text-xs font-black text-slate-900 block">{intern.stipend}</span>
                          </div>

                          <div className="flex items-center space-x-2 w-full md:w-auto">
                            <button
                              onClick={(e) => handleToggleSave(intern.id, e)}
                              className={`p-2.5 rounded-xl border transition-colors ${
                                isSaved ? "bg-amber-500 border-amber-500 text-white" : "bg-slate-50 border-slate-150 text-slate-400 hover:text-slate-700"
                              }`}
                            >
                              <Bookmark className="h-3.5 w-3.5 fill-current" />
                            </button>
                            <button 
                              className={`flex-1 md:flex-initial text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1 justify-center ${
                                isApplied ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-950 text-white hover:bg-slate-800"
                              }`}
                            >
                              <span>{isApplied ? (isIndonesian ? "Terdaftar ✓" : "Applied ✓") : (isIndonesian ? "Tinjau Detail" : "Review Details")}</span>
                              {!isApplied && <ChevronRight className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )
            )}

          </div>

        </div>

        {/* Right 1 column: Upcoming Program Events Timeline */}
        <div className="space-y-6">
          
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4 shadow-3xs">
            <div className="space-y-1">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1 text-slate-500" />
                {isIndonesian ? "Batas Waktu Terdekat" : "Upcoming Deadlines"}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold leading-normal">
                {isIndonesian ? "Jangan lewatkan jadwal webinar informasi dan tanggal batas pendaftaran resmi." : "Do not miss these information webinars and registration cutoff dates."}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {upcomingEvents.map((ev) => (
                <div 
                  key={ev.id}
                  className="bg-white border border-slate-100 p-3.5 rounded-xl space-y-2 relative"
                >
                  <div className="flex justify-between items-center text-[9px] font-extrabold">
                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase border border-blue-100">{ev.type}</span>
                    <span className="text-slate-400">{ev.date}</span>
                  </div>
                  <h4 className="text-[11px] font-extrabold text-slate-900 leading-snug">{ev.title}</h4>
                  <span className="text-[10px] text-slate-400 font-bold block">{ev.time}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-100 flex items-start space-x-2 text-[10px] text-slate-500 font-medium leading-relaxed">
              <Info className="h-4.5 w-4.5 text-blue-500 shrink-0 mt-0.5" />
              <span>{isIndonesian ? "Kandidat terdaftar menerima pemberitahuan otomatis 48 jam sebelum batas waktu resmi." : "Registered candidates receive automated SMS alerts 48 hours before official deadlines."}</span>
            </div>
          </div>

          {/* Quick FAQ info panel */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
            <h4 className="text-[11px] font-extrabold text-slate-900 tracking-tight">
              {isIndonesian ? "Butuh Bantuan?" : "Need Assistance?"}
            </h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-slate-800">
                  {isIndonesian ? "Siapa yang berhak mendaftar?" : "Who is eligible?"}
                </h5>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  {isIndonesian 
                    ? "Sebagian besar bootcamp yang didanai pemerintah & LSM terbuka gratis bagi pemegang paspor/KTP Indonesia bahkan tanpa latar belakang coding sebelumnya."
                    : "Most NGO and Government-sponsored bootcamps are fully funded for ASEAN passport holders with zero coding background."}
                </p>
              </div>
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold text-slate-800">
                  {isIndonesian ? "Apakah sertifikat terverifikasi?" : "Are certificates verified?"}
                </h5>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  {isIndonesian
                    ? "Ya. Setelah menyelesaikan program mitra apa pun, token sertifikat digital diverifikasi oleh instruktur dan langsung disematkan ke profil talenta Anda."
                    : "Yes. Upon completing any partner program, digital certificate tokens are validated by NGO coaches and permanently loaded to your TalentHub vector profile."}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. DETAIL POPUP DRAWER MODALS */}
      
      {/* Scholarship Modal */}
      {selectedScholarship && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {isIndonesian ? "Peluang Beasiswa" : "Scholarship Opportunity"}
                </span>
                <h2 className="text-base md:text-lg font-black text-slate-950 tracking-tight leading-tight pt-1.5">{selectedScholarship.title}</h2>
                <p className="text-xs text-slate-400 font-bold">
                  {isIndonesian ? "Diselenggarakan oleh:" : "Granted by:"} {selectedScholarship.provider}
                </p>
              </div>
              <button 
                onClick={() => setSelectedScholarship(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {isIndonesian ? "Kuota Penerima Beasiswa" : "Scholarship Quota"}
                  </span>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-extrabold text-purple-900 text-sm">
                      {selectedScholarship.quota || 50} {isIndonesian ? "Kursi Terpilih" : "Awardee Spots"}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                    {isIndonesian 
                      ? `${(selectedScholarship.applicantCount || 1000).toLocaleString('id-ID')}+ Pendaftar • Tahap Seleksi` 
                      : `${(selectedScholarship.applicantCount || 1000).toLocaleString('en-US')}+ Applicants • In Review`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {isIndonesian ? "Batas Pendaftaran" : "Apply Deadline"}
                  </span>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <Calendar className="h-4 w-4 text-red-500" />
                    <span className="font-extrabold text-red-600 text-sm">{selectedScholarship.deadline}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                    {isIndonesian ? "Batas akhir submit dokumen" : "Final submission cutoff"}
                  </span>
                </div>
              </div>

              {/* Selection Process Policy Notice */}
              <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-start gap-2.5 text-xs text-purple-950">
                <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-black block text-purple-950">
                    {isIndonesian ? "Kebijakan Seleksi & Penyerahan Rincian Biaya" : "Selection Process & Award Breakdown Policy"}
                  </span>
                  <p className="text-[11px] text-purple-900/90 leading-relaxed">
                    {isIndonesian
                      ? "Rincian alokasi biaya dan fasilitas tidak ditampilkan pada tahap pendaftaran awal. Karena kuota beasiswa sangat terbatas (misal: 50 kursi terpilih untuk ribuan pendaftar), seluruh berkas akan melalui kurasi dan seleksi ketat. Rincian alokasi dana dan surat penetapan beasiswa akan diserahkan resmi hanya kepada kandidat yang dinyatakan lolos seleksi."
                      : "Cost breakdowns and fund allocations are not revealed at this initial stage. Because scholarship quotas are strictly limited, candidates must undergo a screening process. Complete funding breakdowns and official award letters are granted only to selected recipients."}
                  </p>
                </div>
              </div>

              {/* Selection Process Stages */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "Tahapan Seleksi Menuju Penetapan Beasiswa" : "Stages Toward Official Scholarship Award"}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-0.5">
                    <span className="text-[10px] font-black text-slate-900 block">1. Pendaftaran</span>
                    <p className="text-[9px] text-slate-500 font-medium leading-tight">{isIndonesian ? "Submit formulir & profil" : "Submit form & profile"}</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-0.5">
                    <span className="text-[10px] font-black text-slate-900 block">2. Kurasi Dokumen</span>
                    <p className="text-[9px] text-slate-500 font-medium leading-tight">{isIndonesian ? "Uji portofolio & esai" : "Portfolio & essay audit"}</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-0.5">
                    <span className="text-[10px] font-black text-slate-900 block">3. Wawancara</span>
                    <p className="text-[9px] text-slate-500 font-medium leading-tight">{isIndonesian ? "Wawancara komite beasiswa" : "Committee interview"}</p>
                  </div>
                  <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl space-y-0.5">
                    <span className="text-[10px] font-black text-purple-700 block">4. Hasil & Biaya</span>
                    <p className="text-[9px] text-purple-800 font-medium leading-tight">{isIndonesian ? "Rilis dana bagi yang lolos" : "Grant details for awardees"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "Tentang Program Ini" : "About this program"}
                </h4>
                <p className="text-slate-600 font-semibold leading-relaxed">{selectedScholarship.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "Syarat Kelayakan" : "Eligibility Requirements"}
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {selectedScholarship.requirements.map((req, i) => (
                    <li key={i} className="flex items-start text-slate-600 font-medium">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center mr-2 shrink-0 mt-0.5">{i+1}</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setSelectedScholarship(null)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                {isIndonesian ? "Tutup Detail" : "Close details"}
              </button>
              <a 
                href={selectedScholarship.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleApplyItem(selectedScholarship.id)}
                className="flex-1 py-3 bg-slate-950 text-white hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
              >
                <span>{appliedItems.includes(selectedScholarship.id) ? (isIndonesian ? "Terdaftar ✓" : "Applied ✓") : (isIndonesian ? "Daftar ke Mitra Sponsor" : "Apply to Sponsoring Partner")}</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Internship Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {isIndonesian ? "Spesifikasi Magang" : "Internship Specification"}
                </span>
                <h2 className="text-base md:text-lg font-black text-slate-950 tracking-tight leading-tight pt-1.5">{selectedInternship.title}</h2>
                <p className="text-xs text-slate-400 font-bold">
                  {isIndonesian ? "Perusahaan Sponsor:" : "Company Sponsor:"} {selectedInternship.company}
                </p>
              </div>
              <button 
                onClick={() => setSelectedInternship(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {isIndonesian ? "Uang Saku Bulanan" : "Monthly Stipend"}
                  </span>
                  <span className="font-extrabold text-slate-800 block">{selectedInternship.stipend}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {isIndonesian ? "Durasi" : "Duration"}
                  </span>
                  <span className="font-extrabold text-slate-800 block">{selectedInternship.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {isIndonesian ? "Format Kerja" : "Job Format"}
                  </span>
                  <span className="font-extrabold text-blue-600 block">{selectedInternship.type}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "Tentang Perusahaan & Peran" : "About the company & role"}
                </h4>
                <p className="text-slate-600 font-semibold leading-relaxed">{selectedInternship.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "Kualifikasi Kandidat" : "Candidate Prerequisites"}
                </h4>
                <ul className="space-y-1.5 pl-1">
                  {selectedInternship.requirements.map((req, i) => (
                    <li key={i} className="flex items-start text-slate-600 font-medium">
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center mr-2 shrink-0 mt-0.5">{i+1}</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setSelectedInternship(null)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                {isIndonesian ? "Tutup Detail" : "Close details"}
              </button>
              <a 
                href={selectedInternship.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleApplyItem(selectedInternship.id)}
                className="flex-1 py-3 bg-slate-950 text-white hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
              >
                <span>{appliedItems.includes(selectedInternship.id) ? (isIndonesian ? "Terdaftar ✓" : "Applied ✓") : (isIndonesian ? "Daftar Lowongan Magang" : "Apply for Internship")}</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bootcamp/Training Modal */}
      {selectedTraining && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 p-6 md:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {isIndonesian ? "Program Pelatihan Bersponsor" : "Sponsored Training Program"}
                </span>
                <h2 className="text-base md:text-lg font-black text-slate-950 tracking-tight leading-tight pt-1.5">{selectedTraining.title}</h2>
                <p className="text-xs text-slate-400 font-bold">
                  {isIndonesian ? "Penyelenggara:" : "Provider:"} {selectedTraining.provider}
                </p>
              </div>
              <button 
                onClick={() => setSelectedTraining(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {isIndonesian ? "Durasi" : "Duration"}
                  </span>
                  <span className="font-extrabold text-slate-800 block">{selectedTraining.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {isIndonesian ? "Format" : "Format"}
                  </span>
                  <span className="font-extrabold text-slate-800 block">{selectedTraining.format}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {isIndonesian ? "Sertifikasi" : "Certification"}
                  </span>
                  <span className="font-extrabold text-blue-600 block">
                    {selectedTraining.certification ? (isIndonesian ? "Terakreditasi ✓" : "Accredited ✓") : (isIndonesian ? "Audit" : "Audit")}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "Deskripsi Program" : "Program Description"}
                </h4>
                <p className="text-slate-600 font-semibold leading-relaxed">{selectedTraining.description}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "Vektor Keahlian yang Diperoleh" : "Skills Vector Acquired"}
                </span>
                <div className="flex flex-wrap gap-1">
                  <span className="bg-slate-100 border border-slate-200 text-slate-700 font-bold px-2.5 py-0.5 rounded-lg text-[10px]">
                    {selectedTraining.category} Specialist
                  </span>
                  <span className="bg-blue-50 border border-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-lg text-[10px]">
                    {isIndonesian ? "Terakreditasi Industri" : "Industry Vector Accredited"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setSelectedTraining(null)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                {isIndonesian ? "Tutup Detail" : "Close details"}
              </button>
              <a 
                href={selectedTraining.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleApplyItem(selectedTraining.id)}
                className="flex-1 py-3 bg-slate-950 text-white hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
              >
                <span>{appliedItems.includes(selectedTraining.id) ? (isIndonesian ? "Terdaftar ✓" : "Applied ✓") : (isIndonesian ? "Daftar Program" : "Register For Program")}</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Partner Training Proposal & Outreach Modal */}
      <PartnerProposalModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />

    </div>
  );
}
