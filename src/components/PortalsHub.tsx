import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  User, Users, BookOpen, Clock, Calendar, CheckSquare, 
  CreditCard, GraduationCap, Plus, Save, Award, Search
} from "lucide-react";

export default function PortalsHub() {
  const [activePortal, setActivePortal] = useState<string>("STUDENT");

  // Teacher portal states
  const [mockMarks, setMockMarks] = useState([
    { name: "Anita Mandal", roll: "BIT-2026-03", math: 85, programming: 92 },
    { name: "Niranjan Yadav", roll: "BIT-2026-12", math: 72, programming: 78 },
    { name: "Suresh Sah", roll: "BIT-2026-15", math: 90, programming: 88 }
  ]);
  const [newMath, setNewMath] = useState<number>(0);
  const [selectedStudentIdx, setSelectedStudentIdx] = useState<number>(0);

  // Student details mock
  const studentData = {
    name: "Anita Mandal",
    course: "Bachelor in Information Technology (BIT) - 2nd Semester",
    attendance: "94.5%",
    balance: "NRs 12,500 (Due Semester Fee)",
    assignments: [
      { subject: "Data Structures & Algorithms", due: "July 12, 2026", status: "PENDING" },
      { subject: "Digital Logic Systems", due: "July 18, 2026", status: "COMPLETED" }
    ],
    exams: [
      { subject: "Mathematics II", date: "July 24, 2026", room: "Block C - Room 302" },
      { subject: "Data Structures & Algorithms", date: "July 28, 2026", room: "IT Terminal Lab II" }
    ]
  };

  const parentData = {
    childName: "Anita Mandal",
    academicRemarks: "Exceptional engagement in DSA programming. Recommended for Sandbox Hackathon team.",
    lastBillingDate: "June 15, 2026",
    paymentsPaid: [
      { item: "Admission Fee (Year I)", amount: "NRs. 45,000", receipt: "TXN-90281" },
      { item: "BIT Semester I Tuition", amount: "NRs. 60,000", receipt: "TXN-92015" }
    ]
  };

  const handleUpdateMarks = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...mockMarks];
    updated[selectedStudentIdx].math = Number(newMath);
    setMockMarks(updated);
    alert(`Successfully registered revised grades for ${updated[selectedStudentIdx].name}!`);
  };

  return (
    <div className="space-y-10">
      {/* Selector Navigation */}
      <div className="flex flex-wrap justify-center gap-3">
        {[
          { id: "STUDENT", label: "Student Portal Access", icon: GraduationCap, color: "bg-blue-600 text-white" },
          { id: "TEACHER", label: "Faculty & Teacher Portal", icon: User, color: "bg-emerald-600 text-white" },
          { id: "PARENT", label: "Parent Progress Portal", icon: Users, color: "bg-indigo-600 text-white" }
        ].map((p) => {
          const Icon = p.icon;
          const isActive = activePortal === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePortal(p.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2 border transition-all cursor-pointer ${
                isActive ? p.color : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* PORTAL CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* STUDENT PORTAL */}
        {activePortal === "STUDENT" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-150 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">ACTIVE STUDENT DASHBOARD</span>
                <h3 className="font-display font-black text-slate-900 text-xl tracking-tight">{studentData.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium">{studentData.course}</p>
              </div>
              <div className="flex items-center space-x-3 text-xs font-semibold">
                <div className="bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-xl">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Attendance</span>
                  <span className="font-bold text-blue-700 block mt-0.5">{studentData.attendance}</span>
                </div>
                <div className="bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-xl">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Outstanding dues</span>
                  <span className="font-bold text-rose-700 block mt-0.5">{studentData.balance.split(" (")[0]}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Assignments tracker */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-slate-400" />
                  <span>Due Assignments & Code Lab Uploads</span>
                </h4>

                <div className="space-y-2">
                  {studentData.assignments.map((as, i) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 block">{as.subject}</span>
                        <span className="text-[10px] text-slate-400 block">Deadline: {as.due}</span>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        as.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {as.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam routine */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Terminal Examination Schedule</span>
                </h4>

                <div className="space-y-2">
                  {studentData.exams.map((ex, i) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800">{ex.subject}</span>
                        <span className="text-[10px] font-bold text-blue-600 font-mono">{ex.date}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Exam Center Venue: <strong className="text-slate-700">{ex.room}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEACHER PORTAL */}
        {activePortal === "TEACHER" && (
          <div className="space-y-8">
            <div className="pb-4 border-b border-slate-150">
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider block">FACULTY INSTRUCTOR SUITE</span>
              <h3 className="font-display font-black text-slate-900 text-xl tracking-tight">Dr. Binay Kumar Mishra</h3>
              <p className="text-[11px] text-slate-400 font-medium">Department Head & Senior BIT Lecturer</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form to edit grades */}
              <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Update Terminal Course Grades
                </h4>

                <form onSubmit={handleUpdateMarks} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Choose Student Roll</label>
                    <select
                      value={selectedStudentIdx}
                      onChange={(e) => setSelectedStudentIdx(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none"
                    >
                      {mockMarks.map((m, i) => (
                        <option key={i} value={i}>{m.name} ({m.roll})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Revised Math Score</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      placeholder="e.g. 88"
                      value={newMath}
                      onChange={(e) => setNewMath(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Grade Updates</span>
                  </button>
                </form>
              </div>

              {/* Class grades list */}
              <div className="lg:col-span-7 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Active Enrollment Math & Coding Metrics
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans divide-y divide-slate-100">
                    <thead className="bg-slate-50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">Roll Number</th>
                        <th className="p-3 text-center">Math II</th>
                        <th className="p-3 text-center">Prog in C</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockMarks.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-800">{m.name}</td>
                          <td className="p-3 font-mono text-slate-400">{m.roll}</td>
                          <td className="p-3 text-center font-bold text-indigo-600">{m.math} / 100</td>
                          <td className="p-3 text-center font-bold text-emerald-600">{m.programming} / 100</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PARENT PORTAL */}
        {activePortal === "PARENT" && (
          <div className="space-y-8">
            <div className="pb-4 border-b border-slate-150">
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">SECURE GUARDIAN ACCESS</span>
              <h3 className="font-display font-black text-slate-900 text-xl tracking-tight">Parent / Guardian Suite</h3>
              <p className="text-[11px] text-slate-400 font-medium">Monitoring enrollment progress of: <strong className="text-slate-700">{parentData.childName}</strong></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Remarks and counsel */}
              <div className="space-y-3.5">
                <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                  <Award className="w-4 h-4 text-slate-400" />
                  <span>Academic Remarks & Recommendation</span>
                </h4>
                <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl text-xs leading-relaxed text-indigo-950 font-medium">
                  {parentData.academicRemarks}
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Next Parent-Teacher Meet</span>
                  <p className="font-bold text-slate-800">July 30, 2026 (11:00 AM)</p>
                  <p className="text-slate-500 leading-normal">Room 201, Administrative Wing, Ramanand Chowk, Janakpur.</p>
                </div>
              </div>

              {/* Billing statements */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span>Billing Ledger & Payment Receipts</span>
                </h4>

                <div className="space-y-2">
                  {parentData.paymentsPaid.map((pay, i) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">{pay.item}</span>
                        <span className="text-[10px] font-mono text-slate-400 block">Receipt: {pay.receipt}</span>
                      </div>
                      <span className="font-bold text-emerald-600 font-mono">{pay.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
