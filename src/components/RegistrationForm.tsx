import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  User, Phone, Mail, MapPin, GraduationCap, Compass, 
  HelpCircle, Gift, Sparkles, ClipboardCheck, Info, HeartHandshake, ChevronRight
} from "lucide-react";
import { Student } from "../types";

interface RegistrationFormProps {
  onRegisterSuccess: (student: Student) => void;
  onNavigateToAdmin: () => void;
}

export default function RegistrationForm({ onRegisterSuccess, onNavigateToAdmin }: RegistrationFormProps) {
  // Form Segment State
  const [formPage, setFormPage] = useState<number>(1);

  // Field states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  
  // Province / District / Mun
  const [province, setProvince] = useState("Madhesh Province");
  const [district, setDistrict] = useState("Dhanusha");
  const [municipality, setMunicipality] = useState("Janakpurdham Sub-Metropolitan");
  
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("2008-05-15");
  
  // Academic details
  const [seeGpa, setSeeGpa] = useState("3.85");
  const [plusTwoCollege, setPlusTwoCollege] = useState("");
  const [plusTwoStream, setPlusTwoStream] = useState("Science");
  const [expectedGpa, setExpectedGpa] = useState("3.75");
  const [interestFields, setInterestFields] = useState<string[]>(["BIT"]);
  
  // Parent details
  const [parentName, setParentName] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [parentOccupation, setParentOccupation] = useState("Agriculture / Farming");
  
  // Referrals & Survey
  const [hearAboutUs, setHearAboutUs] = useState("QR Advertisement");
  const [referrerCode, setReferrerCode] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Auto-extract referrer code from URL query parameters (e.g. ?ref=ABC123)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferrerCode(ref.toUpperCase());
    }
  }, []);

  const handleInterestToggle = (field: string) => {
    if (interestFields.includes(field)) {
      setInterestFields(interestFields.filter((f) => f !== field));
    } else {
      setInterestFields([...interestFields, field]);
    }
  };

  const handleNextPage = () => {
    setError("");
    if (formPage === 1) {
      if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim()) {
        setError("Please complete all personal and contact fields.");
        return;
      }
      setFormPage(2);
    } else if (formPage === 2) {
      if (!plusTwoCollege.trim()) {
        setError("Please supply your +2 high school name.");
        return;
      }
      setFormPage(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      setError("Please fill out all required personal details.");
      return;
    }

    if (interestFields.length === 0) {
      setError("Please select at least one field of academic interest.");
      return;
    }

    if (!parentName.trim() || !parentContact.trim()) {
      setError("Parent or Guardian name and contact are mandatory.");
      return;
    }

    if (!acceptPolicy) {
      setError("You must accept the admission privacy terms and enrollment guidelines.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: `${address.trim()}, Mun: ${municipality}, Dist: ${district}, Prov: ${province}`,
          plusTwoStream,
          interestFields,
          referrerCode: referrerCode.trim() || undefined,
          // Save remaining detailed fields directly inside the student object
          province,
          district,
          municipality,
          gender,
          dob,
          seeGpa,
          plusTwoCollege: plusTwoCollege.trim(),
          expectedGpa,
          parentName: parentName.trim(),
          parentContact: parentContact.trim(),
          parentOccupation,
          hearAboutUs
        })
      });

      const responseText = await response.text();
      let data: any;
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        if (!response.ok) {
          throw new Error(`Server error (${response.status}): Could not register profile.`);
        } else {
          throw new Error("Invalid response format received from server.");
        }
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to register student");
      }

      setSuccessMsg(data.message || "Registration Successful!");
      setTimeout(() => {
        onRegisterSuccess(data.student);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const streams = ["Science", "Management", "Humanities", "Education", "A-Levels", "CBSE Board", "Other"];
  const options = [
    { value: "BIT", label: "BIT & Computer Science" },
    { value: "BBA", label: "BBA (Business Admin)" },
    { value: "BBS", label: "BBS (Business Studies)" },
    { value: "Law", label: "Law (BA LLB)" },
    { value: "Agriculture", label: "B.Sc. Agriculture" }
  ];

  return (
    <div id="registration_container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start py-6 px-4">
      {/* Introduction Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-5 bg-gradient-to-br from-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6 self-stretch flex flex-col justify-between border border-slate-800"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <span className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-400/30">
              <Sparkles className="w-6 h-6 text-indigo-300" />
            </span>
            <span className="font-display font-extrabold text-xs tracking-wider uppercase text-indigo-300">Smart Evaluation Portal 2026</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-display font-black tracking-tight leading-tight">
              Unlock Your JCC Career Roadmap
            </h1>
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              Passed your +2 exams? Janakpur Community College offers state-recognized programs in <strong>BIT & B.Sc. Agriculture</strong>. Take our 15-question evaluation quiz to discover your stream and secure up to a 35% merit-based scholarship.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-indigo-800/60">
            {[
              { step: 1, title: "Detailed Academic Profile", desc: "Share SEE grades and parent contacts." },
              { step: 2, title: "15Q Aptitude Evaluation", desc: "Take a 5-minute timed quiz on computer, science, and math." },
              { step: 3, title: "Scholarship & Stream Match", desc: "Generate university counseling matches instantly." }
            ].map((s) => (
              <div key={s.step} className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 text-xs font-bold mt-0.5 shrink-0">
                  {s.step}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-100">{s.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-indigo-800/60 mt-8 space-y-4">
          <div className="flex items-center space-x-2 text-indigo-300 text-[10px] bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-800 font-medium">
            <Gift className="w-3.5 h-3.5" />
            <span>Refer friends: get +5 points per evaluation!</span>
          </div>
        </div>
      </motion.div>

      {/* Registration Form Box */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm"
      >
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
          <h2 className="text-xl font-display font-black text-slate-900 tracking-tight">
            Graduate Admission Registration
          </h2>
          <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
            Step {formPage} of 3
          </span>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 text-xs px-4 py-3 rounded-xl border border-rose-200 mb-6 flex items-center space-x-2">
            <span className="font-bold shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-700 text-xs px-4 py-3 rounded-xl border border-emerald-200 mb-6 flex items-center space-x-2">
            <span className="font-bold shrink-0">✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PAGE 1: PERSONAL INFORMATION */}
          {formPage === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Applicant Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Yadav"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contact Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9815456218"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Active Email Address *</span>
                  </label>
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
                  <label className="text-xs font-semibold text-slate-700">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Date of Birth (A.D.) *</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Street Address / Ward No. *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ward No. 8, Ramanand Chowk"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Province</label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Municipality</label>
                  <input
                    type="text"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center space-x-1"
                >
                  <span>Continue to Academic History</span>
                  <Compass className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PAGE 2: HIGH SCHOOL ACADEMICS */}
          {formPage === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                    <ClipboardCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Secondary SEE GPA *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={seeGpa}
                    onChange={(e) => setSeeGpa(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>+2 Faculty Stream *</span>
                  </label>
                  <select
                    value={plusTwoStream}
                    onChange={(e) => setPlusTwoStream(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  >
                    {streams.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>+2 School / College Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Model Multiple College, Janakpur"
                    value={plusTwoCollege}
                    onChange={(e) => setPlusTwoCollege(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Expected / Final +2 GPA *</label>
                  <input
                    type="text"
                    required
                    value={expectedGpa}
                    onChange={(e) => setExpectedGpa(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Targets Checkboxes */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target JCC Stream Interest *</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {options.map((opt) => {
                    const checked = interestFields.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleInterestToggle(opt.value)}
                        className={`flex items-center space-x-2 text-[11px] font-semibold px-3 py-2 rounded-xl border transition-all text-left cursor-pointer ${
                          checked ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        <input type="checkbox" checked={checked} readOnly className="pointer-events-none" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setFormPage(1)}
                  className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center space-x-1"
                >
                  <span>Continue to Parent / Survey</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PAGE 3: PARENT INFO & SURVEYS */}
          {formPage === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Father / Mother Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balram Chandra Yadav"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Parent Contact Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9801452615"
                    value={parentContact}
                    onChange={(e) => setParentContact(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Parent Occupation</label>
                  <input
                    type="text"
                    value={parentOccupation}
                    onChange={(e) => setParentOccupation(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">How did you hear about JCC?</label>
                  <select
                    value={hearAboutUs}
                    onChange={(e) => setHearAboutUs(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-800"
                  >
                    <option>QR Advertisement</option>
                    <option>Facebook Campaign</option>
                    <option>Friend / Relative</option>
                    <option>High School Visit</option>
                    <option>TikTok Flyer</option>
                    <option>Newspaper</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                    <Gift className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Referrer Code (Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. RAM102"
                    value={referrerCode}
                    onChange={(e) => setReferrerCode(e.target.value.toUpperCase())}
                    className="w-full text-xs px-3.5 py-2.5 bg-indigo-50/50 border border-indigo-150 rounded-xl focus:outline-none text-indigo-900 tracking-widest font-mono"
                  />
                </div>
                <div className="flex items-end pb-1 text-[11px] text-slate-400 font-sans">
                  <span>Enter a friend's link code to reward them 5 points.</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start space-x-2.5 text-[11px] text-slate-500 leading-normal cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptPolicy}
                    onChange={(e) => setAcceptPolicy(e.target.checked)}
                    className="mt-0.5 accent-indigo-600 w-4 h-4 shrink-0"
                  />
                  <span>
                    I hereby authorize Janakpur Community College Admissions to verify my SEE/+2 records and share results notification on my email / mobile phone. *
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setFormPage(2)}
                  className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl disabled:opacity-50 flex items-center space-x-1"
                >
                  {loading ? (
                    <span>Submitting profile...</span>
                  ) : (
                    <>
                      <span>Begin Smart Quiz Challenge</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
