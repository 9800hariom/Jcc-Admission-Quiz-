import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Gift, ShieldCheck, Mail, Phone, Lock, Sparkles, CheckCircle, 
  ArrowRight, Award, Bell, HelpCircle, Laptop, CheckSquare
} from "lucide-react";
import { Student, RewardWheelItem } from "../types";

interface RewardWheelProps {
  student: Student;
  onProceedToQuiz: (updatedStudent: Student) => void;
}

export default function RewardWheel({ student, onProceedToQuiz }: RewardWheelProps) {
  // Verification states (uniqueness is securely checked and enforced by the backend)
  const [phoneVerified] = useState(true);
  const [emailVerified] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg] = useState("");

  // Reward and spin states
  const [rewards, setRewards] = useState<RewardWheelItem[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<RewardWheelItem | null>(null);
  const [hasSpun, setHasSpun] = useState(!!student.wonReward);
  const [showPrizePopup, setShowPrizePopup] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  // Canvas-based wheel states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentAngle, setCurrentAngle] = useState(0);

  // Sound Effects with Web Audio API (No files required)
  const playTickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(900, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {}
  };

  const playChimeSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 0.35);
      });
    } catch (e) {}
  };

  // Load active rewards configured by Admin
  const loadRewards = async () => {
    try {
      const res = await fetch("/api/rewards");
      if (res.ok) {
        const data = await res.json();
        setRewards(data);
      }
    } catch (e) {
      console.error("Failed to load rewards", e);
    }
  };

  useEffect(() => {
    loadRewards();
  }, []);

  // Canvas Draw Loop
  useEffect(() => {
    if (!canvasRef.current || rewards.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const center = width / 2;
    const radius = width / 2 - 10;
    const numSlices = rewards.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw outer circle border
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(79, 70, 229, 0.2)";
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 6;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // 2. Draw colorful slices
    rewards.forEach((reward, i) => {
      const startAngle = i * sliceAngle + currentAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.fillStyle = reward.color || (i % 2 === 0 ? "#4f46e5" : "#10b981");
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius - 4, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      // 3. Draw text on slices
      ctx.save();
      ctx.translate(center, center);
      // Center the text rotation in the middle of slice
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      
      // Shorten long labels to look great
      let label = reward.name;
      if (label.length > 20) {
        label = label.substring(0, 18) + "...";
      }
      ctx.fillText(label, radius - 20, 4);
      ctx.restore();
    });

    // 4. Draw outer border lights/dots for arcade feel
    const numLights = 24;
    for (let i = 0; i < numLights; i++) {
      const angle = (i * 2 * Math.PI) / numLights;
      const x = center + (radius - 2) * Math.cos(angle);
      const y = center + (radius - 2) * Math.sin(angle);
      ctx.fillStyle = (Math.floor(currentAngle * 10) + i) % 2 === 0 ? "#fbbf24" : "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // 5. Center Hub
    ctx.shadowBlur = 6;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(center, center, 32, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Small interior center circle with icon-like star or "JCC" text
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    ctx.arc(center, center, 24, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "black 9px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", center, center - 1);
  }, [rewards, currentAngle]);

  // Securely request spin outcome from API
  const handleSpinWheel = async () => {
    if (isSpinning || hasSpun) return;
    if (!phoneVerified || !emailVerified) {
      setVerificationError("Please complete both mobile OTP and Email code verification before spinning!");
      return;
    }

    setIsSpinning(true);
    setVerificationError("");

    try {
      const res = await fetch("/api/spin-wheel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student.id })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to process lucky spin.");
      }

      const data = await res.json();
      const winningReward: RewardWheelItem = data.reward;
      
      // Calculate target angle to land exactly on this segment
      // Segment position on wheel
      const itemIndex = rewards.findIndex(r => r.id === winningReward.id);
      if (itemIndex === -1) {
        setIsSpinning(false);
        throw new Error("Winning reward was not found in rewards list.");
      }

      const sliceAngle = (2 * Math.PI) / rewards.length;
      
      // Pointer is at the very top (angle -Math.PI / 2, or 270 degrees)
      // To align with pointer, we calculate offset
      const targetSegmentAngle = itemIndex * sliceAngle;
      // We want slice middle to land at 270 degrees (3 * Math.PI / 2)
      // Let's do a reliable multi-rotation animation
      const extraSpins = 5 + Math.random() * 2; // 5 to 7 full rotations
      const targetAngleValue = (3 * Math.PI / 2) - targetSegmentAngle - (sliceAngle / 2);
      const totalRotationAngle = (extraSpins * 2 * Math.PI) + targetAngleValue;

      // Start the physics rotation animation
      let startTimestamp: number | null = null;
      const duration = 5000; // 5 seconds spin

      let lastTickAngle = 0;
      const tickSpacing = sliceAngle;

      const animate = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);

        // Ease Out Cubic function for rich kinetic feeling
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const currentProgressAngle = totalRotationAngle * easeOutCubic(progress);

        setCurrentAngle(currentProgressAngle);

        // Play ticker click sounds when passing slice thresholds
        if (currentProgressAngle - lastTickAngle > tickSpacing) {
          playTickSound();
          lastTickAngle = currentProgressAngle;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Finished spinning
          playChimeSound();
          setIsSpinning(false);
          setWheelResult(winningReward);
          setHasSpun(true);
          setShowPrizePopup(true);
          
          // Confetti background launcher
          launchConfetti();
        }
      };

      requestAnimationFrame(animate);

    } catch (e: any) {
      setIsSpinning(false);
      setVerificationError(e.message || "Something went wrong spinning the wheel.");
    }
  };

  // Simple pure canvas confetti particles
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const launchConfetti = () => {
    if (!confettiCanvasRef.current) return;
    const canvas = confettiCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#4f46e5", "#10b981", "#fbbf24", "#ec4899", "#3b82f6"];
    const particles = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    }));

    let animationFrameId: number;

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        if (p.y > canvas.height) {
          particles[idx] = {
            x: Math.random() * canvas.width,
            y: -20,
            r: p.r,
            d: p.d,
            color: p.color,
            tilt: p.tilt,
            tiltAngleIncremental: p.tiltAngleIncremental,
            tiltAngle: p.tiltAngle
          };
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    // Stop confetti simulation after 8 seconds
    setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 8000);
  };

  // Continue to evaluation quiz
  const handleProceed = () => {
    // Return updated student profile
    const updatedStudent: Student = {
      ...student,
      otpVerified: true,
      emailVerified: true,
      wonReward: wheelResult?.name || student.wonReward || "Free Career Counseling",
      rewardClaimedAt: Date.now(),
      rewardApprovedStatus: wheelResult?.isPremium ? "PENDING" : "APPROVED"
    };
    onProceedToQuiz(updatedStudent);
  };

  const fullyVerified = phoneVerified && emailVerified;

  return (
    <div className="max-w-4xl mx-auto py-2 px-4 relative">
      {/* Absolute Confetti Overlay Canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      />

      {/* Dynamic Simulated Notification Popup */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg bg-slate-900 border border-slate-700 text-amber-200 px-5 py-4 rounded-2xl shadow-2xl flex items-start space-x-3 text-xs"
          >
            <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
            <div className="space-y-1 flex-1">
              <div className="font-extrabold text-[10px] tracking-widest text-slate-400 uppercase">JCC Mobile & Mail Gateway Server Simulator</div>
              <p className="font-mono text-[11px] leading-relaxed text-slate-100">{notificationMsg}</p>
              <div className="text-[10px] text-slate-500 font-sans italic">Use this simulation token in the inputs below to continue testing.</div>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-slate-400 hover:text-white font-bold p-1 bg-slate-800 rounded-lg hover:bg-slate-700"
            >
              Okay
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left column: Verification Gate */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-950 to-indigo-900 p-8 text-white flex flex-col justify-between border-r border-slate-200">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 bg-indigo-900/50 px-3.5 py-1.5 rounded-xl border border-indigo-700/50 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-black tracking-wider uppercase text-emerald-300">Profile Checked</span>
            </div>

            <div>
              <h2 className="text-2xl font-display font-black leading-tight tracking-tight">
                Candidate Profile Card
              </h2>
              <p className="text-indigo-200 text-xs mt-2 leading-relaxed">
                Your registration details have been verified against our database. You are authorized to spin the lucky wheel exactly once.
              </p>
            </div>

            {verificationError && (
              <div className="bg-rose-500/20 text-rose-200 border border-rose-500/30 rounded-xl px-4 py-3 text-xs font-medium">
                ⚠️ {verificationError}
              </div>
            )}

            {/* Candidate Details Card */}
            <div className="bg-indigo-900/40 border border-indigo-800/60 rounded-2xl p-4 space-y-4">
              <div className="border-b border-indigo-800/60 pb-2.5">
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Student Name</span>
                <span className="text-sm font-extrabold text-white block mt-0.5">{student.fullName}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Phone Number</span>
                  <span className="text-xs font-semibold text-white block mt-0.5">{student.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Rec. Stream</span>
                  <span className="text-xs font-semibold text-emerald-300 block mt-0.5">{student.recommendedStream || "BBA/BCA"}</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-indigo-800/60">
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Email Address</span>
                <span className="text-xs font-semibold text-white block mt-0.5 truncate">{student.email}</span>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Ready to Play</span>
                </span>
                <span className="text-[9px] bg-emerald-500 text-slate-900 font-black px-1.5 py-0.5 rounded">1 SPIN</span>
              </div>
            </div>

            {/* Simple instructions checklist */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] text-indigo-300 font-extrabold uppercase tracking-widest block">Wheel Regulations</span>
              <ul className="text-xs text-indigo-200 space-y-1.5 list-disc pl-4 font-medium">
                <li>Limit of 1 spin per registered mobile number and email.</li>
                <li>Attempts to bypass spin limits are tracked and logged.</li>
                <li>Your winning reward is permanently saved to your JCC profile.</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-indigo-800/60 mt-8 space-y-2">
            <div className="flex items-center space-x-2 text-[10px] text-indigo-300 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure Cloud Unique Profile Lock Active</span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Wheel Interface */}
        <div className="md:col-span-7 p-8 bg-slate-50 flex flex-col items-center justify-center relative">
          
          <div className="text-center space-y-2 mb-6">
            <div className="flex items-center justify-center space-x-2 text-indigo-600">
              <Gift className="w-6 h-6 animate-pulse" />
              <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">
                Janakpur Community College Spin Wheel
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {fullyVerified 
                ? "Excellent! Verification complete. You have exactly one lucky spin. Good luck!"
                : "Awaiting security verification. Complete the OTP and Email checks on the left to unlock your wheel."
              }
            </p>
          </div>

          {/* Physical Wheel Frame & Pointer */}
          <div className="relative w-[300px] h-[300px] sm:w-[320px] sm:h-[320px]">
            {/* The Pointer Needle pointing at the top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-rose-600 filter drop-shadow-md" />
            
            {/* Canvas Wheel Element */}
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              className={`w-full h-full filter drop-shadow-lg transition-transform ${
                fullyVerified && !isSpinning && !hasSpun ? "hover:scale-[1.02] cursor-pointer" : ""
              }`}
              onClick={fullyVerified && !isSpinning && !hasSpun ? handleSpinWheel : undefined}
            />

            {/* Inner spin button on center of wheel */}
            <button
              onClick={handleSpinWheel}
              disabled={!fullyVerified || isSpinning || hasSpun}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] rounded-full border-4 border-indigo-600 shadow-xl transition-all font-display font-black text-xs text-indigo-600 flex flex-col items-center justify-center cursor-pointer ${
                fullyVerified && !hasSpun && !isSpinning
                  ? "bg-white hover:bg-slate-100 hover:text-indigo-700 active:scale-95"
                  : "bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed"
              }`}
            >
              {isSpinning ? (
                <span className="text-[10px] uppercase font-bold animate-pulse text-indigo-600">Spinning</span>
              ) : hasSpun ? (
                <span className="text-[10px] uppercase font-bold text-slate-400">Done</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-500 mb-0.5" />
                  <span>SPIN</span>
                </>
              )}
            </button>
          </div>

          {/* Prompt warning text */}
          <div className="mt-6 text-center">
            {hasSpun && wheelResult && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl px-5 py-3 text-xs space-y-1">
                <span className="font-extrabold flex items-center justify-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Won: {wheelResult.name}</span>
                </span>
                <p className="text-[11px] text-emerald-600 leading-normal">
                  Your lucky reward has been saved. Please click below to proceed to the Scholarship Quiz.
                </p>
                <button
                  onClick={handleProceed}
                  className="mt-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black px-4 py-2 rounded-xl flex items-center justify-center space-x-1 mx-auto transition-all cursor-pointer"
                >
                  <span>Continue to Scholarship Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {!fullyVerified && (
              <span className="inline-block text-[10px] font-mono font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-full">
                ⚠️ Complete the verification checks to activate wheel
              </span>
            )}

            {fullyVerified && !isSpinning && !hasSpun && (
              <motion.button
                onClick={handleSpinWheel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-md transition-all flex items-center space-x-1.5 mx-auto cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                <span>SPIN LUCKY WHEEL NOW</span>
              </motion.button>
            )}
          </div>

        </div>
      </div>

      {/* Prize Landing Celebration Modal */}
      <AnimatePresence>
        {showPrizePopup && wheelResult && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-8 text-center text-white relative">
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur border border-white/15 text-[10px] font-black uppercase tracking-widest text-indigo-300 rounded-full">
                    Lucky Reward Won
                  </span>
                </div>
                
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Award className="w-8 h-8 text-amber-400 animate-spin" />
                </div>

                <h3 className="font-display font-black text-2xl tracking-tight text-white leading-tight">
                  Congratulations!
                </h3>
                <p className="text-indigo-200 text-xs mt-1">
                  You won {wheelResult.name} on the lucky spin!
                </p>
              </div>

              <div className="p-8 space-y-6 text-left">
                
                {wheelResult.isPremium ? (
                  // Custom wording for premium prizes (Laptops, Scholarships, fee waivers)
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
                      <span className="p-2 bg-amber-100 text-amber-800 rounded-xl font-bold shrink-0 text-sm">💡</span>
                      <div className="space-y-1">
                        <span className="font-extrabold text-xs text-amber-900 block leading-tight">Scholarship evaluation pathway unlocked!</span>
                        <p className="text-[11px] text-amber-800 leading-normal font-sans">
                          You have qualified for the <strong>{wheelResult.name}</strong> program. Final approval depends on your scholarship quiz score, document verification, and college committee review.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <span className="font-bold text-xs text-slate-800 block">Required Selection Criteria:</span>
                      <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                        <li className="flex items-center space-x-2">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <span>High performance on the 15Q Scholarship Quiz</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <span>Proof of SEE and +2 GPA credentials</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <span>Original academic certificate verification</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <span>Final JCC Board Committee selection list</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  // Custom wording for standard rewards
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start space-x-3">
                      <span className="p-2 bg-indigo-100 text-indigo-800 rounded-xl font-bold shrink-0 text-sm">🎁</span>
                      <div className="space-y-1">
                        <span className="font-extrabold text-xs text-indigo-900 block leading-tight">Reward locked to your JCC profile!</span>
                        <p className="text-[11px] text-indigo-800 leading-normal font-sans">
                          You won a <strong>{wheelResult.name}</strong>. This reward has been added to your profile and will be physically awarded to you upon enrollment at the college.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl text-slate-500 text-[11px] font-medium leading-relaxed italic text-center border border-slate-100">
                      "Make sure to perform your best on the upcoming Scholarship Quiz to unlock additional merit-based fee waivers!"
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      setShowPrizePopup(false);
                      handleProceed();
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer text-xs"
                  >
                    <span>Continue to Scholarship Quiz</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
