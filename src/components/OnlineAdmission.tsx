import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  FileText, Upload, CreditCard, ShieldCheck, Download, 
  MapPin, Phone, User, CheckCircle, ChevronRight, RefreshCw, AlertCircle
} from "lucide-react";

export default function OnlineAdmission() {
  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [targetProgram, setTargetProgram] = useState("BIT");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ESEWA");

  // Mock Upload states
  const [photoFile, setPhotoFile] = useState<string | null>(null);
  const [citizenFile, setCitizenFile] = useState<string | null>(null);
  const [marksheetFile, setMarksheetFile] = useState<string | null>(null);
  
  // Tracking states
  const [trackingCode, setTrackingCode] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [trackedStatus, setTrackedStatus] = useState<string | null>(null);

  const programs = [
    { code: "BIT", name: "Bachelor in Information Technology (BIT)" },
    { code: "AGRI", name: "Bachelor of Science in Agriculture (B.Sc. Agriculture)" },
    { code: "BBA", name: "Bachelor of Business Administration (BBA)" },
    { code: "BBS", name: "Bachelor of Business Studies (BBS)" },
    { code: "LAW", name: "Bachelor of Law (BA LLB)" }
  ];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      if (step === 1 && (!fullName || !email || !phone)) {
        alert("Please complete all personal and contact fields.");
        return;
      }
      if (step === 2 && (!photoFile || !citizenFile || !marksheetFile)) {
        alert("Please select files for all three required document types.");
        return;
      }
      setStep(step + 1);
    }
  };

  const handleFileChangeSim = (type: string) => {
    // Simulate reading a mock file
    const mockFilename = `${type}_verified_${Math.floor(1000 + Math.random() * 9000)}.pdf`;
    if (type === "photo") setPhotoFile(mockFilename);
    if (type === "citizenship") setCitizenFile(mockFilename);
    if (type === "marksheet") setMarksheetFile(mockFilename);
  };

  const handleCompletePayment = () => {
    // Generate unique tracking code
    const code = `JCC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setTrackingCode(code);
    setStep(4);
  };

  const handleTrackCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    
    // Simulate tracking
    if (searchCode.toUpperCase().startsWith("JCC-2026-")) {
      setTrackedStatus("Documents Verified - Awaiting Interview / Seat Allocation");
    } else {
      setTrackedStatus("Code Not Found. Try a valid JCC Tracking ID.");
    }
  };

  const handleDownloadReceipt = () => {
    // Generate a static alert or action
    alert(`Downloading receipt ${trackingCode}_receipt.pdf ... \nOfficial JCC Stamp: SEALED & SECURED`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Tracker Search Box */}
      <div className="lg:col-span-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
        <h4 className="font-display font-black text-sm uppercase tracking-wider text-indigo-300">
          Application Tracking Portal
        </h4>
        <p className="text-[11px] text-slate-400 leading-normal">
          If you have already submitted your admission application, paste your tracking ID below to check your documents verification and interview status.
        </p>

        <form onSubmit={handleTrackCode} className="space-y-3">
          <input
            type="text"
            required
            placeholder="e.g. JCC-2026-452185"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-100 font-mono"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Track Enrollment Status
          </button>
        </form>

        {trackedStatus && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
            <span className="text-[9px] font-extrabold text-amber-400 block uppercase">TRACKING RESPONSE</span>
            <p className="font-semibold text-slate-200">{trackedStatus}</p>
          </div>
        )}
      </div>

      {/* Main Admission Stage */}
      <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Step indicators */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-150">
          {[
            { num: 1, label: "Profile" },
            { num: 2, label: "Upload Documents" },
            { num: 3, label: "Payment Gate" },
            { num: 4, label: "Receipt Code" }
          ].map((s) => (
            <div key={s.num} className="flex items-center space-x-1.5">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= s.num ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
              }`}>
                {s.num}
              </span>
              <span className={`text-[10px] font-bold hidden sm:inline ${
                step >= s.num ? "text-slate-800" : "text-slate-400"
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: PERSONAL & ACADEMIC INFORMATION */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Academic Choice</span>
              <label className="text-xs font-semibold text-slate-700">Target Bachelor Program</label>
              <select
                value={targetProgram}
                onChange={(e) => setTargetProgram(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
              >
                {programs.map((p) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Applicant Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chaudhary"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Applicant Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Applicant Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9815243615"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Father / Mother Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Balram Chaudhary"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center space-x-1"
              >
                <span>Continue to Document uploads</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: DOCUMENT VERIFICATION SIMULATOR */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">Official Document Verification</span>
              <h3 className="font-bold text-slate-800 text-sm">Upload Scanning Photocopies</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                JCC admission system requires scanned copies of high-school documents. Choose virtual documents to pass to our simulation verification pipeline.
              </p>
            </div>

            <div className="space-y-4">
              {/* Photo */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-xs text-slate-700 block">Passport Size Photo (JPEG/PNG) *</span>
                  <p className="text-[10px] text-slate-400">Clear background looking straight into camera</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFileChangeSim("photo")}
                  className={`px-4 py-2 border rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                    photoFile ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {photoFile ? `✓ ${photoFile}` : "Choose Image File"}
                </button>
              </div>

              {/* Citizenship */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-xs text-slate-700 block">Citizenship Card or Passport (PDF/Image) *</span>
                  <p className="text-[10px] text-slate-400">Official Government issued identification</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFileChangeSim("citizenship")}
                  className={`px-4 py-2 border rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                    citizenFile ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {citizenFile ? `✓ ${citizenFile}` : "Choose Government ID"}
                </button>
              </div>

              {/* Marksheet */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-xs text-slate-700 block">+2 Marksheet / Transcript Certificate *</span>
                  <p className="text-[10px] text-slate-400">High school academic focus grade card</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFileChangeSim("marksheet")}
                  className={`px-4 py-2 border rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                    marksheetFile ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {marksheetFile ? `✓ ${marksheetFile}` : "Choose Marksheet PDF"}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center space-x-1"
              >
                <span>Process Document Verification</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT GATEWAY SELECTION */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">Application fee billing</span>
              <h3 className="font-bold text-slate-800 text-sm">Secure Payment Gateway Portal</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                Standard JCC Admission processing fee is <strong>NRs. 500</strong>. Select your digital partner to complete simulation payment.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "ESEWA", label: "eSewa Direct", desc: "Pay via verified eSewa wallet", color: "bg-emerald-100 border-emerald-300 text-emerald-800" },
                { id: "KHALTI", label: "Khalti Instant", desc: "Pay via Khalti web checkouts", color: "bg-indigo-50 border-indigo-200 text-indigo-800" },
                { id: "IPS", label: "ConnectIPS", desc: "Direct commercial bank debit", color: "bg-blue-50 border-blue-200 text-blue-800" },
                { id: "CASH", label: "Pay on Campus", desc: "Cash counter assignment", color: "bg-slate-100 border-slate-300 text-slate-800" }
              ].map((gate) => (
                <button
                  key={gate.id}
                  onClick={() => setPaymentMethod(gate.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === gate.id ? `${gate.color} ring-2 ring-indigo-500 font-bold` : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xs font-bold block">{gate.label}</span>
                  <p className="text-[10px] text-slate-400 mt-1">{gate.desc}</p>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between gap-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                Back
              </button>
              <button
                onClick={handleCompletePayment}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-emerald-100"
              >
                Submit Application & Pay NRs 500
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: TRACKING ASSIGNMENT & PDF DOWNLOAD */}
        {step === 4 && (
          <div className="text-center py-6 space-y-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase block">APPLICATION DISPATCHED</span>
              <h3 className="font-display font-black text-slate-900 text-xl tracking-tight">Congratulations, {fullName}!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Your online form, scanned documents, and processed application fees have been registered on the JCC Central Admissions database.
              </p>
            </div>

            {/* Tracking Code Banner */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl max-w-sm mx-auto space-y-2">
              <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Your Enrollment Tracking ID</span>
              <p className="font-mono font-black text-indigo-700 text-lg tracking-wider select-all">
                {trackingCode}
              </p>
              <p className="text-[10px] text-slate-400">Copy this code to track evaluations on the left panel.</p>
            </div>

            {/* Downloader receipt */}
            <div className="pt-4 space-x-3">
              <button
                onClick={handleDownloadReceipt}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl inline-flex items-center space-x-1.5 cursor-pointer shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Receipt</span>
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setFullName("");
                  setEmail("");
                  setPhone("");
                  setPhotoFile(null);
                  setCitizenFile(null);
                  setMarksheetFile(null);
                }}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Apply Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
