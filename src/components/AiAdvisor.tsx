import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, Send, Brain, HelpCircle, GraduationCap, 
  Leaf, Cpu, UserCheck, ChevronRight, MessageSquare
} from "lucide-react";

interface Message {
  sender: "user" | "advisor";
  text: string;
  time: string;
}

export default function AiAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "advisor",
      text: "Namaste! I am the Janakpur Community College AI Career Assistant. Ask me anything about our Bachelor in Information Technology (BIT) and B.Sc. Agriculture flagship courses, provincial job opportunities, or how our stream scholarship evaluation quiz works!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chips = [
    "What are the career prospects for BIT graduates in Nepal?",
    "Tell me about B.Sc. Agriculture farm laboratories at JCC",
    "How does the stream diagnostic quiz calculate scores?",
    "What is the phone contact or email for admissions?"
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Call dynamic or mock advisor response
    setTimeout(() => {
      let replyText = "";
      const lower = textToSend.toLowerCase();

      if (lower.includes("bit") || lower.includes("computer") || lower.includes("it") || lower.includes("technology")) {
        replyText = `**Bachelor in Information Technology (BIT) Career Insights:**
JCC's 4-year BIT program is carefully curated to build competitive full-stack developers.
- **Top Jobs**: Full-Stack Developer, Database Architect, Systems Administrator, and AgriTech Software Specialist.
- **Expected Starting Salary**: NRs. 60,000 to NRs. 150,000 per month locally in Nepal.
- **Syllabus Highlights**: High-speed DSA, C Programming, Internet of Things (IoT), and React/NextJS frameworks in our JCC Tech Sandbox.`;
      } else if (lower.includes("agriculture") || lower.includes("agri") || lower.includes("farming") || lower.includes("soil")) {
        replyText = `**B.Sc. Agriculture (Hons) Career Insights:**
Our agricultural science program merges modern biological technology with precision organic agronomy.
- **Top Jobs**: Provincial Agricultural Extension Officer, Soil Laboratory Scientist, Agri-Business Consultant, and Food Quality Auditor.
- **Special Exclusives**: Live experimental research farming acres in Janakpur and direct access to soil nutrient and chemical diagnostics tools.
- **Starting Salary**: NRs. 50,000 to NRs. 120,000 monthly, with massive scope in global NGO research.`;
      } else if (lower.includes("quiz") || lower.includes("scholarship") || lower.includes("evaluate") || lower.includes("score")) {
        replyText = `**JCC Stream Scholarship Evaluation:**
Every high school graduate gets an open challenge!
- **Structure**: 15 multiple-choice questions across G.K., Science, Computer, and Logic within a 5-minute window.
- **Points system**: +10 points for each correct answer plus speed bonuses for rapid completion times.
- **Rewards**: Perfect evaluations instantly lock a **35% Tuition Scholarship Coupon** sent via simulated email notifications!`;
      } else if (lower.includes("contact") || lower.includes("phone") || lower.includes("email") || lower.includes("location") || lower.includes("where")) {
        replyText = `**JCC Contact Information:**
We are ready to welcome you to our administrative office!
- **Location**: Ward No. 8, Ramanand Chowk, Janakpur, Nepal
- **Phone Hot-line**: 041-591195
- **Official Email**: janakpurcollege@gmail.com
- **Admissions Hours**: Sunday to Friday, 9:00 AM to 4:00 PM.`;
      } else {
        replyText = `Thank you for asking! Janakpur Community College is dedicated to providing high-fidelity, NAAC-aligned educational programs in Madhesh Province. We focus on B.Sc. Agriculture and BIT to ensure students achieve high-paying jobs in the software and agronomy sectors.

Feel free to ask more specifically about BIT, Agriculture labs, or the Admissions Quiz!`;
      }

      const advisorMsg: Message = {
        sender: "advisor",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, advisorMsg]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Informative Side Panel */}
      <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-indigo-600 shrink-0" />
          <h4 className="font-display font-black text-sm uppercase tracking-wider text-slate-800">
            AI Counseling Guidance
          </h4>
        </div>
        <p className="text-[11px] text-slate-500 leading-normal font-sans">
          Our specialized AI assistant is trained on Madhesh Provincial job demand indexes, Tribhuvan University course syllabi, and JCC academic laboratory offerings.
        </p>

        <div className="space-y-3 pt-3 border-t border-slate-200">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Recommended Topics</span>
          <div className="space-y-2">
            {[
              { label: "BIT Software Careers", icon: Cpu },
              { label: "B.Sc. Agriculture Research", icon: Leaf },
              { label: "Merit-Based Evaluation FAQ", icon: GraduationCap }
            ].map((topic, i) => {
              const Icon = topic.icon;
              return (
                <div key={i} className="flex items-center space-x-2 text-xs text-slate-600">
                  <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium">{topic.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Chat Box */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm flex flex-col justify-between h-[520px]">
        {/* Chat Thread */}
        <div className="flex-grow overflow-y-auto pr-2 space-y-4 max-h-[360px] pb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col max-w-[85%] ${
                msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <div className="flex items-center space-x-1 mb-1">
                <span className="text-[9px] font-bold text-slate-400 font-mono">
                  {msg.sender === "user" ? "You" : "JCC Advisor"} • {msg.time}
                </span>
              </div>
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                  : "bg-slate-100 text-slate-800 rounded-tl-none font-sans"
              }`}>
                {/* Simulated Markdown renderer for bullets and bold */}
                {msg.text.split("\n").map((line, lIdx) => {
                  if (line.startsWith("- ")) {
                    return <li key={lIdx} className="ml-3 mt-1 list-disc">{line.replace("- ", "")}</li>;
                  }
                  if (line.startsWith("**")) {
                    return <strong key={lIdx} className="block font-bold mt-1.5 mb-0.5">{line.replace(/\*\*/g, "")}</strong>;
                  }
                  return <p key={lIdx} className="mt-0.5">{line}</p>;
                })}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 mr-auto bg-slate-100 px-4 py-2.5 rounded-2xl rounded-tl-none text-xs text-slate-500 font-medium">
              <RefreshLoader />
              <span>Analyzing curriculum indexes...</span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Action Suggestion chips */}
        <div className="border-t border-slate-100 pt-3 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-full px-3 py-1.5 transition-all cursor-pointer truncate max-w-full"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center space-x-2 pt-2 border-t border-slate-100"
        >
          <input
            type="text"
            placeholder="Type your academic or stream questions here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow text-xs px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800"
          />
          <button
            type="submit"
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function RefreshLoader() {
  return (
    <svg className="animate-spin h-3.5 w-3.5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
