import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Lock, LayoutDashboard, Users, GraduationCap, HelpCircle, Gift, Download,
  Plus, Edit, Trash2, X, Check, Eye, HelpCircle as HelpIcon, Sparkles, LogOut
} from "lucide-react";
import { Student, College, Question, ReferralHistory, AdminStats } from "../types";

interface AdminDashboardProps {
  onBackToPortal: () => void;
}

export default function AdminDashboard({ onBackToPortal }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"STATS" | "STUDENTS" | "COLLEGES" | "QUESTIONS" | "REFERRALS">("STATS");

  // Admin Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [referrals, setReferrals] = useState<ReferralHistory[]>([]);

  // Search filter states
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // CRUD Modal states for College
  const [collegeModalOpen, setCollegeModalOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [colName, setColName] = useState("");
  const [colLocation, setColLocation] = useState("");
  const [colCourses, setColCourses] = useState("");
  const [colWebsite, setColWebsite] = useState("");
  const [colDescription, setColDescription] = useState("");
  const [colStreamTags, setColStreamTags] = useState("");

  // CRUD Modal states for Question
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [qText, setQText] = useState("");
  const [qOptA, setQOptA] = useState("");
  const [qOptB, setQOptB] = useState("");
  const [qOptC, setQOptC] = useState("");
  const [qOptD, setQOptD] = useState("");
  const [qAnswer, setQAnswer] = useState("");
  const [qCategory, setQCategory] = useState<"GENERAL_KNOWLEDGE" | "COMPUTER_SCIENCE" | "SCIENCE_MATH">("GENERAL_KNOWLEDGE");
  const [qExplanation, setQExplanation] = useState("");

  const [operationMsg, setOperationMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const resText = await res.text();
      let data: any;
      try {
        data = JSON.parse(resText);
      } catch (parseErr) {
        if (!res.ok) {
          throw new Error(`Server error (${res.status}): Could not connect to admin portal.`);
        } else {
          throw new Error("Invalid response format received from server.");
        }
      }
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      setAuthToken(data.token);
      setIsAuthenticated(true);
    } catch (err: any) {
      setLoginError(err.message || "Invalid Admin username or password.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken("");
    setUsername("");
    setPassword("");
  };

  // Fetch all management data once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadAdminData() {
      const headers = { Authorization: `Bearer ${authToken}` };

      try {
        // Fetch Stats
        const statsRes = await fetch("/api/admin/stats", { headers });
        if (statsRes.ok) setStats(await statsRes.json());

        // Fetch Students
        const studRes = await fetch("/api/admin/students", { headers });
        if (studRes.ok) setStudents(await studRes.json());

        // Fetch Colleges
        const colRes = await fetch("/api/colleges");
        if (colRes.ok) setColleges(await colRes.json());

        // Fetch Questions
        const qRes = await fetch("/api/questions");
        if (qRes.ok) setQuestions(await qRes.json());

        // Fetch Referrals
        const refRes = await fetch("/api/admin/referrals", { headers });
        if (refRes.ok) setReferrals(await refRes.json());
      } catch (e) {
        console.error("Failed to load admin management logs", e);
      }
    }

    loadAdminData();
  }, [isAuthenticated, authToken, operationMsg]);

  // Export CSV Handler
  const handleExportCSV = () => {
    window.open(`/api/admin/export-csv?token=${authToken}`);
  };

  // COLLEGE CRUD OPERATIONS
  const openAddCollege = () => {
    setEditingCollege(null);
    setColName("");
    setColLocation("");
    setColCourses("");
    setColWebsite("");
    setColDescription("");
    setColStreamTags("");
    setCollegeModalOpen(true);
  };

  const openEditCollege = (col: College) => {
    setEditingCollege(col);
    setColName(col.name);
    setColLocation(col.location);
    setColCourses(col.courses.join(", "));
    setColWebsite(col.website);
    setColDescription(col.description);
    setColStreamTags(col.streamTags.join(", "));
    setCollegeModalOpen(true);
  };

  const saveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName || !colCourses || !colWebsite) return;

    const payload = {
      name: colName,
      location: colLocation,
      courses: colCourses.split(",").map((s) => s.trim()),
      website: colWebsite,
      description: colDescription,
      streamTags: colStreamTags.split(",").map((s) => s.trim())
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    };

    try {
      let res;
      if (editingCollege) {
        res = await fetch(`/api/colleges/${editingCollege.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("/api/colleges", {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setOperationMsg(`College saved at ${Date.now()}`);
        setCollegeModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCollege = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this college registration?")) return;
    try {
      const res = await fetch(`/api/colleges/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        setOperationMsg(`College deleted at ${Date.now()}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // QUESTIONS CRUD OPERATIONS
  const openAddQuestion = () => {
    setEditingQuestion(null);
    setQText("");
    setQOptA("");
    setQOptB("");
    setQOptC("");
    setQOptD("");
    setQAnswer("");
    setQCategory("GENERAL_KNOWLEDGE");
    setQExplanation("");
    setQuestionModalOpen(true);
  };

  const openEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setQText(q.text);
    setQOptA(q.options[0] || "");
    setQOptB(q.options[1] || "");
    setQOptC(q.options[2] || "");
    setQOptD(q.options[3] || "");
    setQAnswer(q.answer);
    setQCategory(q.category);
    setQExplanation(q.explanation || "");
    setQuestionModalOpen(true);
  };

  const saveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText || !qOptA || !qOptB || !qAnswer) return;

    const payload = {
      id: editingQuestion ? editingQuestion.id : undefined,
      text: qText,
      options: [qOptA, qOptB, qOptC, qOptD].filter((o) => o !== ""),
      answer: qAnswer,
      category: qCategory,
      explanation: qExplanation
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    };

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setOperationMsg(`Question saved at ${Date.now()}`);
        setQuestionModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteQuestion = async (id: number) => {
    if (!window.confirm("Delete this question from game pool?")) return;
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        setOperationMsg(`Question deleted at ${Date.now()}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ---------------------- LOGIN SCREEN ----------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <span className="p-3 bg-rose-50 rounded-xl border border-rose-100 inline-block text-rose-600">
            <Lock className="w-6 h-6" />
          </span>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Admin Portal Gate</h2>
          <p className="text-xs text-slate-500">
            For college representatives and program administrators. Manage colleges, review test statistics, and export registered students list.
          </p>
        </div>

        {loginError && (
          <div className="bg-rose-50 text-rose-700 text-xs px-3.5 py-2.5 border border-rose-200 rounded-lg">
            {loginError}
          </div>
        )}

        {/* Demo Credentials Notice */}
        <div className="bg-amber-50 text-amber-800 text-xs p-3.5 rounded-xl border border-amber-200 space-y-1">
          <span className="font-bold">🔐 Demo Access Credentials:</span>
          <div className="font-mono text-[11px] grid grid-cols-2">
            <span>Username: <strong>admin</strong></span>
            <span>Password: <strong>admin123</strong></span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Username</label>
            <input
              type="text"
              required
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3 rounded-xl transition-all shadow cursor-pointer"
          >
            Authenticate Admin
          </button>
        </form>

        <div className="text-center pt-2">
          <button onClick={onBackToPortal} className="text-xs text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
            ← Return to Admission Portal
          </button>
        </div>
      </div>
    );
  }

  // Filter students
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.phone.includes(studentSearch)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
      {/* Admin Navigation Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span className="p-1 bg-indigo-500/25 rounded border border-indigo-400/40 text-indigo-300 text-xs uppercase font-extrabold tracking-widest">
              Control Panel
            </span>
            <span className="text-xs text-slate-400">Authenticated Session</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Smart Admission System</h2>
        </div>

        {/* Global actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onBackToPortal}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Portal View
          </button>
          <button
            onClick={handleLogout}
            className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
            title="Log Out Session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dashboard Subtabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-1.5 scrollbar-thin">
        {[
          { id: "STATS", label: "Overview Stats", icon: LayoutDashboard },
          { id: "STUDENTS", label: "Student Registers", icon: Users },
          { id: "COLLEGES", label: "Colleges CRUD", icon: GraduationCap },
          { id: "QUESTIONS", label: "Quiz Questions", icon: HelpCircle },
          { id: "REFERRALS", label: "Referral Loops", icon: Gift }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedStudent(null);
              }}
              className={`flex items-center space-x-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-slate-900 border-slate-900 text-white shadow"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: STATS */}
      {activeTab === "STATS" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">Total Users Registered</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-1 block">{stats.totalUsers}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">Evaluations Completed</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-1 block">{stats.quizCompletedCount}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">Stream Selected (Most Selected)</span>
              <span className="text-lg font-extrabold text-slate-800 mt-2 block truncate">
                {Object.entries(stats.streamCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || "None"}
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">Referral Connections</span>
              <span className="text-3xl font-extrabold text-indigo-600 mt-1 block">{stats.totalReferralsCount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Scores */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Top Evaluation Scorers</span>
              </h3>
              <div className="divide-y divide-slate-100">
                {stats.topScores.map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-between py-2.5">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-slate-700 block">{s.fullName}</span>
                      <span className="text-[10px] text-slate-400">Stream recommendation: <strong>{s.recommendedStream}</strong></span>
                    </div>
                    <span className="text-sm font-extrabold text-indigo-600">{s.quizScore} pts</span>
                  </div>
                ))}
                {stats.topScores.length === 0 && (
                  <p className="text-xs text-slate-400 py-4">No completed evaluations found yet.</p>
                )}
              </div>
            </div>

            {/* Referral Leaderboard */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Gift className="w-4 h-4 text-amber-500" />
                <span>Referral Points Leaderboard</span>
              </h3>
              <div className="divide-y divide-slate-100">
                {stats.referralLeaderboard.map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-between py-2.5">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-slate-700 block">{s.fullName}</span>
                      <span className="text-[10px] text-slate-400">Referral Code: <strong className="font-mono">{s.referralCode}</strong></span>
                    </div>
                    <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-bold">
                      {s.referralPoints} pts
                    </span>
                  </div>
                ))}
                {stats.referralLeaderboard.length === 0 && (
                  <p className="text-xs text-slate-400 py-4">No active referral actions recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: STUDENTS */}
      {activeTab === "STUDENTS" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-extrabold uppercase text-slate-700 tracking-wider">Registered Student Roster</h3>
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:max-w-[280px] text-slate-800"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-bold">
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Highschool Stream</th>
                  <th className="p-3">Recomm. Stream</th>
                  <th className="p-3 text-center">Score</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 text-slate-700">
                    <td className="p-3 font-semibold">{s.fullName}</td>
                    <td className="p-3">
                      <div>{s.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s.phone}</div>
                    </td>
                    <td className="p-3 max-w-[120px] truncate">{s.address}</td>
                    <td className="p-3 font-medium text-slate-500">{s.plusTwoStream}</td>
                    <td className="p-3">
                      {s.recommendedStream ? (
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                          {s.recommendedStream}
                        </span>
                      ) : (
                        <span className="text-slate-400">Not Attempted</span>
                      )}
                    </td>
                    <td className="p-3 text-center font-bold text-indigo-600">
                      {s.quizScore !== null ? s.quizScore : "-"}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors font-bold flex items-center space-x-0.5 mx-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Diagnostics</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">No students matching search filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* DIAGNOSTIC MODAL DETAILS VIEW */}
          {selectedStudent && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-xl border border-slate-100">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h4 className="text-lg font-bold text-slate-800">Student Diagnostics File</h4>
                  <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[9px]">Full Name</span>
                    <span className="font-bold text-slate-800 text-sm block">{selectedStudent.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[9px]">Contact No.</span>
                    <span className="font-mono text-slate-800 block">{selectedStudent.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[9px]">Unique Referral Code</span>
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{selectedStudent.referralCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[9px]">Referred By</span>
                    <span className="text-slate-800 block font-medium">{selectedStudent.referredBy || "Organic Entry"}</span>
                  </div>
                </div>

                {selectedStudent.quizAnswers ? (
                  <div className="space-y-3">
                    <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-1">
                      Aptitude Game Responses ({selectedStudent.quizScore} points scored)
                    </h5>
                    <div className="space-y-3 max-h-[250px] overflow-y-auto">
                      {selectedStudent.quizAnswers.map((ans: any, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 space-y-1 text-xs">
                          <p className="font-semibold text-slate-800">Q{i + 1}: {ans.questionText}</p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/40">
                            <div>
                              <span className="text-slate-400">Student Answer:</span>{" "}
                              <strong className={ans.isCorrect ? "text-emerald-600" : "text-rose-600"}>
                                {ans.selected || "Unanswered"}
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400">Correct Answer:</span>{" "}
                              <strong className="text-emerald-600">{ans.correct}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-xs border border-amber-100">
                    Student has not played the Aptitude Game Quiz yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: COLLEGES CRUD */}
      {activeTab === "COLLEGES" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase text-slate-700 tracking-wider">Accredited College Catalog</h3>
            <button
              onClick={openAddCollege}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add College Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colleges.map((col) => (
              <div key={col.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-bold text-slate-800">{col.name}</h4>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{col.location}</span>
                  </div>
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => openEditCollege(col)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                      title="Edit College Card"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCollege(col.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="Delete College"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-normal max-h-[60px] overflow-y-auto">
                  {col.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {col.courses.map((course) => (
                    <span key={course} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* COLLEGE MODAL */}
          {collegeModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-100">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-800">
                    {editingCollege ? "Edit College Registry" : "Add College Registry"}
                  </h4>
                  <button onClick={() => setCollegeModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={saveCollege} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">College Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tribhuvan College"
                      value={colName}
                      onChange={(e) => setColName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Lalitpur, Nepal"
                        value={colLocation}
                        onChange={(e) => setColLocation(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Courses offered (comma-separated)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BIT, BBA, BBS"
                        value={colCourses}
                        onChange={(e) => setColCourses(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Website Address</label>
                      <input
                        type="url"
                        required
                        placeholder="e.g. https://college.edu.np"
                        value={colWebsite}
                        onChange={(e) => setColWebsite(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Stream Matching Tags (e.g. BIT, BBA, LAW)</label>
                      <input
                        type="text"
                        placeholder="e.g. BIT, BBA"
                        value={colStreamTags}
                        onChange={(e) => setColStreamTags(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">College Profile Description</label>
                    <textarea
                      placeholder="Add an engaging brochure summary for student matched matches..."
                      value={colDescription}
                      onChange={(e) => setColDescription(e.target.value)}
                      className="w-full h-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setCollegeModalOpen(false)}
                      className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer font-bold"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer">
                      Save College Card
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: QUESTIONS CRUD */}
      {activeTab === "QUESTIONS" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase text-slate-700 tracking-wider">Aptitude Question Database</h3>
            <button
              onClick={openAddQuestion}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question Node</span>
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-400">Node #{q.id}</span>
                    <span className="font-bold uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[9px]">{q.category}</span>
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">{q.text}</p>
                  <p className="text-slate-500 font-medium">Options: {q.options.join(" | ")}</p>
                  <p className="text-emerald-700 font-bold">Answer: {q.answer}</p>
                </div>

                <div className="flex flex-col space-y-1 justify-center">
                  <button
                    onClick={() => openEditQuestion(q)}
                    className="p-1 text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* QUESTION MODAL */}
          {questionModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-100">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h4 className="text-base font-bold text-slate-800">
                    {editingQuestion ? "Edit Question Node" : "Create Question Node"}
                  </h4>
                  <button onClick={() => setQuestionModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={saveQuestion} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Question Statement</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. What is the value of Pi to two decimals?"
                      value={qText}
                      onChange={(e) => setQText(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Option A</label>
                      <input
                        type="text"
                        required
                        placeholder="Option A"
                        value={qOptA}
                        onChange={(e) => setQOptA(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Option B</label>
                      <input
                        type="text"
                        required
                        placeholder="Option B"
                        value={qOptB}
                        onChange={(e) => setQOptB(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Option C</label>
                      <input
                        type="text"
                        placeholder="Option C"
                        value={qOptC}
                        onChange={(e) => setQOptC(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Option D</label>
                      <input
                        type="text"
                        placeholder="Option D"
                        value={qOptD}
                        onChange={(e) => setQOptD(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Correct Answer (Exact string match)</label>
                      <input
                        type="text"
                        required
                        placeholder="Must match one of the options"
                        value={qAnswer}
                        onChange={(e) => setQAnswer(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Category Tag</label>
                      <select
                        value={qCategory}
                        onChange={(e) => setQCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      >
                        <option value="GENERAL_KNOWLEDGE">General Knowledge</option>
                        <option value="COMPUTER_SCIENCE">Computer Science</option>
                        <option value="SCIENCE_MATH">Science & Mathematics</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Aptitude Explanation (Why is it correct?)</label>
                    <input
                      type="text"
                      placeholder="Add simple logical reasoning explainers..."
                      value={qExplanation}
                      onChange={(e) => setQExplanation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setQuestionModalOpen(false)}
                      className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer font-bold"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer">
                      Save Question Node
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: REFERRALS */}
      {activeTab === "REFERRALS" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase text-slate-700 tracking-wider">Referral Reward Audit logs</h3>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-bold">
                  <th className="p-3">Referrer Student</th>
                  <th className="p-3">Invited Register Name</th>
                  <th className="p-3">Invited Register Email</th>
                  <th className="p-3 text-center">Reward Score</th>
                  <th className="p-3 text-center">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-indigo-700">{ref.referrerName}</td>
                    <td className="p-3 font-medium">{ref.referredName}</td>
                    <td className="p-3 font-mono">{ref.referredEmail}</td>
                    <td className="p-3 text-center font-extrabold text-amber-600">+{ref.pointsEarned} points</td>
                    <td className="p-3 text-center text-slate-400">
                      {new Date(ref.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {referrals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">No active referral invite loops saved yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
