import React from "react";
import { motion } from "motion/react";
import { 
  History, Compass, Award, Quote, CheckCircle, ShieldCheck, 
  BookOpen, Heart, Building2, UserCheck
} from "lucide-react";

export default function AboutUs() {
  const values = [
    { title: "Empowering Minds", desc: "Developing academic depth and critical, independent thinking among provincial youth." },
    { title: "Building Futures", desc: "Providing vocational security, direct placements, and high-impact regional skills." },
    { title: "Inclusive Excellence", desc: "Ensuring top-tier tech and agri-science tools are accessible to every social sector of Nepal." }
  ];

  const messages = [
    {
      role: "Chairman's Address",
      name: "Er. Rameshwar Chaudhary",
      title: "Chairman, Governing Council",
      message: "At Janakpur Community College, we believe education is the primary catalyst for democratic transformation and regional growth. By establishing world-class labs in Madhesh Province, we ensure local students don't need to leave their hometowns to receive premium computer science and agronomy training. We welcome you to our digital campus.",
      imgInitials: "RC"
    },
    {
      role: "Principal's Message",
      name: "Dr. Binay Kumar Mishra",
      title: "Campus Principal & Academic Dean",
      message: "Our pedagogical structure merges technical rigor with hands-on practice. From soil chemistry to full-stack web applications, JCC students learn by active coding and crop cultivation. We prioritize NAAC-aligned educational quality parameters to ensure our degrees carry prestige across South Asia.",
      imgInitials: "BM"
    }
  ];

  const naacMetrics = [
    { criteria: "I. Curricular Aspects", status: "A+ Grade Compliant", details: "Adherence to industry-aligned BIT syllabus and precision agricultural diagnostic electives with annual feedback loops." },
    { criteria: "II. Teaching-Learning & Evaluation", status: "96.4% Score", details: "Real-time diagnostic quizzes, speed-bonus tracking parameters, and comprehensive student feedback audits." },
    { criteria: "III. Research, Innovations & Extension", status: "Active Incubators", details: "Integrated soil testing centers in Mahottari and JCC Software Sandbox hubs which have produced 14 commercial applications." },
    { criteria: "IV. Infrastructure & Learning Resources", status: "Premium Facility", details: "100-node server room, IoT hardware dev kit libraries, and 4 hectares of dedicated experimental organic agronomy fields." },
    { criteria: "V. Student Support & Progression", status: "A+ Rated", details: "Guaranteed 35% merit scholarships, career-matching assessments, and high-fidelity alumni network connections." }
  ];

  return (
    <div className="space-y-12">
      {/* Intro Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full border border-indigo-200">
          Who We Are
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight leading-none">
          Our History, Vision & Strategic Goals
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed font-sans">
          Janakpur Community College was founded with the singular objective of bridging the technical divide in Madhesh Province, providing highly specialized training in Computer Technology and Agricultural Sciences.
        </p>
      </section>

      {/* History, Mission, Vision Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Our Rich History</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Established in 2012 in the ancient, cultural city of Janakpurdham, JCC started as a community initiative to provide affordable technical degrees. Over the past decade, it has grown into an accredited premier college campus with modern, state-of-the-art laboratory infrastructures.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Our Mission</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            To deliver accessible, high-fidelity technical and vocational education that equips regional students with local and global job readiness, driving sustainable agricultural yields and secure computer software developments.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Our Vision</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            To be recognized as a national center of educational excellence, merging digital innovation with organic agricultural research, and nurturing ethical, high-performing scholars who lead the digital transformation of Nepal.
          </p>
        </div>
      </section>

      {/* Executive Leadership Messages */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">
            Messages from Our Leadership
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((msg, idx) => (
            <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4 relative">
              <span className="absolute top-4 right-4 text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-full">
                {msg.role}
              </span>
              
              <Quote className="w-8 h-8 text-indigo-200" />
              
              <p className="text-xs text-slate-600 leading-relaxed font-sans italic">
                "{msg.message}"
              </p>

              <div className="flex items-center space-x-3 pt-3 border-t border-slate-200">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 text-xs">
                  {msg.imgInitials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{msg.name}</h4>
                  <span className="text-[10px] text-slate-400 block">{msg.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* IQAC / NAAC Quality Compliance Reports */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-150 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                IQAC Quality Standard
              </span>
            </div>
            <h3 className="font-display font-black text-xl text-slate-950 tracking-tight">
              NAAC Accreditation Framework Status
            </h3>
          </div>
          <div className="bg-slate-900 text-white px-3.5 py-1.5 rounded-xl font-mono text-[10px] font-bold border border-slate-800 tracking-wider shrink-0 text-center">
            LAST REVIEW SCORE: 3.72 / 4.00 (A+ Grade)
          </div>
        </div>

        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
          Janakpur Community College maintains a dedicated Internal Quality Assurance Cell (IQAC). Our programs operate under standard university syllabus mappings, rigorous evaluations, and continuous industry feedbacks.
        </p>

        <div className="space-y-4 pt-2">
          {naacMetrics.map((met, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-150 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-3">
                <span className="font-bold text-xs text-slate-800 block">{met.criteria}</span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded inline-block mt-1 font-mono uppercase">
                  {met.status}
                </span>
              </div>
              <div className="md:col-span-9 text-xs text-slate-500 leading-normal">
                {met.details}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
