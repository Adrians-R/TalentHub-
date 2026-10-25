/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Briefcase, 
  Bell, 
  Menu, 
  X, 
  ChevronDown,
  FileCode,
  LogOut,
  Terminal,
  Globe,
  Check,
  ShieldCheck,
  Users,
  UserCog,
  Activity
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface NavbarProps {
  currentRole: "candidate" | "recruiter" | "admin";
  onRoleChange: (role: "candidate" | "recruiter" | "admin") => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  notificationsCount: number;
  onOpenNotifications: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin?: (role: "candidate" | "recruiter" | "admin") => void;
}

export default function Navbar({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  notificationsCount,
  onOpenNotifications,
  isLoggedIn,
  onLogout,
  onLogin,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const { language, setLanguage, t, isIndonesian } = useLanguage();

  const centerLinks = [
    { id: "landing", label: t("nav_home") },
    ...(isLoggedIn && currentRole === "admin" ? [{ id: "admin-dashboard", label: isIndonesian ? "🛡️ Dasbor Super Admin" : "🛡️ Super Admin Console" }] : []),
    { id: "browse", label: t("nav_browse_talent") },
    { id: "jobs", label: t("nav_jobs") },
    { id: "programs", label: t("nav_programs"), hasDropdown: true },
    // [PAID_FEATURE_TOGGLE] Pricing tab commented out from Navbar for Free Trial. Uncomment below to restore:
    // { id: "pricing", label: t("nav_pricing") },
    { id: "articles", label: t("nav_career_tips") },
    { id: "about", label: t("nav_about") },
  ];

  const programSubpages = [
    { id: "training", label: t("nav_training_bootcamps") },
    { id: "programs-scholarships", label: t("nav_scholarships") },
    { id: "programs-internships", label: t("nav_internships") },
  ];

  const handleLinkClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
    setProgramsDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px] items-center">
          
          {/* LEFT: Logo */}
          <div className="flex items-center shrink-0">
            <div 
              onClick={() => handleLinkClick("landing")} 
              className="flex items-center space-x-2.5 cursor-pointer group"
              id="brand-logo"
            >
              <div className="bg-slate-950 text-white p-2 rounded-xl transition-all group-hover:scale-105">
                <Briefcase className="h-4.5 w-4.5" />
              </div>
              <span className="text-[19px] font-bold tracking-tight text-slate-900 leading-none">
                Talent<span className="text-blue-600 font-semibold">Hub</span>
              </span>
            </div>
          </div>

          {/* CENTER: Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {centerLinks.map((link) => {
              const isActive = activeTab === link.id || 
                (link.id === "programs" && (activeTab === "training" || activeTab.startsWith("programs")));

              if (link.hasDropdown) {
                return (
                  <div key={link.id} className="relative">
                    <button
                      id="nav-programs-dropdown-btn"
                      onClick={() => setProgramsDropdownOpen(!programsDropdownOpen)}
                      className={`flex items-center space-x-1 text-[13px] font-medium transition-colors cursor-pointer ${
                        isActive 
                          ? "text-blue-600 font-semibold" 
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className="h-3 w-3 opacity-70" />
                    </button>

                    {programsDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProgramsDropdownOpen(false)} />
                        <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                          {programSubpages.map((sub) => (
                            <button
                              key={sub.id}
                              id={`nav-sub-${sub.id}`}
                              onClick={() => handleLinkClick(sub.id)}
                              className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                                activeTab === sub.id ? "text-blue-600 bg-blue-50/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                              }`}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={link.id}
                  id={`nav-tab-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-[13px] font-medium transition-colors cursor-pointer ${
                    isActive 
                      ? "text-blue-600 font-semibold" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* RIGHT: Language Selector & Auth CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                id="language-toggle-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 bg-slate-50/80 hover:bg-slate-100 transition-all cursor-pointer"
                title={t("nav_language")}
              >
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span>{language === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setLangDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t("nav_language")}
                    </div>
                    <button
                      id="lang-option-id"
                      onClick={() => {
                        setLanguage("id");
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        language === "id" ? "text-blue-600 bg-blue-50/40" : "text-slate-700"
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>🇮🇩</span>
                        <span>Bahasa Indonesia</span>
                      </span>
                      {language === "id" && <Check className="h-3.5 w-3.5 text-blue-600" />}
                    </button>

                    <button
                      id="lang-option-en"
                      onClick={() => {
                        setLanguage("en");
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        language === "en" ? "text-blue-600 bg-blue-50/40" : "text-slate-700"
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>🇬🇧</span>
                        <span>English</span>
                      </span>
                      {language === "en" && <Check className="h-3.5 w-3.5 text-blue-600" />}
                    </button>
                  </div>
                </>
              )}
            </div>

            {!isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button
                  id="nav-login-btn"
                  onClick={() => onTabChange("login")}
                  className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 py-1.5 cursor-pointer"
                >
                  {t("nav_login")}
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => onTabChange("register")}
                  className="bg-slate-950 text-white hover:bg-slate-800 text-[13px] font-semibold px-4 py-2 rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer"
                >
                  {t("nav_build_profile")}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <button
                  id="bell-notification-btn"
                  onClick={onOpenNotifications}
                  className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  title={t("nav_notifications")}
                >
                  <Bell className="h-4.5 w-4.5" />
                  {notificationsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </button>

                {/* User Dropdown Menu */}
                <div className="relative">
                  <button
                    id="user-menu-dropdown-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 p-1 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {currentRole[0]}
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)} />
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                        
                        <div className="px-4 py-2 border-b border-slate-50 pb-2.5 mb-2">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("nav_signed_in_as")}</div>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-xs font-bold text-slate-800 truncate capitalize">
                              {currentRole === "admin" ? "Super Admin" : `${currentRole} Workspace`}
                            </span>
                            {currentRole === "admin" && (
                              <span className="bg-purple-100 text-purple-700 text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-purple-200">
                                Full Access
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Direct Workspace link */}
                        <button
                          id="nav-user-dashboard-link"
                          onClick={() => {
                            onTabChange(`${currentRole}-dashboard`);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer ${
                            currentRole === "admin" ? "text-purple-700 bg-purple-50/60 hover:bg-purple-100/70" : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {currentRole === "admin" ? (
                            <ShieldCheck className="h-4 w-4 text-purple-600" />
                          ) : (
                            <Briefcase className="h-4 w-4 text-slate-400" />
                          )}
                          <span>{currentRole === "admin" ? (isIndonesian ? "Pusat Kontrol Super Admin" : "Super Admin Console") : t("nav_dashboard")}</span>
                        </button>

                        <div className="border-t border-slate-50 my-2" />

                        {/* Simulation Persona Tools (Deactivated for production-grade authentication) */}
                        {/*
                        <div className="px-4 py-1">
                          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center space-x-1">
                            <Terminal className="h-3 w-3" />
                            <span>{t("nav_simulation_tools")}</span>
                          </div>
                        </div>

                        <div className="px-2 py-1 space-y-0.5">
                          {(["candidate", "recruiter", "admin"] as const).map((role) => (
                            <button
                              key={role}
                              id={`simulate-role-${role}-btn`}
                              onClick={() => {
                                onRoleChange(role);
                                onLogin?.(role);
                                setUserDropdownOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                                currentRole === role ? "text-blue-600 bg-blue-50/40" : "text-slate-600"
                              }`}
                            >
                              <span className="capitalize">
                                {role === "candidate" ? t("nav_candidate_simulator") : role === "recruiter" ? t("nav_recruiter_simulator") : t("nav_admin_simulator")}
                              </span>
                              {currentRole === role && (
                                <Check className="h-3.5 w-3.5 text-blue-600" />
                              )}
                            </button>
                          ))}
                        </div>
                        */}

                        {/* Dev Docs Link */}
                        <button
                          id="dev-docs-gateway-btn"
                          onClick={() => {
                            onTabChange("dev-docs");
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition-colors cursor-pointer"
                        >
                          <FileCode className="h-4 w-4 text-slate-400" />
                          <span>{t("nav_dev_docs")}</span>
                        </button>

                        <div className="border-t border-slate-50 my-2" />

                        {/* Log Out */}
                        <button
                          id="nav-logout-btn"
                          onClick={() => {
                            onLogout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{t("nav_logout")}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* MOBILE controls */}
          <div className="flex items-center lg:hidden space-x-2">
            
            {/* Quick Mobile Language Toggle */}
            <button
              onClick={() => setLanguage(language === "id" ? "en" : "id")}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50"
            >
              {language === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}
            </button>

            {isLoggedIn && (
              <button
                id="mobile-notification-btn"
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-600"
              >
                <Bell className="h-4.5 w-4.5" />
                {notificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 py-4 px-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
              Navigation
            </div>
            {centerLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div key={link.id} className="space-y-1 pl-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase px-2 py-1.5">
                      {t("nav_programs_dropdown")}
                    </div>
                    {programSubpages.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleLinkClick(sub.id)}
                        className={`w-full text-left pl-6 pr-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                          activeTab === sub.id ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                    activeTab === link.id ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Language Selector */}
          <div className="border-t border-slate-100 pt-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">
              {t("nav_language")}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLanguage("id")}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  language === "id" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600"
                }`}
              >
                🇮🇩 Bahasa Indonesia
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  language === "en" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600"
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Simulation Sandbox in mobile (Deactivated for production-grade authentication) */}
          {/*
          {isLoggedIn && (
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                {t("nav_simulation_tools")}
              </div>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-xl">
                {(["candidate", "recruiter", "admin"] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      onLogin?.(role);
                      setMobileMenuOpen(false);
                    }}
                    className={`py-2 rounded-lg text-[10px] font-bold capitalize transition-all text-center ${
                      currentRole === role ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}
          */}

          {/* Mobile Footer CTA */}
          <div className="border-t border-slate-100 pt-4">
            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleLinkClick("login")}
                  className="py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold text-center hover:bg-slate-50 cursor-pointer"
                >
                  {t("nav_login")}
                </button>
                <button
                  onClick={() => handleLinkClick("register")}
                  className="py-2.5 bg-slate-950 text-white rounded-xl text-xs font-semibold text-center hover:bg-slate-800 cursor-pointer"
                >
                  {t("nav_build_profile")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-red-50 text-red-600 hover:text-red-700 text-xs font-semibold rounded-xl text-center flex items-center justify-center space-x-1 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>{t("nav_logout")}</span>
              </button>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}
