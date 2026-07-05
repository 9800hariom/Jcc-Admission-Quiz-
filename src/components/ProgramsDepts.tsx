import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Cpu, Leaf, Building2, Scale, Users, GraduationCap, 
  ChevronRight, Briefcase, Award, ArrowUpRight, Flame
} from "lucide-react";

export default function ProgramsDepts() {
  const [selectedDept, setSelectedDept] = useState<string>("BIT");

  const departments = [
    {
      id: "BIT",
      name: "Department of Information Technology",
      logo: Cpu,
      degName: "Bachelor in Information Technology (BIT)",
      flagship: true,
      duration: "4 Years (8 Semesters)",
      seats: "60 Seats per Batch",
      desc: "Our premium technology stream preparing computer science engineers. It blends heavy core algorithms with hands-on full-stack development, mobile coding, cloud engineering, and cybersecurity audits.",
      curriculum: ["Semester I: Computer Fundamentals & Programming in C", "Semester III: Data Structures & Algorithms (DSA)", "Semester V: Software Engineering & Web Architecture", "Semester VII: Cloud Native Systems & Internet of Things (IoT)"],
      skills: ["React, Next.js, Node.js", "PostgreSQL & Database Normalization", "Agile methodologies & Git CI/CD"],
      careers: ["Full-Stack Web Architect", "Database Security Analyst", "AgriTech System Integrator"],
      salary: "NRs 60,000 - 150,000+ monthly starting",
      labs: "Pre-allocated seat in BIT Sandbox Wing & IoT Hardware Dev Lab"
    },
    {
      id: "AGRI",
      name: "Department of Agricultural Sciences",
      logo: Leaf,
      degName: "Bachelor of Science in Agriculture (B.Sc. Ag Hons)",
      flagship: true,
      duration: "4 Years (8 Semesters)",
      seats: "50 Seats per Batch",
      desc: "A hands-on professional degree designed to revolutionize farming yields. We combine traditional botanical studies with precision agronomy, soil chemistry diagnostics, greenhouse testing, and food security studies.",
      curriculum: ["Semester I: Introductory Agronomy & Soil Sciences", "Semester III: Crop Physiology & Organic Horticulture", "Semester V: Plant Breeding, Genetics & Soil Chemistries", "Semester VII: Agri-Business Management & Agro-Incubation Project"],
      skills: ["Soil pH & Nutrient Diagnostic Profiling", "Precision Irrigation Systems", "Pest & Crop Disease Mitigation"],
      careers: ["Provincial Agricultural Officer", "Soil Laboratory Scientist", "Agri-Tech Startup Consultant"],
      salary: "NRs 50,000 - 120,000+ monthly starting",
      labs: "Soil Nutrient pH Simulator Lab & JCC Experimental Farming Acres"
    },
    {
      id: "BBA",
      name: "Department of Management Studies",
      logo: Building2,
      degName: "Bachelor of Business Administration (BBA)",
      flagship: false,
      duration: "4 Years (8 Semesters)",
      seats: "80 Seats",
      desc: "Designed to groom next-generation startup founders and corporate bankers. This curriculum prioritizes case-study analysis, marketing metrics, financial statement assessments, and digital business systems.",
      curriculum: ["Semester I: Microeconomics & Business Communications", "Semester III: Financial Accounting & Human Resource Management", "Semester V: Consumer Behavior & Statistical Analysis", "Semester VII: Corporate Finance & Digital Business Models"],
      skills: ["Financial Statements Modeling", "SEO & Digital Performance Marketing", "Business Intelligence & KPIs"],
      careers: ["Financial Risk Auditor", "Brand Manager", "Operations Manager"],
      salary: "NRs 40,000 - 100,000+ monthly starting",
      labs: "Virtual Business Trade Room & Case-Study Seminar Hall"
    },
    {
      id: "LAW",
      name: "Department of Jurisprudence & Law",
      logo: Scale,
      degName: "Bachelor of Arts Bachelor of Laws (BA LLB)",
      flagship: false,
      duration: "5 Years (10 Semesters)",
      seats: "40 Seats",
      desc: "A highly prestigious integrated dual-degree designed to produce elite corporate lawyers, judges, and legal researchers. Incorporates mandatory court moot sessions.",
      curriculum: ["Year I: Political Science & Legal Methods", "Year III: Constitutional Law & Criminal Jurisprudence", "Year V: Cyber Law, Corporate Law & Moot Court Advocacy"],
      skills: ["Logical Syllogisms & Critical Writing", "Contract Negotiation Drafting", "Public Legal Argumentation"],
      careers: ["Corporate Legal Counsel", "Constitutional Attorney", "Judiciary Officer"],
      salary: "NRs 55,000 - 130,000+ monthly starting",
      labs: "JCC High Court Mock Moot Room"
    }
  ];

  const current = departments.find(d => d.id === selectedDept) || departments[0];
  const CurrentIcon = current.logo;

  return (
    <div className="space-y-12">
      {/* Page Title */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
          Academic Offerings
        </span>
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight leading-none">
          Our Departments & Career Pathways
        </h1>
        <p className="text-xs text-slate-500">
          Janakpur Community College structures every syllabus to meet the physical and technical demands of the local workspace. Browse details of our programs below.
        </p>
      </section>

      {/* Program Selector Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Selector Panel */}
        <div className="lg:col-span-4 space-y-3">
          {departments.map((dept) => {
            const Icon = dept.logo;
            const isSelected = selectedDept === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                  isSelected
                    ? "bg-slate-900 border-slate-900 text-white shadow"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`p-2 rounded-xl shrink-0 ${
                    isSelected ? "bg-slate-800 text-amber-400" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-xs font-bold block leading-snug">{dept.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{dept.degName.split(" (")[0]}</span>
                  </div>
                </div>
                {dept.flagship && (
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    Flagship
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Faculty Details Area */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-150 gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                  <CurrentIcon className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-slate-400">{current.name}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-950 tracking-tight mt-1">
                {current.degName}
              </h2>
            </div>
            
            {current.flagship && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase inline-flex items-center space-x-1 shrink-0">
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Flagship Stream</span>
              </div>
            )}
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Course Duration</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{current.duration}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Available Seats</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{current.seats}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Laboratory Clearance</span>
              <span className="font-bold text-emerald-600 mt-0.5 block truncate" title={current.labs}>{current.labs.split(" & ")[0]}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {current.desc}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Curriculum Milestones */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Curriculum Milestones</span>
              <div className="space-y-2">
                {current.curriculum.map((cur, cIdx) => (
                  <div key={cIdx} className="flex items-start space-x-2 text-xs text-slate-600 leading-normal">
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{cur}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Targeted Career Opportunities */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Career Opportunities</span>
                <div className="space-y-2">
                  {current.careers.map((car, cIdx) => (
                    <div key={cIdx} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{car}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1 text-xs">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Salary/Impact Scale</span>
                <span className="font-bold text-indigo-700 block">{current.salary}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
