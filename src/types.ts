export interface Question {
  id: number;
  text: string;
  options: string[];
  answer: string;
  category: "GENERAL_KNOWLEDGE" | "COMPUTER_SCIENCE" | "SCIENCE_MATH";
  explanation?: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  courses: string[];
  website: string;
  description: string;
  streamTags: string[];
  phone?: string;
  email?: string;
}

export interface Student {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  plusTwoStream: string;
  interestFields: string[];
  referralCode: string;
  referralPoints: number;
  quizScore: number | null;
  correctCount?: number;
  quizTimeTaken: number | null;
  quizAnswers: any[] | null;
  quizCompletedAt: number | null;
  registeredAt: number;
  referrerApplied: boolean;
  referredBy: string | null;
  recommendedStream?: string;
  recommendationReason?: string;
  
  // Verification, Wheel & Scholarship state fields
  otpVerified?: boolean;
  emailVerified?: boolean;
  wonReward?: string;
  rewardClaimedAt?: number;
  rewardApprovedStatus?: "PENDING" | "APPROVED" | "REJECTED" | "NONE";
  scholarshipApprovedStatus?: "PENDING" | "APPROVED" | "REJECTED" | "NONE";
}

export interface ReferralHistory {
  id: string;
  referrerId: string;
  referrerName: string;
  referredName: string;
  referredEmail: string;
  pointsEarned: number;
  timestamp: number;
}

export interface RewardWheelItem {
  id: string;
  name: string;
  color: string;
  probability: number; // probability weight e.g., 10% -> 10, or 0.1% -> 0.1
  isPremium: boolean;
  quantityLimit: number;
  quantityWon: number;
}

export interface SpinHistoryItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  rewardName: string;
  isPremium: boolean;
  timestamp: number;
  approvedStatus: "PENDING" | "APPROVED" | "REJECTED" | "NONE";
}

export interface AdminStats {
  totalUsers: number;
  quizCompletedCount: number;
  streamCounts: { [key: string]: number };
  topScores: Student[];
  referralLeaderboard: Student[];
  totalReferralsCount: number;
  
  // New wheel statistics
  totalSpins: number;
  totalPremiumWins: number;
  pendingApprovalsCount: number;
}

