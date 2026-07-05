import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, GraduationCap, ArrowRight, Award, Calendar, Bell, 
  MapPin, CheckCircle, Flame, Users, Search, QrCode, Smartphone,
  BookOpen, HeartHandshake, HelpCircle, ArrowUpRight
} from "lucide-react";
import JccLogo from "./JccLogo";

interface UniversityHomeProps {
  onNavigateToPortal: () => void;
  onNavigateToPrograms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToAdmissions: () => void;
}

export default function UniversityHome({
  onNavigateToPortal,
  onNavigateToPrograms,
  onNavigateToAbout,
  onNavigateToAdmissions
}: UniversityHomeProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [qrScanning, setQrScanning] = useState(false);
  const [qrScannedSuccess, setQrScannedSuccess] = useState(false);

  const stats = [
    { value: "15+", label: "Academic Programs", color: "text-blue-600" },
    { value: "94%", label: "Placement Success Rate", color: "text-emerald-600" },
    { value: "4000+", label: "Enrolled Tech & Agri Scholars", color: "text-indigo-600" },
    { value: "NRs 2.5M+", label: "Merit Scholarships Disbursed", color: "text-amber-500" },
  ];

  const flagshipPrograms = [
    {
      title: "B.Sc. Agriculture (Hons)",
      tag: "Flagship Program",
      desc: "An intensive 4-year curriculum merging agrarian sciences with precision biotechnology, organic farming, soil diagnostics, and modern farm management.",
      features: ["Soil chemistry lab clearances", "Madhesh Agro-incubation fields", "Pre-allocated seedbeds"],
      color: "border-emerald-200 bg-emerald-50/40 text-emerald-800"
    },
    {
      title: "Bachelor in Information Tech (BIT)",
      tag: "Flagship Program",
      desc: "A modern 4-year tech course providing mastery in full-stack engineering, cloud architecture, machine learning, and Nepalese digital infrastructure.",
      features: ["JCC Sandbox Hackathons", "Pre-installed IoT dev boards", "Direct tech company internships"],
      color: "border-blue-200 bg-blue-50/40 text-blue-800"
    }
  ];

  const notices = [
    { date: "July 08, 2026", title: "Direct Stream Evaluation Quiz Competition Open for SEE & +2 Graduates", label: "Urgent", type: "academic" },
    { date: "July 12, 2026", title: "Merit-Based Scholarship Allocation Matrix Released for BIT Program", label: "Scholarship", type: "financial" },
    { date: "July 15, 2026", title: "B.Sc. Agriculture Soil Chemistry Laboratory Sandbox Inauguration", label: "Event", type: "campus" },
  ];

  const events = [
    {
      date: "JUL 20",
      day: "Monday",
      time: "10:00 AM - 3:00 PM",
      title: "Madhesh Provincial AgriTech and Soil pH Solutions Summit",
      location: "JCC Green Dome Auditorium"
    },
    {
      date: "JUL 25",
      day: "Saturday",
      time: "11:00 AM - 4:00 PM",
      title: "Silicon Nepal & JCC Student Software Engineering Expo 2026",
      location: "BIT Sandbox Wing, JCC Campus"
    }
  ];

  const alumniSuccess = [
    {
      name: "Sandeep Chaudhary",
      degree: "BIT Grad (2024)",
      role: "Lead Software Architect at Nepal Telecom",
      quote: "The heavy engineering labs at JCC Janakpur gave me hands-on confidence. Winning the college stream quiz was my first step to a full scholarship."
    },
    {
      name: "Manisha Mahato",
      degree: "B.Sc. Ag Grad (2023)",
      role: "Founder, Janakpur Organic Soil Health Consultancy",
      quote: "JCC's intensive agricultural fields are real, not just textbook theory. We analyzed real soil samples from Mahottari and Dhanusha districts."
    }
  ];

  const faqs = [
    {
      q: "What is the Smart Stream Evaluation & Quiz Portal?",
      a: "It is a gamified entry portal built for high school (+2) graduates. By filling out your basic profiles and attempting a timed 15-question diagnostic quiz across G.K., Science, Math, and Tech, our AI engine dynamically maps your talents to JCC courses (like BIT or Agriculture) and instantly issues a 35% Merit Scholarship certificate!"
    },
    {
      q: "How does the Smart QR Advertisement System work?",
      a: "Every official JCC marketing banner or school poster has an integrated QR code. When students scan this QR code using their phones, they are instantly bypassed to the Smart Admission Quiz page, bypassing tedious manual search screens."
    },
    {
      q: "Are BIT and B.Sc. Agriculture accredited at JCC?",
      a: "Absolutely. JCC is Tribhuvan University / Purbanchal University affiliated, fully accredited, and incorporates NAAC quality standards. It is Madhesh Province's highest-ranking college campus."
    },
    {
      q: "How does the student referral program reward points?",
      a: "Every registered student receives a custom referral link (e.g. ?ref=XYZ). When friends register and complete their aptitude tests using that link, the original student earns +5 points, making them eligible for premium JCC merchandise and priority counseling seats."
    }
  ];

  const handleQrScanSimulation = () => {
    setQrScanning(true);
    setTimeout(() => {
      setQrScanning(false);
      setQrScannedSuccess(true);
      setTimeout(() => {
        setQrScannedSuccess(false);
        onNavigateToPortal();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="space-y-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] rounded-3xl text-white p-8 sm:p-12 md:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/45 via-transparent to-transparent pointer-events-none" />
        
        {/* Neon Accent Mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-slow-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" style={{ animationDelay: "3s" }} />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ADMISSIONS OPEN FOR ACADEMIC YEAR 2026/2027</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-none">
            Empowering Minds, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-blue-400">
              Building Futures
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
            Welcome to Janakpur Community College, the leading technical and agricultural institution in Madhesh Province, Janakpur, Nepal. We shape leaders through world-class B.Sc. Agriculture and BIT programs backed by digital sandbox laboratories and live research farms.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onNavigateToPortal}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-950/40 hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Smart Admission Quiz Challenge</span>
              <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
            </button>
            <button
              onClick={onNavigateToPrograms}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>Explore flagship Streams</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Counter Widget on Hero bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <span className={`text-xl sm:text-2xl font-black font-display tracking-tight text-white`}>
                {stat.value}
              </span>
              <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* College Flagship Programs */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
            Our Key Faculties
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 tracking-tight">
            Flagship Academic Programs
          </h2>
          <p className="text-xs text-slate-500 leading-normal">
            Janakpur Community College focuses heavily on high-demand vocational fields that drive commercial expansion across Madhesh Province and Nepal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flagshipPrograms.map((prog, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 shadow-sm transition-all hover:shadow-md ${prog.color}`}
            >
              <div className="space-y-3">
                <div className="inline-block bg-white text-slate-800 border border-slate-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                  {prog.tag}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  {prog.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {prog.desc}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Program Exclusives</span>
                <div className="space-y-1.5">
                  {prog.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-2 text-xs text-slate-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/50 flex justify-between items-center">
                <button
                  onClick={onNavigateToAdmissions}
                  className="text-xs font-bold text-slate-800 hover:text-indigo-600 flex items-center space-x-1"
                >
                  <span>Apply Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/60 px-2 py-0.5 rounded border border-slate-150">
                  4-Years Course
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Smart QR Code Scanner Poster */}
      <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-yellow-400 text-yellow-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
            <QrCode className="w-3.5 h-3.5" />
            <span>MOCK SMART QR ADV SYSTEM</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-display font-black tracking-tight leading-snug">
            Scanning poster ads redirects students automatically to the Smart Admission Portal
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            In Janakpur Community College's physical campus expansion, every poster distributed at SEE centers, +2 high schools, and local newspapers has a unique JCC Smart QR code. When students scan this QR code, they instantly jump into the gamified scholarship challenge without searching online.
          </p>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
            <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-wider block">Interactive Demonstration:</span>
            <p className="text-slate-400 leading-normal text-[11px]">
              Simulate scanning the college brochure QR advertisement code using our virtual scanner to bypass registration setup!
            </p>
            <button
              onClick={handleQrScanSimulation}
              disabled={qrScanning}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
            >
              <Smartphone className="w-4 h-4 text-indigo-200 animate-bounce" />
              <span>{qrScanning ? "Interpreting QR Payload..." : "Click to Scan JCC Advert QR"}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center relative">
          {/* Mock Brochure / Poster Banner */}
          <div className="bg-white text-slate-900 rounded-2xl p-5 w-full max-w-[280px] shadow-2xl border-4 border-slate-800 flex flex-col items-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] rotate-45 translate-x-5 -translate-y-2 shadow-md">
              FREE
            </div>

            <div className="flex items-center space-x-1">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span className="font-extrabold text-[11px] tracking-tight text-slate-800">JCC ADMISSIONS</span>
            </div>

            <p className="text-center font-black text-xs text-slate-800 tracking-tight leading-tight uppercase">
              SCAN QR CODE FOR <br />
              <span className="text-emerald-600">35% MERIT SCHOLARSHIP</span>
            </p>

            {/* QR Canvas with target overlay */}
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 relative group shrink-0">
              {/* Virtual Scanner Target Lines */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-indigo-600" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-indigo-600" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-indigo-600" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-indigo-600" />
              
              {qrScanning && (
                <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="w-full h-1 bg-red-500 absolute top-1/2 left-0 animate-pulse" />
                </div>
              )}

              {qrScannedSuccess && (
                <div className="absolute inset-0 bg-emerald-600/90 flex flex-col items-center justify-center text-white text-[10px] font-black uppercase text-center p-1 rounded-xl">
                  <span>✓ Scan Success</span>
                  <span className="font-mono text-[9px] lowercase">redirecting...</span>
                </div>
              )}

              {/* Vector Mock QR representation */}
              <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor" className="text-slate-800">
                <rect x="0" y="0" width="30" height="30" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" />

                <rect x="70" y="0" width="30" height="30" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" />

                <rect x="0" y="70" width="30" height="30" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" />

                {/* Random QR bits */}
                <rect x="40" y="10" width="10" height="10" />
                <rect x="50" y="20" width="10" height="10" />
                <rect x="40" y="40" width="20" height="20" />
                <rect x="45" y="45" width="10" height="10" fill="white" />
                <rect x="10" y="45" width="10" height="10" />
                <rect x="25" y="50" width="10" height="10" />
                <rect x="80" y="45" width="15" height="15" />
                <rect x="70" y="70" width="10" height="10" />
                <rect x="85" y="80" width="15" height="15" />
              </svg>
            </div>

            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Janakpur Community College
            </span>
          </div>
        </div>
      </section>

      {/* Notice Board and Events Hub */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Notice Board */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Bell className="w-5 h-5 animate-swing" />
              </span>
              <h3 className="font-display font-black text-slate-800 text-lg tracking-tight">
                Academic Notice Board
              </h3>
            </div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase hover:underline cursor-pointer">
              View All Notices
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {notices.map((not, idx) => (
              <div key={idx} className="py-4 flex items-start space-x-3 group cursor-pointer">
                <div className="p-2 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-center font-mono text-[9px] shrink-0 font-bold">
                  {not.date.split(" ")[0]} <br /> {not.date.split(" ")[1].replace(",", "")}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-rose-50 border border-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                      {not.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{not.date}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">
                    {not.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Calendar className="w-5 h-5" />
              </span>
              <h3 className="font-display font-black text-slate-800 text-lg tracking-tight">
                Upcoming Events
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {events.map((ev, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-mono">
                    {ev.date} | {ev.day}
                  </span>
                  <span className="text-[9px] text-slate-400">{ev.time}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 leading-normal">
                  {ev.title}
                </h4>
                <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{ev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials and Alumni Success Stories */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
            Alumni Success
          </span>
          <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">
            Our Graduates Shape the Future
          </h2>
          <p className="text-xs text-slate-500">
            From regional agricultural startups to global technology providers, JCC alumni deliver scalable real-world solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alumniSuccess.map((alum, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <p className="text-slate-600 text-xs italic leading-relaxed">
                "{alum.quote}"
              </p>
              <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 border border-slate-200">
                  {alum.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 text-xs block">{alum.name}</span>
                  <span className="text-[10px] text-indigo-600 font-bold block">{alum.degree}</span>
                  <span className="text-[10px] text-slate-400 block">{alum.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* College FAQ Accordion Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight flex items-center justify-center space-x-2">
            <HelpCircle className="w-6 h-6 text-indigo-600 shrink-0" />
            <span>Admission & Platform FAQ</span>
          </h3>
          <p className="text-xs text-slate-500 leading-normal">
            Have questions about our smart scholarship algorithms or JCC academic courses? Find quick answers here.
          </p>
        </div>

        <div className="space-y-3.5 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="border border-slate-150 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100/50 flex justify-between items-center transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-800">{faq.q}</span>
                  <span className="text-slate-400 font-bold text-sm ml-2">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="p-4 bg-white border-t border-slate-150 text-xs text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Placement Cell & Partners */}
      <section className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 text-center">
        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-mono">
          JCC RECRUITMENT PARTNERS & ALLIANCES
        </span>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 opacity-60 grayscale hover:grayscale-0 transition-all">
          <span className="font-display font-bold text-slate-700 tracking-wider text-xs">Silicon Nepal</span>
          <span className="font-sans font-black text-slate-700 text-xs">Dhanusha Agrotech Co.</span>
          <span className="font-mono font-bold text-slate-700 text-xs">Nepal Telecom</span>
          <span className="font-display font-extrabold text-slate-700 text-xs">Madhesh Hydrolabs</span>
          <span className="font-sans font-semibold text-slate-700 text-xs">Nabil Bank Ltd</span>
        </div>
      </section>
    </div>
  );
}
