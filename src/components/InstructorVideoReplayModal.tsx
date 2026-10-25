/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  BookOpen, 
  Download, 
  Github, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Share2,
  FileText,
  ChevronRight,
  ExternalLink,
  Send,
  HelpCircle
} from "lucide-react";
import { EnrolledTraining, LessonRecording, DEFAULT_PROFILE_IMAGE } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface InstructorVideoReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: EnrolledTraining;
}

export default function InstructorVideoReplayModal({
  isOpen,
  onClose,
  training
}: InstructorVideoReplayModalProps) {
  const { isIndonesian } = useLanguage();

  // Generate fallback rich recordings if not provided
  const recordings: LessonRecording[] = (training.recordings && training.recordings.length > 0)
    ? training.recordings
    : [
        {
          id: "rec_1",
          moduleNumber: 1,
          title: isIndonesian ? "Modul 1: Pondasi Arsitektur & Best Practice" : "Module 1: Architectural Foundations & Best Practices",
          duration: "1j 42m",
          instructorName: training.instructorName || "Ir. Hendra Kusuma, M.Kom",
          instructorAvatar: training.instructorAvatar || DEFAULT_PROFILE_IMAGE,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=600",
          summary: isIndonesian 
            ? "Membahas konsep fundamental arsitektur sistem, struktur modular TypeScript, dan strategi penanganan error di level produksi."
            : "Explores core architectural principles, modular TypeScript patterns, and production-grade error management.",
          keyTimestamps: [
            { time: "00:00", label: isIndonesian ? "Pengantar & Sasaran Kompetensi" : "Introduction & Objectives" },
            { time: "18:40", label: isIndonesian ? "Live Coding: Type Narrowing & Generics" : "Live Coding: Type Narrowing & Generics" },
            { time: "42:15", label: isIndonesian ? "Studi Kasus: Optimalisasi Query Data" : "Case Study: Query Optimization" },
            { time: "1:15:00", label: isIndonesian ? "Tanya Jawab & Debugging Bersama Peserta" : "Interactive Q&A & Live Debugging" }
          ],
          slidesUrl: "#slides-mod-1",
          codeRepoUrl: "https://github.com/talenthub/module-1-starter"
        },
        {
          id: "rec_2",
          moduleNumber: 2,
          title: isIndonesian ? "Modul 2: Backend API & Manajemen Database Relasional" : "Module 2: Backend API & Relational Database Management",
          duration: "2j 08m",
          instructorName: training.instructorName || "Ir. Hendra Kusuma, M.Kom",
          instructorAvatar: training.instructorAvatar || DEFAULT_PROFILE_IMAGE,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
          summary: isIndonesian
            ? "Mendalami perancangan skema PostgreSQL, integrasi ORM, endpoint RESTful yang aman, dan mekanisme autentikasi JWT."
            : "Deep dive into PostgreSQL schema design, ORM integration, secure RESTful endpoints, and JWT authentication.",
          keyTimestamps: [
            { time: "00:00", label: isIndonesian ? "Review Arsitektur Database" : "Database Architecture Review" },
            { time: "25:30", label: isIndonesian ? "Implementasi Middleware Express & CORS" : "Express Middleware & CORS Implementation" },
            { time: "58:10", label: isIndonesian ? "Penerapan Connection Pooling & Migrasi" : "Connection Pooling & Migrations" },
            { time: "1:35:00", label: isIndonesian ? "Diskusi Tantangan Proyek Peserta" : "Student Project Review & Q&A" }
          ],
          slidesUrl: "#slides-mod-2",
          codeRepoUrl: "https://github.com/talenthub/module-2-backend"
        },
        {
          id: "rec_3",
          moduleNumber: 3,
          title: isIndonesian ? "Modul 3: Optimasi UI & Integrasi API Skala Besar" : "Module 3: UI Optimization & High-Scale API Integration",
          duration: "1j 55m",
          instructorName: training.instructorName || "Ir. Hendra Kusuma, M.Kom",
          instructorAvatar: training.instructorAvatar || DEFAULT_PROFILE_IMAGE,
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          thumbnailUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600",
          summary: isIndonesian
            ? "Membangun tampilan responsif dengan React 19, pengelolaan caching sisi klien, dan rendering komponen tanpa lag."
            : "Building fluid React 19 UIs, client-side caching strategies, and zero-lag rendering optimizations.",
          keyTimestamps: [
            { time: "00:00", label: isIndonesian ? "Prinsip Performa Frontend" : "Frontend Performance Fundamentals" },
            { time: "30:00", label: isIndonesian ? "Membangun Komponen State Dinamis" : "Dynamic State Component Architecture" },
            { time: "1:10:00", label: isIndonesian ? "Simulasi Pengujian Beban & Lighthouse" : "Lighthouse Audit & Stress Testing" }
          ],
          slidesUrl: "#slides-mod-3",
          codeRepoUrl: "https://github.com/talenthub/module-3-frontend"
        }
      ];

  const [activeRecordingId, setActiveRecordingId] = useState<string>(recordings[0]?.id || "");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(320); // 5m 20s
  const [totalDurationSec] = useState<number>(6120); // 1h 42m
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"chapters" | "notes" | "qa">("chapters");
  const [userQuestion, setUserQuestion] = useState("");
  const [submittedQuestions, setSubmittedQuestions] = useState<Array<{ text: string; time: string; answer?: string }>>([
    {
      text: isIndonesian ? "Apakah struktur database PostgreSQL ini bisa langsung di-deploy ke Cloud SQL tanpa ubah driver?" : "Can this PostgreSQL setup deploy to Cloud SQL without driver changes?",
      time: isIndonesian ? "Kemarin" : "Yesterday",
      answer: isIndonesian ? "Ya, tentu saja! Karena kita menggunakan pooling connection standar PostgreSQL." : "Yes absolutely, because standard PostgreSQL connection pooling is used."
    }
  ]);

  if (!isOpen) return null;

  const currentRec = recordings.find(r => r.id === activeRecordingId) || recordings[0];

  const formatSec = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSeek = (timeStr: string) => {
    const parts = timeStr.split(":");
    let sec = 0;
    if (parts.length === 2) {
      sec = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 3) {
      sec = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    }
    setCurrentTimeSec(sec);
    setIsPlaying(true);
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    setSubmittedQuestions([
      ...submittedQuestions,
      {
        text: userQuestion.trim(),
        time: isIndonesian ? "Baru saja" : "Just now",
        answer: isIndonesian ? "Pertanyaan Anda telah diteruskan ke instuktur. Jawaban akan muncul di sini." : "Your question was submitted to the instructor and will appear shortly."
      }
    ]);
    setUserQuestion("");
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl max-w-5xl w-full p-4 sm:p-6 space-y-4 my-auto overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Play className="h-5 w-5 fill-current" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded">
                  {isIndonesian ? "Rekaman Video Sesi Instruktur" : "Instructor Replay Session"}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold truncate">
                  {training.trainingTitle}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white truncate mt-0.5">
                {currentRec.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content Layout (Video Player on left, Playlist & Tabs on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Left 2 Cols: Player & Session Meta */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Video Player Display Container */}
            <div className="relative bg-black rounded-2xl overflow-hidden border border-slate-800 aspect-video flex flex-col justify-between group shadow-lg">
              
              {/* Video Thumbnail / Screen */}
              <div className="absolute inset-0">
                <img
                  src={currentRec.thumbnailUrl}
                  alt={currentRec.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/60" />
              </div>

              {/* Watermark / Badge Top */}
              <div className="relative z-10 p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50">
                  <img
                    src={currentRec.instructorAvatar}
                    alt={currentRec.instructorName}
                    className="h-6 w-6 rounded-full object-cover border border-blue-400"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-[11px]">
                    <span className="font-extrabold text-white block leading-tight">{currentRec.instructorName}</span>
                    <span className="text-[9px] text-blue-300 font-medium">{isIndonesian ? "Instruktur Terverifikasi" : "Verified Instructor"}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold bg-black/60 text-slate-300 px-2 py-1 rounded">
                  HD 1080p • {currentRec.duration}
                </span>
              </div>

              {/* Big Center Play/Pause Overlay */}
              <div className="relative z-10 my-auto flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-14 w-14 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 fill-current" />
                  ) : (
                    <Play className="h-6 w-6 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              {/* Bottom Custom Video Controls */}
              <div className="relative z-10 p-3 space-y-2 bg-gradient-to-t from-black via-black/80 to-transparent">
                {/* Scrubber Progress Bar */}
                <div 
                  className="w-full bg-slate-700/80 hover:bg-slate-600 h-1.5 rounded-full cursor-pointer relative overflow-hidden"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    setCurrentTimeSec(Math.floor(pos * totalDurationSec));
                  }}
                >
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${(currentTimeSec / totalDurationSec) * 100}%` }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>

                    <button 
                      onClick={() => setCurrentTimeSec(Math.max(0, currentTimeSec - 10))}
                      className="hover:text-white transition-colors cursor-pointer text-[11px] flex items-center gap-0.5"
                      title={isIndonesian ? "Mundur 10 detik" : "Rewind 10s"}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>-10s</span>
                    </button>

                    <button 
                      onClick={() => setCurrentTimeSec(Math.min(totalDurationSec, currentTimeSec + 10))}
                      className="hover:text-white transition-colors cursor-pointer text-[11px] flex items-center gap-0.5"
                      title={isIndonesian ? "Maju 10 detik" : "Forward 10s"}
                    >
                      <FastForward className="h-3.5 w-3.5" />
                      <span>+10s</span>
                    </button>

                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4" />}
                    </button>

                    <span className="font-mono text-[11px] text-slate-400">
                      {formatSec(currentTimeSec)} / {formatSec(totalDurationSec)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Speed Selector */}
                    <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-[10px] font-bold font-mono">
                      {[1, 1.25, 1.5, 2].map(spd => (
                        <button
                          key={spd}
                          onClick={() => setPlaybackRate(spd)}
                          className={`px-1.5 py-0.5 rounded cursor-pointer ${
                            playbackRate === spd ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>

                    <button 
                      className="p-1 hover:text-white transition-colors cursor-pointer"
                      title="Fullscreen"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Summary & Resource Downloads */}
            <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <div>
                  <h4 className="font-bold text-white text-xs">{isIndonesian ? "Rangkuman Materi Sesi Ini" : "Session Summary"}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{currentRec.summary}</p>
                </div>
              </div>

              {/* Download Assets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={currentRec.slidesUrl || "#"}
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-[11px] font-bold border border-slate-600/60 transition-colors cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-blue-400" />
                  <span>{isIndonesian ? "Unduh Slide PDF Instruktur" : "Download Instructor Slides"}</span>
                </a>

                {currentRec.codeRepoUrl && (
                  <a
                    href={currentRec.codeRepoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-[11px] font-bold border border-slate-600/60 transition-colors cursor-pointer"
                  >
                    <Github className="h-3.5 w-3.5 text-purple-400" />
                    <span>{isIndonesian ? "Repositori Kode Sumber" : "Source Code Repository"}</span>
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Right 1 Col: Playlist & Interaction Tabs */}
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            
            {/* Tab Navigation */}
            <div>
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 mb-3">
                {[
                  { id: "chapters", label: isIndonesian ? "Bab & Sesi" : "Chapters" },
                  { id: "qa", label: isIndonesian ? "Tanya Instruktur" : "Ask Q&A" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeTab === t.id
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Chapters & Playlist */}
              {activeTab === "chapters" && (
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  
                  {/* Playlist selector */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                      {isIndonesian ? "Daftar Rekaman Sesi:" : "Recordings Playlist:"}
                    </span>
                    {recordings.map((rec) => (
                      <button
                        key={rec.id}
                        onClick={() => {
                          setActiveRecordingId(rec.id);
                          setCurrentTimeSec(0);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                          activeRecordingId === rec.id
                            ? "bg-blue-600/20 border-blue-500 text-white"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80"
                        }`}
                      >
                        <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          activeRecordingId === rec.id ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
                        }`}>
                          {rec.moduleNumber}
                        </div>
                        <div className="overflow-hidden flex-1">
                          <span className="font-extrabold text-xs block truncate">{rec.title}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            <span>{rec.duration}</span>
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Chapter Timestamps */}
                  {currentRec.keyTimestamps && currentRec.keyTimestamps.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                        {isIndonesian ? "Navigasi Bab / Topik:" : "Chapter Bookmarks:"}
                      </span>
                      <div className="space-y-1">
                        {currentRec.keyTimestamps.map((ts, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSeek(ts.time)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-900/40 hover:bg-blue-600/20 text-slate-300 hover:text-white border border-slate-800/60 flex items-center justify-between text-xs transition-colors cursor-pointer"
                          >
                            <span className="truncate pr-2 font-medium">{ts.label}</span>
                            <span className="font-mono text-[10px] text-blue-400 font-bold shrink-0">{ts.time}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* Tab 2: Q&A */}
              {activeTab === "qa" && (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  <div className="space-y-2">
                    {submittedQuestions.map((q, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="font-bold text-slate-300">{isIndonesian ? "Pertanyaan Anda" : "Your Question"}</span>
                          <span>{q.time}</span>
                        </div>
                        <p className="text-slate-200 font-medium">{q.text}</p>
                        {q.answer && (
                          <div className="mt-2 p-2 rounded-lg bg-blue-950/40 border border-blue-900/50 text-[11px] text-blue-200">
                            <span className="font-bold block text-blue-400">{isIndonesian ? "Jawaban Instruktur:" : "Instructor Reply:"}</span>
                            <span>{q.answer}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handlePostQuestion} className="pt-2">
                    <textarea
                      rows={2}
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      placeholder={isIndonesian ? "Tanyakan hal yang belum jelas dari video ini..." : "Ask the instructor a question..."}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="mt-1.5 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isIndonesian ? "Kirim Pertanyaan" : "Post Question"}</span>
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* Bottom Note */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isIndonesian ? "Akses rekaman seumur hidup" : "Lifetime replay access"}</span>
              </span>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                {isIndonesian ? "Tutup" : "Close"}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
