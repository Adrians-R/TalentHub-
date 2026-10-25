/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Database, GitFork, ShieldAlert, Key, Link, Grid, FileCode } from "lucide-react";

export default function DatabaseSchemaView() {
  const [activeTable, setActiveTable] = useState<string>("candidates");

  const tables = [
    {
      id: "candidates",
      name: "candidates",
      description: "Core table containing professional seek criteria and validation scores.",
      columns: [
        { name: "id", type: "VARCHAR(36)", key: "PRIMARY KEY", nullable: "NO", default: "UUID()", notes: "Unique identifier for candidate profiles" },
        { name: "full_name", type: "VARCHAR(150)", key: "", nullable: "NO", default: "", notes: "Full legal name" },
        { name: "email", type: "VARCHAR(255)", key: "UNIQUE INDEX", nullable: "NO", default: "", notes: "Validated contact email address" },
        { name: "phone", type: "VARCHAR(50)", key: "", nullable: "YES", default: "NULL", notes: "Validated mobile digits" },
        { name: "headline", type: "VARCHAR(255)", key: "", nullable: "YES", default: "NULL", notes: "Professional pitch headline" },
        { name: "about_me", type: "TEXT", key: "", nullable: "YES", default: "NULL", notes: "Detailed self-introduction" },
        { name: "location", type: "VARCHAR(150)", key: "", nullable: "YES", default: "NULL", notes: "Current physical location" },
        { name: "nationality", type: "VARCHAR(100)", key: "", nullable: "YES", default: "NULL", notes: "State nationality" },
        { name: "avatar_url", type: "VARCHAR(512)", key: "", nullable: "YES", default: "NULL", notes: "Profile photo hosted on cloud storage" },
        { name: "expected_salary", type: "VARCHAR(100)", key: "", nullable: "YES", default: "NULL", notes: "Expected salary range" },
        { name: "availability_status", type: "ENUM", key: "", nullable: "NO", default: "'Immediate'", notes: "Immediate, 1 Month, 3 Month, Flexible" },
        { name: "verified", type: "TINYINT(1)", key: "", nullable: "NO", default: "0", notes: "Identity and credential check status flag" },
        { name: "ats_score", type: "INT", key: "", nullable: "NO", default: "0", notes: "Calculated overall resume score" },
        { name: "created_at", type: "TIMESTAMP", key: "", nullable: "NO", default: "CURRENT_TIMESTAMP", notes: "Record creation time" }
      ]
    },
    {
      id: "recruiters",
      name: "recruiters",
      description: "Stores recruiter accounts and corporate verification permissions.",
      columns: [
        { name: "id", type: "VARCHAR(36)", key: "PRIMARY KEY", nullable: "NO", default: "UUID()", notes: "Unique corporate user ID" },
        { name: "full_name", type: "VARCHAR(150)", key: "", nullable: "NO", default: "", notes: "Hiring officer contact name" },
        { name: "email", type: "VARCHAR(255)", key: "UNIQUE INDEX", nullable: "NO", default: "", notes: "Work email address" },
        { name: "company_name", type: "VARCHAR(200)", key: "", nullable: "NO", default: "", notes: "Verified company employer branding" },
        { name: "company_logo", type: "VARCHAR(512)", key: "", nullable: "YES", default: "NULL", notes: "Logo hosted on AWS S3" },
        { name: "company_website", type: "VARCHAR(255)", key: "", nullable: "YES", default: "NULL", notes: "Corporate portal" },
        { name: "industry", type: "VARCHAR(150)", key: "", nullable: "YES", default: "NULL", notes: "Corporate industry sector" },
        { name: "subscription_tier", type: "ENUM", key: "", nullable: "NO", default: "'Free'", notes: "Free, Premium, Enterprise" },
        { name: "verified_company", type: "TINYINT(1)", key: "", nullable: "NO", default: "0", notes: "Verification status of recruitment permit" }
      ]
    },
    {
      id: "skills",
      name: "skills",
      description: "Candidate skill matrices matching professional categories.",
      columns: [
        { name: "id", type: "VARCHAR(36)", key: "PRIMARY KEY", nullable: "NO", default: "UUID()", notes: "Unique skill identifier" },
        { name: "candidate_id", type: "VARCHAR(36)", key: "FOREIGN KEY", nullable: "NO", default: "", notes: "Reference to candidates.id (ON DELETE CASCADE)" },
        { name: "name", type: "VARCHAR(100)", key: "INDEX", nullable: "NO", default: "", notes: "Skill label (e.g. React, Kubernetes)" },
        { name: "level", type: "ENUM", key: "", nullable: "NO", default: "'Intermediate'", notes: "Beginner, Intermediate, Expert" },
        { name: "years_experience", type: "DECIMAL(3,1)", key: "", nullable: "NO", default: "0.0", notes: "Direct years operated" },
        { name: "category", type: "VARCHAR(100)", key: "", nullable: "NO", default: "", notes: "Programming, Design, Marketing, Finance" },
        { name: "endorsements", type: "INT", key: "", nullable: "NO", default: "0", notes: "Endorsements verified by system peers" }
      ]
    },
    {
      id: "work_experiences",
      name: "work_experiences",
      description: "Individual candidate career milestones.",
      columns: [
        { name: "id", type: "VARCHAR(36)", key: "PRIMARY KEY", nullable: "NO", default: "UUID()", notes: "Unique experience record ID" },
        { name: "candidate_id", type: "VARCHAR(36)", key: "FOREIGN KEY", nullable: "NO", default: "", notes: "Reference to candidates.id (ON DELETE CASCADE)" },
        { name: "company", type: "VARCHAR(200)", key: "", nullable: "NO", default: "", notes: "Company employer name" },
        { name: "position", type: "VARCHAR(150)", key: "", nullable: "NO", default: "", notes: "Job role title" },
        { name: "employment_type", type: "VARCHAR(50)", key: "", nullable: "NO", default: "'Full-time'", notes: "Full-time, Contract, Internship" },
        { name: "start_date", type: "VARCHAR(10)", key: "", nullable: "NO", default: "", notes: "YYYY-MM start milestone" },
        { name: "end_date", type: "VARCHAR(10)", key: "", nullable: "YES", default: "'Present'", notes: "YYYY-MM or Present" },
        { name: "responsibilities", type: "TEXT", key: "", nullable: "YES", default: "NULL", notes: "Responsibilities summary" }
      ]
    },
    {
      id: "invitations",
      name: "invitations",
      description: "Direct pitches dispatched from Recruiters to Candidates.",
      columns: [
        { name: "id", type: "VARCHAR(36)", key: "PRIMARY KEY", nullable: "NO", default: "UUID()", notes: "Unique invitation proposal ID" },
        { name: "recruiter_id", type: "VARCHAR(36)", key: "FOREIGN KEY", nullable: "NO", default: "", notes: "Reference to recruiters.id" },
        { name: "candidate_id", type: "VARCHAR(36)", key: "FOREIGN KEY", nullable: "NO", default: "", notes: "Reference to candidates.id" },
        { name: "position_title", type: "VARCHAR(150)", key: "", nullable: "NO", default: "", notes: "Proposed employment title" },
        { name: "pitch_message", type: "TEXT", key: "", nullable: "NO", default: "", notes: "Introductory proposal letter" },
        { name: "salary_offer", type: "VARCHAR(100)", key: "", nullable: "NO", default: "", notes: "Starting compensation offer" },
        { name: "scheduled_date", type: "DATETIME", key: "", nullable: "YES", default: "NULL", notes: "Proposed calendar time slot" },
        { name: "interview_link", type: "VARCHAR(512)", key: "", nullable: "YES", default: "NULL", notes: "Google Meet or Zoom direct link" },
        { name: "status", type: "ENUM", key: "", nullable: "NO", default: "'pending'", notes: "pending, accepted, rejected, scheduled" },
        { name: "created_at", type: "TIMESTAMP", key: "", nullable: "NO", default: "CURRENT_TIMESTAMP", notes: "Record timestamp" }
      ]
    },
    {
      id: "messages",
      name: "messages",
      description: "Internal message dialogues regarding active invitations.",
      columns: [
        { name: "id", type: "VARCHAR(36)", key: "PRIMARY KEY", nullable: "NO", default: "UUID()", notes: "Unique message ID" },
        { name: "invitation_id", type: "VARCHAR(36)", key: "FOREIGN KEY", nullable: "NO", default: "", notes: "Reference to invitations.id (ON DELETE CASCADE)" },
        { name: "sender_role", type: "ENUM", key: "", nullable: "NO", default: "", notes: "'candidate' or 'recruiter'" },
        { name: "content", type: "TEXT", key: "", nullable: "NO", default: "", notes: "Message content body" },
        { name: "timestamp", type: "TIMESTAMP", key: "", nullable: "NO", default: "CURRENT_TIMESTAMP", notes: "Sent timestamp" }
      ]
    }
  ];

  const activeTableData = tables.find(t => t.id === activeTable) || tables[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="database-schema-root">
      
      {/* Header Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3 mb-8">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold text-blue-700 border border-blue-100">
          <Database className="h-3.5 w-3.5" />
          <span>Relational Database Architecture</span>
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">MySQL Normalized Schema & ERD Specifications</h1>
        <p className="text-slate-500 text-xs font-semibold max-w-3xl leading-relaxed">
          Designed using Clean Architecture and fully normalized SOLID principles. Displays structural column maps, indices, primary/foreign relationships, and a vector Entity Relationship Diagram.
        </p>
      </div>

      {/* 1. Visual SVG ERD Diagram */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4 mb-8">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <GitFork className="h-4 w-4 text-blue-600" /> Scalable Entity Relationship Diagram (ERD)
        </h2>
        
        {/* Vector SVG ERD */}
        <div className="border border-slate-100 bg-slate-50 rounded-2xl p-4 overflow-x-auto flex justify-center">
          <svg viewBox="0 0 900 480" className="w-full max-w-(--size-lg) h-auto shrink-0 font-sans select-none">
            {/* Background elements */}
            <rect width="900" height="480" fill="#f8fafc" rx="16" />

            {/* Entity: candidates */}
            <g transform="translate(40, 40)">
              <rect width="200" height="150" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" rx="12" className="shadow-xs" />
              <rect width="200" height="32" fill="#2563eb" rx="12" />
              <rect width="200" height="12" y="20" fill="#2563eb" />
              <text x="100" y="20" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">candidates</text>
              
              <text x="12" y="52" fill="#1e293b" fontSize="10" fontWeight="bold">PK id (VARCHAR)</text>
              <text x="12" y="72" fill="#475569" fontSize="9">full_name (VARCHAR)</text>
              <text x="12" y="92" fill="#475569" fontSize="9">email (VARCHAR - UNIQUE)</text>
              <text x="12" y="112" fill="#475569" fontSize="9">expected_salary (VARCHAR)</text>
              <text x="12" y="132" fill="#475569" fontSize="9">verified (TINYINT)</text>
            </g>

            {/* Entity: work_experiences */}
            <g transform="translate(40, 270)">
              <rect width="200" height="130" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" rx="12" />
              <rect width="200" height="32" fill="#475569" rx="12" />
              <rect width="200" height="12" y="20" fill="#475569" />
              <text x="100" y="20" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">work_experiences</text>
              
              <text x="12" y="52" fill="#1e293b" fontSize="10" fontWeight="bold">PK id (VARCHAR)</text>
              <text x="12" y="72" fill="#0284c7" fontSize="10" fontWeight="bold">FK candidate_id ➔ cand</text>
              <text x="12" y="92" fill="#475569" fontSize="9">company (VARCHAR)</text>
              <text x="12" y="112" fill="#475569" fontSize="9">position (VARCHAR)</text>
            </g>

            {/* Entity: skills */}
            <g transform="translate(350, 40)">
              <rect width="200" height="130" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" rx="12" />
              <rect width="200" height="32" fill="#475569" rx="12" />
              <rect width="200" height="12" y="20" fill="#475569" />
              <text x="100" y="20" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">skills</text>
              
              <text x="12" y="52" fill="#1e293b" fontSize="10" fontWeight="bold">PK id (VARCHAR)</text>
              <text x="12" y="72" fill="#0284c7" fontSize="10" fontWeight="bold">FK candidate_id ➔ cand</text>
              <text x="12" y="92" fill="#475569" fontSize="9">name (VARCHAR)</text>
              <text x="12" y="112" fill="#475569" fontSize="9">level (ENUM)</text>
            </g>

            {/* Entity: recruiters */}
            <g transform="translate(660, 40)">
              <rect width="200" height="130" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" rx="12" />
              <rect width="200" height="32" fill="#2563eb" rx="12" />
              <rect width="200" height="12" y="20" fill="#2563eb" />
              <text x="100" y="20" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">recruiters</text>
              
              <text x="12" y="52" fill="#1e293b" fontSize="10" fontWeight="bold">PK id (VARCHAR)</text>
              <text x="12" y="72" fill="#475569" fontSize="9">company_name (VARCHAR)</text>
              <text x="12" y="92" fill="#475569" fontSize="9">subscription_tier (ENUM)</text>
              <text x="12" y="112" fill="#475569" fontSize="9">verified_company (TINYINT)</text>
            </g>

            {/* Entity: invitations */}
            <g transform="translate(350, 250)">
              <rect width="200" height="170" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" rx="12" />
              <rect width="200" height="32" fill="#059669" rx="12" />
              <rect width="200" height="12" y="20" fill="#059669" />
              <text x="100" y="20" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">invitations</text>
              
              <text x="12" y="52" fill="#1e293b" fontSize="10" fontWeight="bold">PK id (VARCHAR)</text>
              <text x="12" y="72" fill="#d97706" fontSize="10" fontWeight="bold">FK recruiter_id ➔ rec</text>
              <text x="12" y="92" fill="#0284c7" fontSize="10" fontWeight="bold">FK candidate_id ➔ cand</text>
              <text x="12" y="112" fill="#475569" fontSize="9">position_title (VARCHAR)</text>
              <text x="12" y="132" fill="#475569" fontSize="9">salary_offer (VARCHAR)</text>
              <text x="12" y="152" fill="#475569" fontSize="9">status (ENUM)</text>
            </g>

            {/* Relationship Connector Lines */}
            {/* Connection: candidates.id -> work_experiences.candidate_id */}
            <path d="M 140, 190 L 140, 270" stroke="#0284c7" strokeWidth="2" strokeDasharray="3,3" fill="none" />
            <circle cx="140" cy="190" r="3.5" fill="#0284c7" />
            <path d="M 136, 270 L 144, 270" stroke="#0284c7" strokeWidth="2" />

            {/* Connection: candidates.id -> skills.candidate_id */}
            <path d="M 240, 105 L 350, 105" stroke="#0284c7" strokeWidth="2" strokeDasharray="3,3" fill="none" />
            <circle cx="240" cy="105" r="3.5" fill="#0284c7" />
            <path d="M 350, 101 L 350, 109" stroke="#0284c7" strokeWidth="2" />

            {/* Connection: recruiters.id -> invitations.recruiter_id */}
            <path d="M 760, 170 L 760, 310 L 550, 310" stroke="#d97706" strokeWidth="2" strokeDasharray="3,3" fill="none" />
            <circle cx="760" cy="170" r="3.5" fill="#d97706" />
            <path d="M 550, 306 L 550, 314" stroke="#d97706" strokeWidth="2" />

            {/* Connection: candidates.id -> invitations.candidate_id */}
            <path d="M 240, 130 L 290, 130 L 290, 340 L 350, 340" stroke="#0284c7" strokeWidth="2" strokeDasharray="3,3" fill="none" />
            <circle cx="240" cy="130" r="3.5" fill="#0284c7" />
            <path d="M 350, 336 L 350, 344" stroke="#0284c7" strokeWidth="2" />

            {/* Labels on connectors */}
            <rect x="260" y="325" width="45" height="15" fill="#e0f2fe" rx="4" />
            <text x="282.5" y="336" fill="#0369a1" fontSize="8" fontWeight="bold" textAnchor="middle">1:N Match</text>

            <rect x="110" y="220" width="60" height="15" fill="#e0f2fe" rx="4" />
            <text x="140" y="231" fill="#0369a1" fontSize="8" fontWeight="bold" textAnchor="middle">1:N Careers</text>
          </svg>
        </div>
      </div>

      {/* 2. Interactive Schema Dictionary */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Table list selection (Left 3) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3.5">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">Relational Entities</span>
          <div className="space-y-1.5">
            {tables.map((table) => (
              <button
                key={table.id}
                id={`db-select-table-${table.id}`}
                onClick={() => setActiveTable(table.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  activeTable === table.id 
                    ? "bg-blue-50 text-blue-700 shadow-3xs" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{table.name}</span>
                <Grid className={`h-3.5 w-3.5 ${activeTable === table.id ? "text-blue-600" : "text-slate-400"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Detailed field definitions (Right 9) */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1">
              <FileCode className="h-4.5 w-4.5 text-blue-600" /> Table definition: <span className="text-blue-600 font-mono font-black">{activeTableData.name}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{activeTableData.description}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="p-3">Field Name</th>
                  <th className="p-3">Data Type</th>
                  <th className="p-3">Constraint</th>
                  <th className="p-3">Nullable</th>
                  <th className="p-3">Default</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold font-mono">
                {activeTableData.columns.map((col, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900 flex items-center">
                      {col.key === "PRIMARY KEY" && <Key className="h-3 w-3 mr-1 text-amber-500 shrink-0" />}
                      {col.key === "FOREIGN KEY" && <Link className="h-3 w-3 mr-1 text-blue-500 shrink-0" />}
                      <span>{col.name}</span>
                    </td>
                    <td className="p-3 text-slate-500">{col.type}</td>
                    <td className="p-3 text-amber-600 text-[10px]">{col.key}</td>
                    <td className="p-3 text-slate-400 text-[10px]">{col.nullable}</td>
                    <td className="p-3 text-slate-400 text-[10px]">{col.default}</td>
                    <td className="p-3 font-sans text-slate-600 font-medium text-[11px] leading-relaxed">{col.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
