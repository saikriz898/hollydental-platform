"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { Cpu, Copy, Check, MessageCircle, AlertTriangle, FileText, CalendarDays } from "lucide-react";

function parseMarkdownToHtml(markdown: string) {
  if (!markdown) return "";
  
  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Italic (*text*)
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Headers (### Header, ## Header, # Header)
  html = html.replace(/^### (.*?)$/gm, "<h4 class='font-serif text-xs font-bold text-navy mt-3 mb-1'>$1</h4>");
  html = html.replace(/^## (.*?)$/gm, "<h3 class='font-serif text-sm font-bold text-navy mt-4 mb-1.5'>$1</h3>");
  html = html.replace(/^# (.*?)$/gm, "<h2 class='font-serif text-base font-bold text-navy mt-5 mb-2'>$1</h2>");

  // Lists (- Item or * Item)
  html = html.replace(/^\s*[-*]\s+(.*?)$/gm, "<li class='list-disc list-inside ml-2 my-0.5 text-[11px]'>$1</li>");

  // Line breaks
  html = html.replace(/\n/g, "<br />");

  return html;
}

export default function AdminAIPage() {
  const [activeTab, setActiveTab] = useState<"summary" | "review" | "blog" | "sms" | "prescription">("summary");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  // Form states
  const [patientName, setPatientName] = useState("Sarah O'Connor");
  const [treatmentCompleted, setTreatmentCompleted] = useState("teeth-cleaning");
  const [reviewText, setReviewText] = useState("Great service! Dr. Roghay is the best dentist in Cork!");
  const [blogTopic, setBlogTopic] = useState("Why Teeth Cleaning is Vital");
  const [blogKeyword, setBlogKeyword] = useState("teeth cleaning Cork");

  const handleGenerate = async () => {
    setLoading(true);
    setOutput("");
    setCopied(false);

    try {
      let endpoint = "/ai/patient-summary";
      let body: any = {};

      if (activeTab === "summary") {
        endpoint = "/ai/patient-summary";
        body = {
          name: patientName,
          age: 38,
          lastVisit: "June 2025",
          completedTreatments: "Teeth Cleaning",
          outstanding: "Composite fillings on 14, 15",
          medicalNotes: "Penicillin allergy, dental anxiety",
        };
      } else if (activeTab === "review") {
        endpoint = "/ai/review-reply";
        body = { reviewText, rating: 5 };
      } else if (activeTab === "blog") {
        endpoint = "/ai/blog-generate";
        body = { topic: blogTopic, keyword: blogKeyword };
      } else if (activeTab === "sms") {
        endpoint = "/ai/followup-reminder";
        body = { name: patientName, treatment: "Composite Fillings" };
      } else if (activeTab === "prescription") {
        endpoint = "/ai/prescription-note";
        body = { drugName: "Amoxicillin", dosage: "500mg", instructions: "Take 3 times daily" };
      }

      const data = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      setOutput(data.summary || data.reply || data.article || data.smsText || data.note || "");
    } catch (error) {
      setOutput("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-serif text-2xl font-bold text-navy flex items-center gap-2">
          <Cpu className="w-6 h-6 text-gold animate-pulse" /> AI Clinical Assistant
        </h1>
        <p className="text-gray-500 text-xs mt-1">Scribe clinic letters, draft patient reminders, generate replies, and produce SEO drafts</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6 overflow-x-auto pb-1 text-xs font-semibold text-navy">
        {["summary", "review", "blog", "sms", "prescription"].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab as any); setOutput(""); }}
            className={`pb-2.5 shrink-0 border-b-2 uppercase tracking-wider transition-all ${
              activeTab === tab ? "border-gold text-gold" : "border-transparent text-gray-400"
            }`}
          >
            {tab === "summary" ? "Clinical Brief" : tab === "review" ? "Review Reply" : tab === "blog" ? "Blog Generator" : tab === "sms" ? "SMS Follow-up" : "Rx suggestion"}
          </button>
        ))}
      </div>

      {/* Form Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Parameters column */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          
          {activeTab === "summary" && (
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-navy">Patient Brief Parameters</h4>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === "review" && (
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-navy">Review Text Reply</h4>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-navy">Paste Patient Review</label>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === "blog" && (
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-navy">Article SEO Parameters</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Topic / Title Idea</label>
                  <input
                    type="text"
                    value={blogTopic}
                    onChange={(e) => setBlogTopic(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Primary SEO Keyword</label>
                  <input
                    type="text"
                    value={blogKeyword}
                    onChange={(e) => setBlogKeyword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "sms" && (
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-navy">SMS Follow-up Parameters</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">Treatment Completed</label>
                  <select
                    value={treatmentCompleted}
                    onChange={(e) => setTreatmentCompleted(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  >
                    <option value="teeth-cleaning">Hygiene Cleaning</option>
                    <option value="composite-fillings">Composite Fillings</option>
                    <option value="veneers">Porcelain Veneers</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "prescription" && (
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-navy">Usage Tip Generator</h4>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-800 text-xs">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold">Clinical Audit Warning</h5>
                  <p className="text-[10px] text-red-700 leading-relaxed">
                    Prescription suggestions generated by clinical AI must be reviewed by Dr. Roghay Alizadeh before committing to logs.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-2.5 rounded-lg text-xs shadow-md transition-colors disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate AI Output &rarr;"}
          </button>
        </div>

        {/* Output Panel column */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[340px]">
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            <div className="border-b border-gray-100 pb-2 flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-gray-400">Gemini Output Brief</span>
              {output && (
                <button
                  onClick={handleCopy}
                  className="text-navy hover:text-gold text-xs font-semibold flex items-center gap-1.5 focus:outline-none"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                AI is compiling results...
              </div>
            ) : output ? (
              <div
                className="prose prose-sm max-w-none text-xs text-gray-600 leading-relaxed overflow-y-auto max-h-[260px] p-3 bg-gray-50 rounded-lg flex-1 mt-3"
                dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(output) }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Click Generate to see result brief.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
