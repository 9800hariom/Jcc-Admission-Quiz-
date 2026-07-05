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

export interface AdminStats {
  totalUsers: number;
  quizCompletedCount: number;
  streamCounts: { [key: string]: number };
  topScores: Student[];
  referralLeaderboard: Student[];
  totalReferralsCount: number;
}
