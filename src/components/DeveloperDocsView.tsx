/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Database, 
  Terminal, 
  Server, 
  Code, 
  FileText, 
  BookOpen, 
  Layers, 
  Activity, 
  Network,
  Shield,
  FileCode
} from "lucide-react";
import DatabaseSchemaView from "./DatabaseSchemaView";
import ApiReferenceView from "./ApiReferenceView";

export default function DeveloperDocsView() {
  const [activeDocsTab, setActiveDocsTab] = useState<"erd" | "api" | "architecture" | "tech-spec">("architecture");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="developer-docs-portal">
      {/* Title Banner */}
      <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-96 bg-radial-gradient from-blue-600/10 to-transparent -z-10" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md text-[10px] font-black uppercase tracking-wider">
              <Code className="h-3.5 w-3.5 mr-1" /> Core Engineering Docs
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">TalentHub Developer Architecture</h1>
            <p className="text-xs text-slate-400 font-semibold max-w-xl">
              Internal system logs, database relational structures, server-side API specifications, and infrastructure deployment maps.
            </p>
          </div>

          {/* Subtabs Switcher */}
          <div className="flex flex-wrap bg-slate-900 p-1 rounded-2xl border border-slate-800">
            {[
              { id: "architecture", label: "Deployment Architecture", icon: Server },
              { id: "tech-spec", label: "AI Workflows", icon: Layers },
              { id: "erd", label: "Database ERD", icon: Database },
              { id: "api", label: "REST API Explorer", icon: Terminal },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeDocsTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDocsTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------ TAB CONTENT ------------------ */}
      <div className="space-y-8 animate-fade-in">
        
        {/* 1. DEPLOYMENT ARCHITECTURE */}
        {activeDocsTab === "architecture" && (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Self-Hosted Infrastructure blueprint</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Production Docker Compose cluster mesh & container topologies.</p>
                </div>

                {/* Topology flow visualization */}
                <div className="p-6 bg-slate-950 rounded-2xl text-slate-300 font-mono text-[11px] space-y-4 border border-slate-800 overflow-x-auto">
                  <div className="text-blue-400 font-bold border-b border-slate-800 pb-2"># NETWORK TOPO LAYOUT</div>
                  <div>[ Public Net: Port 443 ] ──► [ Nginx WAF / SSL Gate ]</div>
                  <div className="pl-36">│</div>
                  <div className="pl-36">▼ [ VPC Network - 10.0.1.0/24 ]</div>
                  <div className="pl-36">┌───────────────────────────┐</div>
                  <div className="pl-36">│  App Server: Port 3000    │</div>
                  <div className="pl-36">└─────┬───┬─────────────┬───┘</div>
                  <div className="pl-36">      │   │             │</div>
                  <div className="pl-12">┌─────▼───┐ ┌───▼─────────┐ ┌───▼─────────┐ ┌───▼─────────┐</div>
                  <div className="pl-12">│  Postgres│ │ Redis Cache │ │ Meilisearch │ │  MinIO S3   │</div>
                  <div className="pl-12">│ (PGVector│ │ (Session   │ │ (Sourcing   │ │ (Candidate  │</div>
                  <div className="pl-12">│  Primary)│ │  & Query)  │ │  Indexer)   │ │  Resumes)   │</div>
                  <div className="pl-12">└──────────┘ └─────────────┘ └─────────────┘ └─────────────┘</div>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-emerald-500" /> Secure SSL Edge Proxy Setup
                  </h4>
                  <p>
                    SSL termination is processed at the outer boundary container using high-speed static headers inside Nginx. Traffic limits protect resource discovery endpoints (e.g. limit recruiter searches to 1 request per second to completely prevent competitor talent scraping).
                  </p>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[10px] text-slate-700 space-y-1">
                    <div>limit_req_zone $binary_remote_addr zone=sourcing_limit:10m rate=1r/s;</div>
                    <div>location /api/recruiter/search &#123;</div>
                    <div className="pl-4">limit_req zone=sourcing_limit burst=5;</div>
                    <div className="pl-4">proxy_pass http://app-server:3000;</div>
                    <div>&#125;</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-blue-600" /> Platform Services Config
                </h4>
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">Relational DB</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">PostgreSQL v16</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">Query In-Memory Cache</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">Redis Cluster v7</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">Full Text Search Engine</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">Meilisearch</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500 font-bold">Secure Resume Storage</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">MinIO (S3 Compatible)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900">Database Tuning Settings</h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-250 font-mono text-[10px] space-y-1 text-slate-600">
                  <div>shared_buffers = 2GB</div>
                  <div>effective_cache_size = 6GB</div>
                  <div>work_mem = 32MB</div>
                  <div>max_connections = 200</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. AI WORKFLOW SPECIFICATIONS */}
        {activeDocsTab === "tech-spec" && (
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Server-Side GenAI Evaluation Pipelines</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Multi-model task scheduling and secure data processing maps.</p>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Network className="h-4 w-4 text-purple-600" /> Pipeline Flow Stages
                  </h4>
                  <p>
                    Every candidate file ingest triggers an automated pipeline: Vision-parsing PDF structures using Gemini model classes directly into database-ready profiles.
                  </p>

                  <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 space-y-2 text-slate-700">
                    <div className="flex items-center space-x-2 text-slate-800 font-bold">
                      <span className="bg-slate-200 px-2 py-0.5 rounded text-[10px]">1</span>
                      <span>CV File Upload:</span>
                    </div>
                    <p className="pl-6 text-[11px] text-slate-500">MinIO S3 records the document, converting pages directly into layout buffers.</p>

                    <div className="flex items-center space-x-2 text-slate-800 font-bold">
                      <span className="bg-slate-200 px-2 py-0.5 rounded text-[10px]">2</span>
                      <span>Anonymization & Injection Safety Filters:</span>
                    </div>
                    <p className="pl-6 text-[11px] text-slate-500">Strips raw names and email hashes to remove downstream cognitive matching bias.</p>

                    <div className="flex items-center space-x-2 text-slate-800 font-bold">
                      <span className="bg-slate-200 px-2 py-0.5 rounded text-[10px]">3</span>
                      <span>Google GenAI Model Schema Call:</span>
                    </div>
                    <p className="pl-6 text-[11px] text-slate-500">Fires the @google/genai structured taxonomy parser with responseSchema configurations.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-purple-600" /> Model Task Grid
                </h4>
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1 pb-2 border-b border-slate-100">
                    <div className="font-extrabold text-slate-800">Resume Parser</div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>gemini-3.5-flash</span>
                      <span className="font-bold">Structured JSON</span>
                    </div>
                  </div>
                  <div className="space-y-1 pb-2 border-b border-slate-100">
                    <div className="font-extrabold text-slate-800">Deep Profile Matcher</div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>gemini-3.1-pro-preview</span>
                      <span className="font-bold">Long Context</span>
                    </div>
                  </div>
                  <div className="space-y-1 pb-2 border-b border-slate-100">
                    <div className="font-extrabold text-slate-800">Skill Gap Engine</div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>gemini-3.5-flash</span>
                      <span className="font-bold">Venn Taxonomy</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-800">Active Interview Coach</div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>gemini-3.1-pro-preview</span>
                      <span className="font-bold">Modality.AUDIO / Chat</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. DATABASE ERD SCHEMA */}
        {activeDocsTab === "erd" && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-base font-extrabold text-slate-900">Relational Database Entity Relationship Schema</h3>
              <p className="text-xs text-slate-500 font-semibold">Active PostgreSQL blueprints. Navigate between schemas using the ERD viewer.</p>
            </div>
            <DatabaseSchemaView />
          </div>
        )}

        {/* 4. REST API SPECIFICATION */}
        {activeDocsTab === "api" && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-base font-extrabold text-slate-900">SaaS REST API Sandbox & Explorer</h3>
              <p className="text-xs text-slate-500 font-semibold">Automated payload generators and interactive query responses.</p>
            </div>
            <ApiReferenceView />
          </div>
        )}

      </div>
    </div>
  );
}
