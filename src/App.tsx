import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  GraduationCap, Sparkles, Lock, ShieldCheck, HelpCircle, 
  Home, BookOpen, UserCheck, Users, Brain, Cpu, MessageSquare, Menu, X
} from "lucide-react";
import { Student, College } from "./types";
import RegistrationForm from "./components/RegistrationForm";
import QuizEngine from "./components/QuizEngine";
import ResultPortal from "./components/ResultPortal";
import AdminDashboard from "./components/AdminDashboard";
import UniversityHome from "./components/UniversityHome";
import AboutUs from "./components/AboutUs";
import ProgramsDepts from "./components/ProgramsDepts";
import OnlineAdmission from "./components/OnlineAdmission";
import PortalsHub from "./components/PortalsHub";
import AiAdvisor from "./components/AiAdvisor";
import JccLogo from "./components/JccLogo";

type NavigationState = "HOME" | "ABOUT" | "PROGRAMS" | "ADMISSIONS" | "PORTALS" | "QUIZ_PORTAL" | "AI_ADVISOR" | "ADMIN";
type QuizStep = "REGISTER" | "ACTIVE_QUIZ" | "RESULTS";

export default function App() {
  const [viewState, setViewState] = useState<NavigationState>("QUIZ_PORTAL");
  const [quizStep, setQuizStep] = useState<QuizStep>("REGISTER");
  
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    correctCount: number;
    speedBonus: number;
    recommendedStream: string;
    recommendationReason: string;
    matchedColleges: College[];
  } | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRegisterSuccess = (student: Student) => {
    setCurrentStudent(student);
    setQuizStep("ACTIVE_QUIZ");
  };

  const handleQuizComplete = (result: any) => {
    setQuizResult(result);
    setQuizStep("RESULTS");
  };

  const handleRestart = () => {
    setCurrentStudent(null);
    setQuizResult(null);
    setQuizStep("REGISTER");
    setViewState("QUIZ_PORTAL");
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col justify-between text-slate-800">
      {/* Global Navigation Header with Janakpur Community College Branding */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            onClick={() => setViewState("HOME")}
            className="cursor-pointer hover:opacity-95 select-none transition-opacity"
          >
            <JccLogo size={42} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: "HOME", label: "Home", icon: Home },
              { id: "ABOUT", label: "About JCC", icon: BookOpen },
              { id: "PROGRAMS", label: "Academics", icon: Cpu },
              { id: "ADMISSIONS", label: "Admissions Form", icon: UserCheck },
              { id: "PORTALS", label: "Portals Hub", icon: Users },
              { id: "QUIZ_PORTAL", label: "Scholarship Quiz", icon: Brain },
              { id: "AI_ADVISOR", label: "AI Counselor", icon: MessageSquare }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = viewState === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setViewState(item.id as NavigationState);
                    if (item.id === "QUIZ_PORTAL" && quizStep === "RESULTS") {
                      // Stay on results if they completed it
                    } else if (item.id === "QUIZ_PORTAL") {
                      setQuizStep("REGISTER");
                    }
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Admin Login & CTA triggers */}
          <div className="hidden lg:flex items-center space-x-3">
            {viewState !== "ADMIN" ? (
              <button
                onClick={() => setViewState("ADMIN")}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center space-x-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            ) : (
              <button
                onClick={() => setViewState("HOME")}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-indigo-200 transition-all cursor-pointer"
              >
                Exit Admin Panel
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden pt-4 pb-2 px-2 border-t border-slate-100 space-y-1 mt-3"
          >
            {[
              { id: "HOME", label: "Home", icon: Home },
              { id: "ABOUT", label: "About JCC", icon: BookOpen },
              { id: "PROGRAMS", label: "Academics", icon: Cpu },
              { id: "ADMISSIONS", label: "Admissions Form", icon: UserCheck },
              { id: "PORTALS", label: "Portals Hub", icon: Users },
              { id: "QUIZ_PORTAL", label: "Scholarship Quiz", icon: Brain },
              { id: "AI_ADVISOR", label: "AI Counselor", icon: MessageSquare }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = viewState === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setViewState(item.id as NavigationState);
                    if (item.id === "QUIZ_PORTAL" && quizStep === "RESULTS") {
                      // Keep result view
                    } else if (item.id === "QUIZ_PORTAL") {
                      setQuizStep("REGISTER");
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-100 mt-2">
              <button
                onClick={() => {
                  setViewState("ADMIN");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 rounded-xl"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Control Panel</span>
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content Router Body */}
      <main className="flex-grow py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {viewState === "HOME" && (
            <UniversityHome 
              onNavigateToPortal={() => {
                setViewState("QUIZ_PORTAL");
                setQuizStep("REGISTER");
              }}
              onNavigateToPrograms={() => setViewState("PROGRAMS")}
              onNavigateToAbout={() => setViewState("ABOUT")}
              onNavigateToAdmissions={() => setViewState("ADMISSIONS")}
            />
          )}

          {viewState === "ABOUT" && <AboutUs />}

          {viewState === "PROGRAMS" && <ProgramsDepts />}

          {viewState === "ADMISSIONS" && <OnlineAdmission />}

          {viewState === "PORTALS" && <PortalsHub />}

          {viewState === "AI_ADVISOR" && <AiAdvisor />}

          {viewState === "ADMIN" && (
            <AdminDashboard onBackToPortal={() => setViewState("HOME")} />
          )}

          {viewState === "QUIZ_PORTAL" && (
            <div className="space-y-4">
              {quizStep === "REGISTER" && (
                <RegistrationForm
                  onRegisterSuccess={handleRegisterSuccess}
                  onNavigateToAdmin={() => setViewState("ADMIN")}
                />
              )}

              {quizStep === "ACTIVE_QUIZ" && currentStudent && (
                <QuizEngine
                  student={currentStudent}
                  onQuizComplete={handleQuizComplete}
                />
              )}

              {quizStep === "RESULTS" && currentStudent && quizResult && (
                <ResultPortal
                  student={currentStudent}
                  quizResult={quizResult}
                  onRestart={handleRestart}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Global University Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-6 text-xs mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-left">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 opacity-95">
              <GraduationCap className="w-6 h-6 text-emerald-400" />
              <span className="font-display font-black text-sm text-white tracking-wider">JANAKPUR COMMUNITY COLLEGE</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Empowering students through premium vocational agronomy, biological research, and high-performance software engineering disciplines in Madhesh Province.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="font-black text-white text-xs block">Key Faculties</span>
            <ul className="space-y-1 text-slate-500 font-medium">
              <li className="hover:text-white transition-colors cursor-pointer">B.Sc. Agriculture (Hons)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Bachelor in Information Tech (BIT)</li>
              <li className="hover:text-white transition-colors cursor-pointer">BBA (Business Administration)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Law & BA LLB programs</li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-black text-white text-xs block">Helpful Resources</span>
            <ul className="space-y-1 text-slate-500 font-medium">
              <li onClick={() => setViewState("ABOUT")} className="hover:text-white transition-colors cursor-pointer">About Institution</li>
              <li onClick={() => setViewState("PORTALS")} className="hover:text-white transition-colors cursor-pointer">LMS Student Portal</li>
              <li onClick={() => setViewState("QUIZ_PORTAL")} className="hover:text-white transition-colors cursor-pointer">Direct Admission Quiz</li>
              <li onClick={() => setViewState("AI_ADVISOR")} className="hover:text-white transition-colors cursor-pointer">AI Counselor bot</li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <span className="font-black text-white text-xs block">Contact Information</span>
            <ul className="space-y-1 text-slate-500 font-medium leading-relaxed">
              <li>📍 Ramanand Chowk, Janakpur, Nepal</li>
              <li>📞 Phone: 041-591195</li>
              <li>✉️ Email: janakpurcollege@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 Janakpur Community College. Affiliated to Tribhuvan University. Fully Accredited Academic Partner.</p>
          <div className="flex space-x-4">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Guidelines</span>
            <span>|</span>
            <span className="hover:text-white transition-colors cursor-pointer">NAAC reports</span>
            <span>|</span>
            <span onClick={() => setViewState("ADMIN")} className="hover:text-white transition-colors cursor-pointer font-bold">Admin Console</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
