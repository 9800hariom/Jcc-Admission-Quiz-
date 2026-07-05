import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Award, RefreshCw, Clipboard, ExternalLink, Gift, Sparkles, BookOpen, 
  MapPin, Share2, HelpCircle, Laptop, Sprout, Building, CheckCircle, 
  Phone, Mail, Globe, X, ChevronRight, GraduationCap, Download, Play, 
  RotateCcw, Calendar, FileText, Send, User, Search, Landmark
} from "lucide-react";
import { Student, College } from "../types";

interface ResultPortalProps {
  student: Student;
  quizResult: {
    score: number;
    correctCount: number;
    speedBonus: number;
    recommendedStream: string;
    recommendationReason: string;
    matchedColleges: College[];
  };
  onRestart: () => void;
}

export default function ResultPortal({ student, quizResult, onRestart }: ResultPortalProps) {
  const [aiReport, setAiReport] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiError, setAiError] = useState("");
  const [selectedCollegeProfile, setSelectedCollegeProfile] = useState<College | null>(null);
  const [modalTab, setModalTab] = useState<"OVERVIEW" | "AGRICULTURE" | "BIT" | "ADMISSIONS">("OVERVIEW");
  
  // Custom states for JCC reward and College Management Dashboard
  const [showRewardModal, setShowRewardModal] = useState(true);
  const [showJccDashboard, setShowJccDashboard] = useState(true);
  const [jccTab, setJccTab] = useState<"PROFILE" | "ACADEMICS" | "FEES" | "SIMULATION" | "CONTACT">("PROFILE");
  const [soilPh, setSoilPh] = useState(6.5);
  const [codeSnippet, setCodeSnippet] = useState(`// Welcome to JCC BIT Coding Sandbox!
// Write some JavaScript below and click 'Run Code'

function welcomeToJCC() {
  let studentName = "${student.fullName}";
  console.log("Hello, " + studentName + "!");
  console.log("Welcome to Janakpur Community College BIT Portal.");
  console.log("Your merit score of ${quizResult.score} points is verified!");
  return "Status: EXCELLENT";
}

welcomeToJCC();`);
  const [codeOutput, setCodeOutput] = useState<string[]>([]);
  const [inquiryName, setInquiryName] = useState(student.fullName);
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [studentId] = useState(`JCC-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  const referralLink = `${window.location.origin}?ref=${student.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateAiReport = async () => {
    setLoadingAi(true);
    setAiError("");
    try {
      const response = await fetch("/api/recommend-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student.id })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate AI guidance");
      }
      setAiReport(data.message || "");
    } catch (e: any) {
      setAiError(e.message || "Failed to connect to the Career Mentor. Please try again.");
    } finally {
      setLoadingAi(false);
    }
  };

  // Safe and fast Markdown rendering helper for the AI Mentorship Letter
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("# ")) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-extrabold text-indigo-900 mt-6 mb-3 border-b border-indigo-100 pb-2">
            {trimmed.substring(2)}
          </h2>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-lg font-bold text-indigo-800 mt-5 mb-2 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>{trimmed.substring(3)}</span>
          </h3>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-md font-semibold text-indigo-700 mt-4 mb-2">
            {trimmed.substring(4)}
          </h4>
        );
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <ul key={idx} className="list-disc pl-6 my-1.5 text-sm text-slate-700 space-y-1">
            <li>{trimmed.substring(2)}</li>
          </ul>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const matches = trimmed.match(/^(\d+)\.\s(.*)/);
        if (matches) {
          return (
            <ol key={idx} className="list-decimal pl-6 my-1.5 text-sm text-slate-700">
              <li className="font-medium">{matches[2]}</li>
            </ol>
          );
        }
      }
      if (trimmed === "") {
        return <div key={idx} className="h-2"></div>;
      }

      // Handle simple **bold** wrapping
      const boldRegex = /\*\*(.*?)\*\*/g;
      let parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-indigo-950">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <p key={idx} className="text-sm text-slate-600 leading-relaxed my-1.5">
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  const executeSandboxCode = () => {
    const logs: string[] = [];
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      logs.push(args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" "));
    };
    try {
      const result = new Function(codeSnippet)();
      if (result !== undefined) {
        logs.push(`Returned: ${String(result)}`);
      }
    } catch (e: any) {
      logs.push(`Error: ${e.message}`);
    } finally {
      console.log = originalConsoleLog;
    }
    setCodeOutput(logs);
  };

  if (showJccDashboard) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Back and breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowJccDashboard(false)}
            className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80 px-4 py-2 rounded-xl border border-indigo-200/50 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to Matches & Recommendations</span>
          </button>
          
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span>Student Portal</span>
            <span>/</span>
            <span className="text-slate-800 font-bold">Janakpur Community College</span>
          </div>
        </div>

        {/* JCC Institution Hero Badge Banner */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-bl-2xl tracking-widest shadow flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Fully Enrolled via Reward Badge</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl text-white font-black tracking-tighter border border-white/20 shadow-lg shrink-0">
                  <span className="text-xl">JCC</span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 flex-wrap">
                    Janakpur Community College
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded">University Partner</span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ward No. 8, Ramanand Chowk, Janakpur, Nepal</span>
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
                "JCC provides quality technical education that creates better job opportunities for the students." Established as the leading academic institute of Madhesh Province.
              </p>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-slate-700/60 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center text-xs text-slate-300 space-y-1.5 shrink-0 text-left">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>Phone: <strong className="text-slate-100">041-591195</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>Email: <strong className="text-slate-100 font-mono">janakpurcollege@gmail.com</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>Web: <a href="http://janakpurcollege.com" target="_blank" rel="noreferrer" className="text-indigo-300 hover:underline">janakpurcollege.com</a></span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Sidebar Menu */}
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block px-2 mb-2">CAMPUS PORTAL</span>
            {[
              { id: "PROFILE", label: "Student Profile", icon: User },
              { id: "ACADEMICS", label: "LMS & Classrooms", icon: GraduationCap },
              { id: "FEES", label: "Financials & Fees", icon: Landmark },
              { id: "SIMULATION", label: "Virtual Labs & Code", icon: Laptop },
              { id: "CONTACT", label: "Helpdesk & Registrar", icon: Mail }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = jccTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setJccTab(tab.id as any)}
                  className={`w-full flex items-center space-x-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-150" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Dashboard Panel Content */}
          <div className="md:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[450px]">
            {jccTab === "PROFILE" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800">Verified JCC Student Card</h3>
                    <p className="text-xs text-slate-400 font-medium">Authorized Academic Session 2026/2027</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    Admission Active
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-150">
                  {/* Photo ID Badge */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-tr from-indigo-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-inner relative border-2 border-white">
                    <div className="text-center">
                      <GraduationCap className="w-8 h-8 mx-auto text-emerald-200 mb-1" />
                      <span className="font-mono text-xs font-extrabold tracking-wider bg-black/20 px-2 py-0.5 rounded-full">STUDENT</span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-grow text-center sm:text-left">
                    <div className="space-y-0.5">
                      <h4 className="text-xl font-bold text-slate-800">{student.fullName}</h4>
                      <p className="text-xs text-slate-400 font-mono">Registration ID: {studentId}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-left">
                        <span className="text-slate-400 block text-[10px] uppercase font-extrabold">Assigned Major</span>
                        <span className="font-bold text-indigo-700">{quizResult.recommendedStream === "BIT" ? "Bachelor of Information Technology (BIT)" : "B.Sc. Agriculture (Hons)"}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-left">
                        <span className="text-slate-400 block text-[10px] uppercase font-extrabold">Scholarship Status</span>
                        <span className="font-bold text-emerald-700">35% Provincial Merit Reward</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-left">
                        <span className="text-slate-400 block text-[10px] uppercase font-extrabold">Primary Campus Block</span>
                        <span className="font-semibold text-slate-700">Ramanand Block, Ward 8</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-left">
                        <span className="text-slate-400 block text-[10px] uppercase font-extrabold">Registered Phone</span>
                        <span className="font-semibold text-slate-700">{student.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-widest">Merit Entrance Scores Verified</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="border border-slate-150 p-3 rounded-xl text-center">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Heuristic Evaluation Score</span>
                      <span className="text-lg font-black text-indigo-600">{quizResult.score} / 150</span>
                    </div>
                    <div className="border border-slate-150 p-3 rounded-xl text-center">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Direct Admission Status</span>
                      <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">APPROVED</span>
                    </div>
                    <div className="border border-slate-150 p-3 rounded-xl text-center">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Intake Sem</span>
                      <span className="text-sm font-bold text-slate-700">Fall 2026 Session</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {jccTab === "ACADEMICS" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800">Learning Management System (LMS) & Classroom</h3>
                    <p className="text-xs text-slate-400 font-medium">Access your lectures, study materials, and direct syllabus guides</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Daily Lecture Calendar */}
                  <div className="space-y-3 text-left">
                    <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Assigned Timetable</span>
                    </h4>
                    
                    <div className="space-y-2.5">
                      {quizResult.recommendedStream === "BIT" ? (
                        <>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex justify-between items-center text-xs">
                            <div className="space-y-0.5 text-left">
                              <span className="font-bold text-slate-800 block">Computer Programming & Algorithms</span>
                              <span className="text-slate-400 font-medium">Lecturer: Prof. Hari Om</span>
                            </div>
                            <span className="font-mono bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded">08:30 AM</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex justify-between items-center text-xs">
                            <div className="space-y-0.5 text-left">
                              <span className="font-bold text-slate-800 block">Database Management & Normalization</span>
                              <span className="text-slate-400 font-medium">Lecturer: Prof. Prasad</span>
                            </div>
                            <span className="font-mono bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded">10:30 AM</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex justify-between items-center text-xs">
                            <div className="space-y-0.5 text-left">
                              <span className="font-bold text-slate-800 block">System Design & Web Architecture</span>
                              <span className="text-slate-400 font-medium">Lecturer: Dr. Shrestha</span>
                            </div>
                            <span className="font-mono bg-indigo-50 text-indigo-700 font-bold px-2 py-1 rounded">01:30 PM</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex justify-between items-center text-xs">
                            <div className="space-y-0.5 text-left">
                              <span className="font-bold text-slate-800 block">Agronomy & Scientific Crop Science</span>
                              <span className="text-slate-400 font-medium">Lecturer: Dr. Yadav</span>
                            </div>
                            <span className="font-mono bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded">08:00 AM</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex justify-between items-center text-xs">
                            <div className="space-y-0.5 text-left">
                              <span className="font-bold text-slate-800 block">Soil Chemistry & Nutrient Management</span>
                              <span className="text-slate-400 font-medium">Lecturer: Prof. Jha</span>
                            </div>
                            <span className="font-mono bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded">10:00 AM</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex justify-between items-center text-xs">
                            <div className="space-y-0.5 text-left">
                              <span className="font-bold text-slate-800 block">Principles of Horticulture & Bio-pests</span>
                              <span className="text-slate-400 font-medium">Lecturer: Dr. Shah</span>
                            </div>
                            <span className="font-mono bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded">01:00 PM</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Syllabus & Resource Downloads */}
                  <div className="space-y-3 text-left">
                    <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Official Curriculum Booklets</span>
                    </h4>

                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/60 text-xs space-y-3">
                      <span className="font-bold text-slate-700 block">Available Course Materials</span>
                      
                      <div className="space-y-2">
                        <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 p-2.5 rounded-lg flex items-center justify-between font-bold cursor-pointer transition-colors text-left">
                          <span>📖 JCC Academic Calendar (2026/27)</span>
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                        
                        {quizResult.recommendedStream === "BIT" ? (
                          <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 p-2.5 rounded-lg flex items-center justify-between font-bold cursor-pointer transition-colors text-left">
                            <span>💻 BIT 1st Sem Syllabus Guide.pdf</span>
                            <Download className="w-3.5 h-3.5 text-indigo-500" />
                          </button>
                        ) : (
                          <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 p-2.5 rounded-lg flex items-center justify-between font-bold cursor-pointer transition-colors text-left">
                            <span>🌱 B.Sc. Agriculture Syllabus Guide.pdf</span>
                            <Download className="w-3.5 h-3.5 text-emerald-500" />
                          </button>
                        )}

                        <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 p-2.5 rounded-lg flex items-center justify-between font-bold cursor-pointer transition-colors text-left">
                          <span>🏛️ JCC Hostel Rules & Fees Regulation.pdf</span>
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {jccTab === "FEES" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-extrabold text-slate-800">Billing Ledger & Merit Scholarships</h3>
                  <p className="text-xs text-slate-400 font-medium">Official statement for first semester enrollment fees</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Standard Tuition Fee</span>
                    <span className="text-lg font-bold text-slate-800">Rs. 85,000 / Sem</span>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-emerald-950">
                    <span className="text-[10px] text-emerald-500 uppercase font-extrabold block">Merit Scholarship applied</span>
                    <span className="text-lg font-bold text-emerald-700">- Rs. 29,750 (35% off)</span>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-indigo-950">
                    <span className="text-[10px] text-indigo-500 uppercase font-extrabold block">Provisionally Due Balance</span>
                    <span className="text-lg font-bold text-indigo-700">Rs. 0 <span className="text-xs text-indigo-400 font-sans font-normal">(Admission Secured!)</span></span>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-4">
                  <span className="font-extrabold text-xs text-slate-700 block">🧾 Itemized Ledger Overview</span>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                      <span>Provincial Affiliation Registration Fee</span>
                      <span className="font-mono">Rs. 5,000</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                      <span>Semester Tuition Fee (15 Credits)</span>
                      <span className="font-mono">Rs. 70,000</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                      <span>High-Performance Library & Tech Lab Fee</span>
                      <span className="font-mono">Rs. 10,000</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50 text-emerald-700 font-bold bg-emerald-50/50 px-2 py-0.5 rounded">
                      <span>DirectAdmission Merit Scholarship Applied (35%)</span>
                      <span className="font-mono">- Rs. 29,750</span>
                    </div>
                    <div className="flex justify-between pt-2 text-sm text-slate-900 font-extrabold">
                      <span>Secured Provision Enrollment Seat Due</span>
                      <span className="font-mono text-emerald-600">Rs. 0 (Fully Secured)</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      alert(`Admission merit receipt downloaded successfully for JCC Candidate registration: ${studentId}. Presented at Ramanand Chowk office to print standard physical booklet.`);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl cursor-pointer flex items-center space-x-1.5 shadow"
                  >
                    <Download className="w-4 h-4 text-slate-300" />
                    <span>Generate & Download Scholarship Admission Receipt</span>
                  </button>
                </div>
              </div>
            )}

            {jccTab === "SIMULATION" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4 text-left">
                  <h3 className="text-lg font-extrabold text-slate-800">Academic Simulation Laboratories</h3>
                  <p className="text-xs text-slate-400">Interactive scientific and software labs matching your recommended departments</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Agriculture soil pH test */}
                  <div className="lg:col-span-6 bg-emerald-50/20 p-5 rounded-2xl border border-emerald-100 space-y-4 text-left">
                    <div className="flex items-center space-x-2 text-emerald-800">
                      <Sprout className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-extrabold text-sm">Agriculture Science Simulator: Soil pH & Crops</h4>
                    </div>
                    
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Farmers in Janakpur and Dhanusha district utilize JCC's cooperative laboratories to test soil quality. Use this interactive slider to simulate soil acidity level and see optimal crop pairings:
                    </p>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span>Simulated Soil pH Level:</span>
                        <span className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded font-mono text-sm">{soilPh.toFixed(1)}</span>
                      </div>

                      <input 
                        type="range"
                        min="4.0"
                        max="9.0"
                        step="0.5"
                        value={soilPh}
                        onChange={(e) => setSoilPh(parseFloat(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />

                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>4.0 (Highly Acidic)</span>
                        <span>7.0 (Neutral)</span>
                        <span>9.0 (Alkaline)</span>
                      </div>

                      <div className="border-t border-slate-100 pt-3 space-y-1.5">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Simulation Report</span>
                        
                        {soilPh < 5.5 && (
                          <div className="p-3 bg-rose-50 text-rose-800 rounded-lg space-y-1">
                            <span className="font-bold block">🚨 Acidic Soil Status</span>
                            <p className="text-[11px] text-rose-700 leading-normal">Recommended: Potatoes, Oats, Blueberries. Add lime treatment to balance optimal agricultural nutrients.</p>
                          </div>
                        )}
                        {soilPh >= 5.5 && soilPh <= 6.5 && (
                          <div className="p-3 bg-amber-50 text-amber-800 rounded-lg space-y-1">
                            <span className="font-bold block">🌱 Mildly Acidic Soil Status</span>
                            <p className="text-[11px] text-amber-700 leading-normal">Recommended crops: Sweet Potatoes, Oats, Maize, Carrots, Mustard. Extremely common and high-yielding in Madhesh Province.</p>
                          </div>
                        )}
                        {soilPh > 6.5 && soilPh <= 7.2 && (
                          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg space-y-1">
                            <span className="font-bold block">✨ Optimal / Neutral Soil Status</span>
                            <p className="text-[11px] text-emerald-700 leading-normal">Recommended crops: Rice, Wheat, Soybean, Tomatoes. Ideal soil chemistry for standard organic farming of main crops in Janakpur.</p>
                          </div>
                        )}
                        {soilPh > 7.2 && (
                          <div className="p-3 bg-indigo-50 text-indigo-800 rounded-lg space-y-1">
                            <span className="font-bold block">🌾 Alkaline Soil Status</span>
                            <p className="text-[11px] text-indigo-700 leading-normal">Recommended crops: Alfalfa, Mustard, Cabbage, Barley. Consider compost treatments to reduce basic concentration.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Code Compiler Sandbox */}
                  <div className="lg:col-span-6 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4 text-left">
                    <div className="flex items-center justify-between text-slate-200">
                      <div className="flex items-center space-x-2">
                        <Laptop className="w-5 h-5 text-indigo-400" />
                        <h4 className="font-extrabold text-sm">BIT Lab Software Sandbox</h4>
                      </div>
                      <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/20">v1.2 JS VM</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      JCC's IT laboratories are equipped with fast environments. Write basic JavaScript statements below and run them directly in the sandbox!
                    </p>

                    <div className="space-y-3 text-xs text-left">
                      <textarea
                        value={codeSnippet}
                        onChange={(e) => setCodeSnippet(e.target.value)}
                        rows={8}
                        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg font-mono text-emerald-400 focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={executeSandboxCode}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center space-x-1"
                        >
                          <Play className="w-3.5 h-3.5 text-white" />
                          <span>Run JavaScript</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setCodeSnippet(`// JCC BIT Sandbox Reset\nfunction sum(a, b) {\n  return a + b;\n}\nconsole.log("Sum result: " + sum(120, 230));`);
                            setCodeOutput([]);
                          }}
                          className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs px-3 py-2.5 rounded-xl cursor-pointer flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset Sandbox</span>
                        </button>
                      </div>

                      {/* Execution Terminal */}
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1 min-h-[100px] overflow-y-auto font-mono text-[11px] text-left">
                        <span className="text-[9px] text-slate-500 uppercase font-black block border-b border-slate-800 pb-1 mb-1">Terminal Output</span>
                        {codeOutput.length === 0 ? (
                          <span className="text-slate-600 italic">No output. Press 'Run JavaScript' to compile.</span>
                        ) : (
                          codeOutput.map((logLine, idx) => (
                            <div key={idx} className={logLine.startsWith("Error:") ? "text-rose-400 text-left" : logLine.startsWith("Returned:") ? "text-indigo-400 text-left" : "text-slate-300 text-left"}>
                              &gt; {logLine}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {jccTab === "CONTACT" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-extrabold text-slate-800">Registrar Helpdesk & Inquiry Board</h3>
                  <p className="text-xs text-slate-400 font-medium">Direct admission office coordinates and query dispatcher</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address / Contact Cards */}
                  <div className="space-y-4 text-xs text-slate-600 text-left">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2.5">
                      <span className="font-bold text-slate-800 text-sm block">📍 Official Coordinates</span>
                      
                      <div className="flex items-start space-x-2 text-left">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Ward No. 8, Ramanand Chowk</strong>
                          <p className="text-slate-400 font-semibold">Janakpurdham, Madhesh Province, Nepal</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2 text-left">
                        <Phone className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>041-591195</strong>
                          <p className="text-slate-400 font-medium">Primary Admission desk (09:00 AM - 05:00 PM Sunday-Friday)</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2 text-left">
                        <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>janakpurcollege@gmail.com</strong>
                          <p className="text-slate-400 font-medium">Official registrar mailbox for fast query handling</p>
                        </div>
                      </div>
                    </div>

                    {/* Registrar Board Contacts */}
                    <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100 space-y-2 text-left">
                      <span className="font-extrabold text-indigo-950 block">Department Registrars</span>
                      <ul className="space-y-1.5 text-[11px] text-slate-600">
                        <li>🎓 <strong>Principal Desk:</strong> principal@janakpurcollege.com</li>
                        <li>🌱 <strong>Dean of Agri Science:</strong> Dr. R. K. Yadav (yadav.agri@janakpurcollege.com)</li>
                        <li>💻 <strong>Department Head of BIT:</strong> Prof. H. O. Yadav (hariom.it@janakpurcollege.com)</li>
                      </ul>
                    </div>
                  </div>

                  {/* Submission form */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4">
                    <span className="font-extrabold text-xs text-slate-700 block">💬 Dispatch Direct Academic Query</span>
                    
                    {inquirySuccess ? (
                      <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs space-y-2 text-center border border-emerald-100">
                        <span className="font-bold block text-center">✓ Message Dispatched Successfully!</span>
                        <p className="text-center">JCC Registrar will review your request and contact you at your registered email <strong>{student.email}</strong> within 24 working hours.</p>
                        <button 
                          onClick={() => { setInquirySuccess(false); setInquiryMsg(""); }}
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold mt-1 inline-block cursor-pointer mx-auto"
                        >
                          Send Another Query
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3.5 text-xs text-left">
                        <div>
                          <label className="font-bold text-slate-500 block mb-1">Your Registered Name</label>
                          <input 
                            type="text"
                            value={inquiryName}
                            onChange={(e) => setInquiryName(e.target.value)}
                            className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-indigo-500"
                            placeholder="Full Name"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-500 block mb-1">Detailed Query / Message</label>
                          <textarea 
                            value={inquiryMsg}
                            onChange={(e) => setInquiryMsg(e.target.value)}
                            rows={4}
                            className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-indigo-500 text-xs"
                            placeholder="Type your questions regarding enrollment, hostel facilities, or syllabus criteria here..."
                          />
                        </div>

                        <button
                          onClick={() => {
                            if (!inquiryMsg.trim()) return alert("Please type your inquiry message first.");
                            setInquirySuccess(true);
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl cursor-pointer flex items-center justify-center space-x-1.5 transition-all shadow"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Message to JCC Registrar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Top Welcome Banner for Janakpur Community College */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-700 p-5 rounded-2xl shadow-md border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <div className="flex items-center space-x-3 text-left">
          <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 shrink-0">
            <Building className="w-6 h-6 text-emerald-300 animate-pulse" />
          </div>
          <div>
            <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-emerald-400/20">Active Direct Admission Reward</span>
            <h4 className="font-extrabold text-base sm:text-lg mt-0.5">Welcome to Janakpur Community College (JCC)</h4>
            <p className="text-xs text-emerald-100/90 leading-tight">Your 35% Provincial Merit Reward is fully activated for Agriculture or BIT courses!</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowJccDashboard(true);
            setJccTab("PROFILE");
          }}
          className="bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-xs px-5 py-3 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg shrink-0"
        >
          <span>Enter JCC Student Dashboard & Portal</span>
          <ChevronRight className="w-4 h-4 text-emerald-700" />
        </button>
      </div>
      {/* Score and Result Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 px-3 py-1.5 rounded-full border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Award className="w-4 h-4" />
            <span>Assessment Complete!</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Excellent Job, {student.fullName}!
          </h2>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Your results have been processed and scored. Below is your recommended study stream and specific college connections suited for your performance.
          </p>
        </div>

        {/* Dynamic Score Ring */}
        <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/60 text-center shrink-0 min-w-[200px]">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Total Score</span>
          <div className="text-4xl font-extrabold text-indigo-400 tracking-tight">
            {quizResult.score} <span className="text-xs text-slate-400 font-normal">pts</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-left">
            <div>
              <span className="text-[10px] text-slate-400 block">Correct</span>
              <span className="text-xs font-bold text-slate-200">{quizResult.correctCount} / 15</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Speed Bonus</span>
              <span className="text-xs font-bold text-emerald-400">+{quizResult.speedBonus} pts</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Stream Recommendation Explanation */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Matching Core Recommendation</span>
            </div>

            <div className="space-y-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 block">
                {quizResult.recommendedStream === "BIT" ? "BIT / B.Sc. CSIT" : quizResult.recommendedStream}
              </span>
              <p className="text-sm text-slate-600 leading-relaxed">
                {quizResult.recommendationReason}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block mb-1">💡 How did we match you?</span>
              <li>Our heuristic parsed your +2 high-school background: <strong>{student.plusTwoStream}</strong></li>
              <li>You expressed active interest in: <strong>{(student.interestFields || []).join(", ")}</strong></li>
              <li>You correctly answered category specific quiz questions mapping directly to <strong>{quizResult.recommendedStream}</strong> logic.</li>
            </div>
          </motion.div>

          {/* Matched Colleges Integration */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center justify-between">
              <span>Recommended Colleges for You</span>
              <span className="text-xs font-medium text-slate-500">{quizResult.matchedColleges.length} matches</span>
            </h3>

            {quizResult.matchedColleges.length === 0 ? (
              <div className="bg-slate-50 p-6 rounded-2xl text-center border border-slate-200 text-slate-500 text-sm">
                No direct stream matches. View our full catalog in the Admin page.
              </div>
            ) : (
              <div className="space-y-4">
                {quizResult.matchedColleges.map((college, index) => {
                  const isJCC = college.id === "college-7";
                  return (
                    <motion.div
                      key={college.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-6 rounded-2xl border transition-all space-y-4 shadow-sm hover:shadow-md relative overflow-hidden ${
                        isJCC 
                          ? "bg-gradient-to-br from-indigo-50/20 via-white to-emerald-50/10 border-indigo-200" 
                          : "bg-white border-slate-200"
                      }`}
                    >
                      {isJCC && (
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                          <span>Featured Community Partner</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start space-x-3">
                          {/* College Logo Emblem */}
                          <div className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center border ${
                            isJCC 
                              ? "bg-gradient-to-br from-indigo-600 to-emerald-600 text-white border-indigo-400/30 shadow-md" 
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                            {isJCC ? (
                              <div className="flex flex-col items-center justify-center">
                                <div className="flex space-x-0.5">
                                  <Laptop className="w-3.5 h-3.5" />
                                  <Sprout className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[7px] font-black tracking-tighter mt-0.5 leading-none">JCC</span>
                              </div>
                            ) : (
                              <GraduationCap className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5 flex-wrap">
                              <span>{college.name}</span>
                              {isJCC && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                  Madhesh Province Leader
                                </span>
                              )}
                            </h4>
                            <div className="flex items-center space-x-1 text-slate-500 text-xs mt-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{college.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start flex-wrap">
                          <button
                            onClick={() => {
                              setSelectedCollegeProfile(college);
                              setModalTab("OVERVIEW");
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1 cursor-pointer shadow-sm shadow-indigo-200"
                          >
                            <span>Explore Features</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          
                          <a
                            href={college.website}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            <span>Visit Website</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {college.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 items-center justify-between">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Offered:</span>
                          {college.courses.map((course) => (
                            <span key={course} className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                              isJCC && (course.includes("Agri") || course === "BIT")
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                                : "bg-indigo-50 text-indigo-700"
                            }`}>
                              {course}
                            </span>
                          ))}
                        </div>
                        {isJCC && (
                          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50/60 px-2 py-0.5 rounded border border-indigo-100 flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-indigo-500" />
                            <span>Direct Admission Accredited</span>
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Referral System & AI report */}
        <div className="lg:col-span-5 space-y-6">
          {/* Referral Card */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 p-6 rounded-2xl shadow-sm space-y-4"
          >
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Gift className="w-5 h-5 text-amber-600" />
              <span>Gamified Referral Rewards</span>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">Your Invitation Link</h4>
              <p className="text-xs text-slate-600">
                Earn <strong>+5 points</strong> for every classmate who registers and completes this evaluation. Points unlock high rankings on our global leaderboard.
              </p>
            </div>

            {/* Refer code box */}
            <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-slate-600 truncate max-w-[200px] select-all">
                {referralLink}
              </span>
              <button
                onClick={handleCopyLink}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors shrink-0 cursor-pointer flex items-center space-x-1"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="bg-amber-100/60 p-3 rounded-xl border border-amber-200/40 text-[11px] text-amber-800 leading-normal">
              <strong>🔒 GDPR Privacy & anti-spam rule:</strong> Self-referral or generating mock registrations with identical phone structures is automatically flagged. We securely store your information and will never resell student data.
            </div>
          </motion.div>

          {/* AI Mentorship Letter Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>AI Career Mentor</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">Gemini 3.5</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Get an instant personalized academic analysis report prepared directly for you by our server-side AI Mentor, addressing your unique strengths.
            </p>

            {aiError && (
              <p className="text-xs text-rose-600 font-medium">
                {aiError}
              </p>
            )}

            {!aiReport && (
              <button
                onClick={generateAiReport}
                disabled={loadingAi}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loadingAi ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Consulting Mentor...</span>
                  </>
                ) : (
                  <>
                    <span>Generate AI Mentorship Letter</span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  </>
                )}
              </button>
            )}

            {loadingAi && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              </div>
            )}

            {aiReport && (
              <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100 max-h-[400px] overflow-y-auto space-y-1">
                {renderMarkdown(aiReport)}
              </div>
            )}
          </motion.div>

          {/* Action button */}
          <div className="pt-2 text-center">
            <button
              onClick={onRestart}
              className="text-slate-500 hover:text-slate-800 transition-colors text-xs font-semibold flex items-center justify-center space-x-1 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Evaluate Another Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic College Profile Explorer Modal */}
      {selectedCollegeProfile && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 relative">
              <button 
                onClick={() => setSelectedCollegeProfile(null)}
                className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 pr-8">
                <div className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-emerald-400/30">
                  <span>Accredited Academic Profile</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">{selectedCollegeProfile.name}</h3>
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedCollegeProfile.location}</span>
                  <span>|</span>
                  <Globe className="w-3.5 h-3.5" />
                  <a href={selectedCollegeProfile.website} target="_blank" rel="noreferrer" className="underline hover:text-indigo-200">{selectedCollegeProfile.website}</a>
                </div>
              </div>
            </div>

            {/* Tabs Selector */}
            <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto">
              {[
                { id: "OVERVIEW", label: "Campus Overview", icon: Building },
                { id: "AGRICULTURE", label: "Agriculture Studies", icon: Sprout },
                { id: "BIT", label: "BIT & IT Department", icon: Laptop },
                { id: "ADMISSIONS", label: "Admission & Aid", icon: GraduationCap }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = modalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      isActive 
                        ? "border-indigo-600 text-indigo-600 bg-white" 
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-grow space-y-6 max-h-[55vh]">
              {modalTab === "OVERVIEW" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">About the Institution</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {selectedCollegeProfile.id === "college-7" 
                        ? "Janakpur Community College (JCC) is a premium community-driven academic center situated in Dhanusha district of Madhesh Province. Established to deliver world-class applied education, JCC operates a cooperative model to ensure the highest standards of engineering, technological education, and agricultural science remain affordable for the community." 
                        : `${selectedCollegeProfile.name} is dedicated to foster premium professional skills, career placement, and community values across its targeted regions.`
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                      <span className="font-extrabold text-xs text-slate-700 block">🏛️ Campus Infrastructure</span>
                      <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                        <li>Fibre-Optic connected high speed computer centers</li>
                        <li>Equipped biological labs & seedling incubation rooms</li>
                        <li>Comprehensive modern book depository & digital e-library</li>
                        <li>Spacious digital classrooms with hybrid smart-boards</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                      <span className="font-extrabold text-xs text-slate-700 block">🌟 Student & Career Life</span>
                      <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                        <li>Active tech/agri student-led innovation clubs</li>
                        <li>Mandatory internship modules with industry partners</li>
                        <li>Annual National Youth Agro-Tech Hackathon host</li>
                        <li>Extensive sports grounds & community outreach initiatives</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>Contact Admissions: <strong>+977-41-520XXX</strong></span>
                      <span className="text-slate-300">|</span>
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span><strong>admissions@jcc.edu.np</strong></span>
                    </div>
                    <a 
                      href={selectedCollegeProfile.website} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center space-x-1 cursor-pointer shadow"
                    >
                      <span>Apply Online</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {modalTab === "AGRICULTURE" && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <Sprout className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <h5 className="font-bold text-emerald-800 text-sm">Department of Agricultural Sciences & Technology</h5>
                      <p className="text-emerald-700 leading-relaxed">
                        Offering <strong>B.Sc. Agriculture (Hons)</strong>. This flagship course is designed to empower students with cutting-edge agrarian techniques, scientific crop breeding, pest biology, and sustainable organic farming model applications.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Department Features & Facilities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="border border-slate-150 p-3 rounded-xl">
                        <span className="font-bold text-xs text-indigo-900 block mb-1">Soil Testing Labs</span>
                        <p className="text-[11px] text-slate-500 leading-normal">Full chemical testing suite for macronutrient balance, soil health auditing, and custom composting advice.</p>
                      </div>
                      <div className="border border-slate-150 p-3 rounded-xl">
                        <span className="font-bold text-xs text-indigo-900 block mb-1">Smart Greenhouses</span>
                        <p className="text-[11px] text-slate-500 leading-normal">Automated microclimate simulators optimizing temperature, water drip delivery, and photoperiod logs.</p>
                      </div>
                      <div className="border border-slate-150 p-3 rounded-xl">
                        <span className="font-bold text-xs text-indigo-900 block mb-1">Organic Farm Plots</span>
                        <p className="text-[11px] text-slate-500 leading-normal">Over 3 acres of on-campus research land practicing organic polyculture, vermicomposting, and seed saving.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="font-extrabold text-xs text-slate-700 block">🎓 Key Career Pathways</span>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Graduates pursue roles as Government Agricultural Officers, Farm Management Consultants, Soil Scientists, Food Quality Inspectors, and Green Entrepreneurs founding high-yield agritech companies.
                    </p>
                  </div>
                </div>
              )}

              {modalTab === "BIT" && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                    <Laptop className="w-8 h-8 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <h5 className="font-bold text-indigo-800 text-sm">Department of Information Technology & Engineering</h5>
                      <p className="text-indigo-700 leading-relaxed">
                        Offering the <strong>Bachelor of Information Technology (BIT)</strong> curriculum. Focused on modern software engineering, cloud architecture, system design, databases, web applications, and artificial intelligence integration.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">IT Department Highlights</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="border border-slate-150 p-3 rounded-xl">
                        <span className="font-bold text-xs text-indigo-900 block mb-1">Tech Incubator</span>
                        <p className="text-[11px] text-slate-500 leading-normal">On-campus sandbox providing seed mentorship and high-performance server clusters for student software projects.</p>
                      </div>
                      <div className="border border-slate-150 p-3 rounded-xl">
                        <span className="font-bold text-xs text-indigo-900 block mb-1">Bootcamps & Guilds</span>
                        <p className="text-[11px] text-slate-500 leading-normal">Student-led peer programming guilds conducting weekly workshops on React, Node.js, Python, and cloud APIs.</p>
                      </div>
                      <div className="border border-slate-150 p-3 rounded-xl">
                        <span className="font-bold text-xs text-indigo-900 block mb-1">Industry Internships</span>
                        <p className="text-[11px] text-slate-500 leading-normal">Guaranteed placement interviews and projects with Kathmandu-based tech leaders and international banks.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <span className="font-extrabold text-xs text-slate-700 block">💻 Key Technical Domains Covered</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {["Full-Stack Web Dev", "Relational & NoSQL Systems", "Cloud Administration", "Cybersecurity Essentials", "AI & Machine Learning"].map(tag => (
                        <span key={tag} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {modalTab === "ADMISSIONS" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2.5">
                      <h4 className="font-extrabold text-slate-800 uppercase tracking-wider">Admission Requirements</h4>
                      <div className="space-y-1.5 text-slate-600">
                        <div className="flex items-start space-x-1.5">
                          <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          <span>Minimum GPA of 2.0 in standard +2 Highschool (Science, Management, or Agriculture).</span>
                        </div>
                        <div className="flex items-start space-x-1.5">
                          <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          <span>Must complete the national or provincial DirectAdmission Aptitude Assessment test successfully.</span>
                        </div>
                        <div className="flex items-start space-x-1.5">
                          <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          <span>Original transcript copies, recommendations, and character certificates.</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <h4 className="font-extrabold text-slate-800 uppercase tracking-wider">Community Aid & Scholarships</h4>
                      <div className="space-y-1.5 text-slate-600">
                        <div className="flex items-start space-x-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>35% Seats Reserved</strong> for local meritorious community students of Madhesh Province.</span>
                        </div>
                        <div className="flex items-start space-x-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>STEM Empowerment</strong> 50% tuition waiver for female students enrolling in BIT & technical tracks.</span>
                        </div>
                        <div className="flex items-start space-x-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Agro-Industry Incentives</strong> special grants covering cost-of-books for children of certified farming families.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-indigo-950 space-y-1">
                    <span className="font-extrabold text-xs block">✨ Active Direct Admission Partnership:</span>
                    <p className="leading-relaxed">
                      By scoring a total score of <strong>{quizResult.score} points</strong> in this evaluation game, you have fulfilled the primary screening phase! Click the button below to register your academic scores and initiate direct counseling with our registrar.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Official Registrar Partner: <strong>DirectAdmission Nepal</strong></span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedCollegeProfile(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  Close Profile
                </button>
                <a 
                  href={selectedCollegeProfile.website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-xl flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <span>Visit College Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Congratulatory Reward & Gmail Notification Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-indigo-100 flex flex-col my-auto"
          >
            {/* Top Banner Accent */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-300 via-emerald-200 to-indigo-900" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-3 bg-white/20 rounded-full border border-white/30 mb-3 shadow-inner">
                  <Award className="w-10 h-10 text-yellow-300 animate-bounce" />
                </div>
                <div className="inline-flex items-center space-x-1.5 bg-yellow-400 text-yellow-950 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-yellow-300 tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>35% MERIT SCHOLARSHIP REWARD ACTIVATED</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight font-sans">Congratulations, {student.fullName}!</h3>
                <p className="text-xs text-indigo-100 mt-1 max-w-sm">You have successfully qualified for the Direct Admission reward program.</p>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 space-y-5">
              {/* Gmail Inbox Notification Alert */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-4 rounded-2xl flex items-start space-x-3">
                <div className="p-2 bg-red-100 text-red-600 rounded-xl shrink-0">
                  <Mail className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-red-700 tracking-wider uppercase block">GMAIL VERIFICATION SENT</span>
                  <h4 className="font-bold text-slate-800 text-xs">Official Reward Package Dispatched</h4>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    We have sent detailed registration info, scholarship certificates, and counselor assignment schedules to your verified Gmail:
                  </p>
                  <p className="font-mono text-[11px] font-bold text-indigo-900 select-all bg-indigo-50/50 px-2 py-1 rounded border border-indigo-100 inline-block mt-1">
                    {student.email}
                  </p>
                </div>
              </div>

              {/* Reward Breakdown Box */}
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-3">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Your Merit Assessment Profile</span>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-150">
                    <span className="text-[10px] text-slate-400 block">Assessment Score</span>
                    <span className="font-bold text-indigo-600 text-sm">{quizResult.score} points</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-150">
                    <span className="text-[10px] text-slate-400 block">Stream Major</span>
                    <span className="font-bold text-emerald-600 text-sm">
                      {quizResult.recommendedStream === "BIT" ? "B.I.T. (Tech)" : "Agriculture Science"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 text-slate-600 text-[11px] leading-relaxed">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Tuition Discount:</strong> Guaranteed 35% discount for full program cycle.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Campus Entry:</strong> Direct counseling fast-track without entrance exams.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>Lab Clearance:</strong> Pre-allocated seat in BIT Sandbox & Soil pH Simulator Labs.</span>
                  </div>
                </div>
              </div>

              {/* Warning/Assurance Policy */}
              <div className="text-[10px] text-slate-400 leading-normal flex items-start space-x-1">
                <span className="text-amber-500">⚠️</span>
                <span>Please check your Spam or Promotions folder in Gmail if you do not see the JCC Registrar Admissions team's email within the next 3 minutes.</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setShowRewardModal(false);
                  setShowJccDashboard(false);
                }}
                className="w-full sm:w-1/3 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-center"
              >
                View Matches
              </button>
              <button
                onClick={() => {
                  setShowRewardModal(false);
                  setShowJccDashboard(true);
                  setJccTab("PROFILE");
                }}
                className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-100 transition-all cursor-pointer"
              >
                <span>Enter JCC Student Dashboard & Portal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
