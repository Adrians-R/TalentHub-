/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, Key, Link, ShieldAlert, Code, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function ApiReferenceView() {
  const [activeEndpoint, setActiveEndpoint] = useState<string>("analyze-resume");

  const endpoints = [
    {
      id: "analyze-resume",
      method: "POST",
      path: "/api/ai/analyze-resume",
      title: "ATS Resume Compliancy Review",
      description: "Direct server-side integration utilizing Gemini model schemas to review layout compliance and core ATS keyword saturation.",
      requestBody: `{
  "resumeText": "ALEX RIVERA... Senior Software Engineer...",
  "targetHeadline": "Senior DevOps & Kubernetes Architect"
}`,
      responseBody: `{
  "score": 85,
  "analysis": {
    "summary": "Excellent engineering summary. Layout formatting has clear hierarchy, though missing Kubernetes orchestration highlights.",
    "formattingScore": "9/10",
    "atsKeywordsMatched": ["React", "TypeScript", "Node.js"],
    "atsKeywordsMissing": ["Kubernetes", "Helm Chart", "CI/CD Sprints"],
    "improvements": [
      "Add explicit dockerization details in Stripe career history.",
      "Detail Helm orchestration practices."
    ]
  }
}`
    },
    {
      id: "skill-gap",
      method: "POST",
      path: "/api/api/ai/skill-gap",
      title: "Gemini Skill Gap Analysis",
      description: "Compare a candidate's registered skill set against an ideal corporate target role, mapping matches and critical missing certifications.",
      requestBody: `{
  "currentSkills": ["React", "CSS", "UI Design"],
  "targetRole": "Lead Product Designer"
}`,
      responseBody: `{
  "matchPercentage": 60,
  "skillsAcquired": ["React", "UI Design"],
  "gapSkills": ["Advanced Figma Auto-layouts", "User Research Iterations", "High-fidelity Prototyping"],
  "recommendations": [
    "Complete the certified Interaction Design Foundation Bootcamp.",
    "Add 2 high-fidelity case studies in your public portfolio."
  ]
}`
    }
  ];

  const activeData = endpoints.find(e => e.id === activeEndpoint) || endpoints[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="api-reference-root">
      
      {/* Header Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3 mb-8">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 text-xs font-bold text-white border border-slate-800">
          <Code className="h-3.5 w-3.5" />
          <span>TalentHub Developer Portal</span>
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">API Reference Documentation</h1>
        <p className="text-slate-500 text-xs font-semibold max-w-2xl leading-relaxed">
          Full RESTful OpenAPI specifications detailing our server-side cognitive modules, authentication headers, and request payloads.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Endpoint Navigation (Left 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4 self-start">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block pb-2 border-b border-slate-100">AI Server Endpoints</span>
          
          <div className="space-y-1.5">
            {endpoints.map((ep) => (
              <button
                key={ep.id}
                id={`api-btn-select-${ep.id}`}
                onClick={() => setActiveEndpoint(ep.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start space-x-2.5 cursor-pointer ${
                  activeEndpoint === ep.id 
                    ? "bg-blue-50 border-blue-200 shadow-3xs" 
                    : "border-slate-100 hover:bg-slate-50 bg-white"
                }`}
              >
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  ep.method === "POST" ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                }`}>
                  {ep.method}
                </span>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-slate-900 text-xs">{ep.title}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{ep.path}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Console / Code view (Right 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">{activeData.title}</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">{activeData.description}</p>
          </div>

          {/* Path Details */}
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-mono text-xs text-slate-800 flex items-center justify-between">
            <div className="space-x-2">
              <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{activeData.method}</span>
              <span className="font-bold">{activeData.path}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Content-Type: application/json</span>
          </div>

          {/* JSON Playloads */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">JSON Request Body Schema</span>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-[10.5px] font-mono leading-relaxed overflow-x-auto max-h-[300px]">
                {activeData.requestBody}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Success Response Body Schema (200 OK)</span>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-[10.5px] font-mono leading-relaxed overflow-x-auto max-h-[300px]">
                {activeData.responseBody}
              </pre>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
