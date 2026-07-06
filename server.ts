import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

app.use(express.json());

// Initialize Database with Seed Data
function initDB() {
  const defaultQuestions = [
    {
      id: 1,
      text: "Which is the highest peak in the world, located in Nepal?",
      options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
      answer: "Mount Everest",
      category: "GENERAL_KNOWLEDGE",
      explanation: "Mount Everest is the world's highest peak at 8,848.86 meters above sea level, located in Nepal."
    },
    {
      id: 2,
      text: "Which historical city is known as the birthplace of Goddess Sita and famous for the Janaki Temple?",
      options: ["Janakpurdham", "Kathmandu", "Pokhara", "Lumbini"],
      answer: "Janakpurdham",
      category: "GENERAL_KNOWLEDGE",
      explanation: "Janakpurdham is a sacred historical city in Madhesh Province, Nepal, famous for the Janaki Mandir."
    },
    {
      id: 3,
      text: "What is the official currency of Nepal?",
      options: ["Nepalese Rupee", "Indian Rupee", "Taka", "Kyat"],
      answer: "Nepalese Rupee",
      category: "GENERAL_KNOWLEDGE",
      explanation: "The official currency of Nepal is the Nepalese Rupee (NPR)."
    },
    {
      id: 4,
      text: "Who is the writer of the national anthem of Nepal, 'Sayaun Thunga Phool Ka'?",
      options: ["Pradip Kumar Rai (Byakul Maila)", "Laxmi Prasad Devkota", "Bhanubhakta Acharya", "Madhav Prasad Ghimire"],
      answer: "Pradip Kumar Rai (Byakul Maila)",
      category: "GENERAL_KNOWLEDGE",
      explanation: "The national anthem of Nepal was written by Pradip Kumar Rai, popularly known as Byakul Maila."
    },
    {
      id: 5,
      text: "Which country is traditionally known as the land of the rising sun?",
      options: ["China", "Japan", "South Korea", "Norway"],
      answer: "Japan",
      category: "GENERAL_KNOWLEDGE",
      explanation: "Japan is traditionally known as the Land of the Rising Sun."
    },
    {
      id: 6,
      text: "What does CPU stand for in computer systems?",
      options: ["Central Processing Unit", "Computer Personal Unit", "Central Processor Utility", "Control Power Unit"],
      answer: "Central Processing Unit",
      category: "COMPUTER_SCIENCE",
      explanation: "CPU stands for Central Processing Unit, often called the brain of the computer."
    },
    {
      id: 7,
      text: "Which of the following is an open-source operating system?",
      options: ["Windows 11", "macOS", "Linux", "iOS"],
      answer: "Linux",
      category: "COMPUTER_SCIENCE",
      explanation: "Linux is a famous open-source Unix-like operating system kernel."
    },
    {
      id: 8,
      text: "What is the main purpose of an IP address?",
      options: ["To identify a device on a network", "To increase internet speed", "To store webpage images", "To encrypt emails"],
      answer: "To identify a device on a network",
      category: "COMPUTER_SCIENCE",
      explanation: "An Internet Protocol (IP) address is a unique numerical label assigned to each device connected to a computer network."
    },
    {
      id: 9,
      text: "Which programming language is primarily used for web browser scripting and dynamic frontend interactivity?",
      options: ["Python", "C++", "JavaScript", "SQL"],
      answer: "JavaScript",
      category: "COMPUTER_SCIENCE",
      explanation: "JavaScript is the standard language used to make web pages interactive and dynamic on the client side."
    },
    {
      id: 10,
      text: "Which of the following is NOT a storage device?",
      options: ["Solid State Drive (SSD)", "RAM", "Hard Disk Drive (HDD)", "Microprocessor"],
      answer: "Microprocessor",
      category: "COMPUTER_SCIENCE",
      explanation: "A microprocessor is a processing unit (CPU), not a storage device, while SSD, RAM, and HDD are storage units."
    },
    {
      id: 11,
      text: "What is the value of the mathematical constant Pi (π) rounded to two decimal places?",
      options: ["3.14", "3.41", "3.12", "3.16"],
      answer: "3.14",
      category: "SCIENCE_MATH",
      explanation: "Pi is approximately equal to 3.14159, which rounds to 3.14."
    },
    {
      id: 12,
      text: "Which gas do green plants absorb from the atmosphere during the process of photosynthesis?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      answer: "Carbon Dioxide",
      category: "SCIENCE_MATH",
      explanation: "Plants absorb Carbon Dioxide (CO2) and release Oxygen during photosynthesis."
    },
    {
      id: 13,
      text: "If a right-angled triangle has sides of length 3 cm and 4 cm, what is the length of the hypotenuse?",
      options: ["5 cm", "6 cm", "7 cm", "8 cm"],
      answer: "5 cm",
      category: "SCIENCE_MATH",
      explanation: "According to the Pythagorean theorem, 3² + 4² = 9 + 16 = 25, so hypotenuse = √25 = 5 cm."
    },
    {
      id: 14,
      text: "What is the chemical formula for pure water?",
      options: ["CO2", "H2O", "NaCl", "O2"],
      answer: "H2O",
      category: "SCIENCE_MATH",
      explanation: "Water consists of two hydrogen atoms bonded to one oxygen atom, hence H2O."
    },
    {
      id: 15,
      text: "Solve for x: if 3x - 7 = 14, then what is the value of x?",
      options: ["5", "6", "7", "8"],
      answer: "7",
      category: "SCIENCE_MATH",
      explanation: "3x - 7 = 14 => 3x = 21 => x = 7."
    }
  ];

  const defaultColleges = [
    {
      id: "college-1",
      name: "Prime College",
      location: "Nayabazar, Kathmandu, Nepal",
      courses: ["BIT", "BCA", "BBA", "BBS"],
      website: "https://www.prime.edu.np/",
      description: "A premier educational institution in Nepal. Famous for its excellent IT laboratories, experienced faculty, and strong placement partnerships with software houses and banks.",
      streamTags: ["BIT", "BBA", "BBS"]
    },
    {
      id: "college-2",
      name: "St. Xavier's College",
      location: "Maitighar, Kathmandu, Nepal",
      courses: ["B.Sc. CSIT", "BBS", "Microbiology", "Physics"],
      website: "https://sxc.edu.np/",
      description: "One of the most prestigious Jesuit institutions in South Asia. Known for academic discipline, state-of-the-art facilities, holistic leadership growth, and excellent results.",
      streamTags: ["BIT", "BBS"]
    },
    {
      id: "college-3",
      name: "Kathmandu University School of Management (KUSOM)",
      location: "Patan, Lalitpur, Nepal",
      courses: ["BBA", "BBIS", "MBA"],
      website: "https://kusom.edu.np/",
      description: "The pioneer school of management in Nepal. Highly acclaimed for student clubs, Case-Study based interactive pedagogy, and direct professional linkages across South Asia.",
      streamTags: ["BBA"]
    },
    {
      id: "college-4",
      name: "National Law College (NaLC)",
      location: "Sanepa, Lalitpur, Nepal",
      courses: ["BA LLB", "LLM"],
      website: "https://www.nationallawcollege.edu.np/",
      description: "The first private law college in Nepal affiliated to Tribhuvan University. Promotes clinical legal education, international moot court competitions, and analytical public debates.",
      streamTags: ["LAW"]
    },
    {
      id: "college-5",
      name: "Himalayan College of Agricultural Sciences & Technology (HICAST)",
      location: "Kirtipur, Kathmandu, Nepal",
      courses: ["B.Sc. (Hons) Agriculture", "B.V.Sc. & A.H."],
      website: "https://hicast.edu.np/",
      description: "Established to lead private agriculture instruction. Offers hands-on research fields, crop development programs, animal science laboratories, and agritech incubators.",
      streamTags: ["AGRI"]
    },
    {
      id: "college-6",
      name: "Apex College",
      location: "Mid-Baneshwor, Kathmandu, Nepal",
      courses: ["BBA", "BBA-BI", "BCIS", "BBS"],
      website: "https://apexcollege.edu.np/",
      description: "A modern business school focusing on design thinking, digital transformation, and startup mentorship. Hosts famous student-managed events and professional speaker circles.",
      streamTags: ["BBA", "BBS"]
    },
    {
      id: "college-7",
      name: "Janakpur Community College",
      location: "Ward No. 8, Ramanand Chowk, Janakpur, Nepal",
      courses: ["B.Sc. Agriculture", "BIT"],
      website: "http://janakpurcollege.com",
      description: "JCC provides quality technical education that creates better job opportunities for the students. It is Madhesh Province's premium academic institute, offering outstanding programs in Agriculture and modern BIT (Bachelor of Information Technology).",
      streamTags: ["AGRI", "BIT"],
      phone: "041-591195",
      email: "janakpurcollege@gmail.com"
    }
  ];

  const defaultRewards = [
    { id: "rew-1", name: "Laptop", color: "#dc2626", probability: 0.1, isPremium: true, quantityLimit: 3, quantityWon: 0 },
    { id: "rew-2", name: "Smartphone", color: "#d97706", probability: 0.3, isPremium: true, quantityLimit: 5, quantityWon: 0 },
    { id: "rew-3", name: "Tablet", color: "#9333ea", probability: 0.5, isPremium: true, quantityLimit: 8, quantityWon: 0 },
    { id: "rew-4", name: "100% Scholarship", color: "#059669", probability: 1, isPremium: true, quantityLimit: 10, quantityWon: 0 },
    { id: "rew-5", name: "50% Scholarship", color: "#2563eb", probability: 5, isPremium: true, quantityLimit: 20, quantityWon: 0 },
    { id: "rew-6", name: "College Merchandise", color: "#3b82f6", probability: 10, isPremium: false, quantityLimit: 100, quantityWon: 0 },
    { id: "rew-7", name: "College T-Shirt", color: "#10b981", probability: 10, isPremium: false, quantityLimit: 50, quantityWon: 0 },
    { id: "rew-8", name: "College Bag", color: "#f59e0b", probability: 8, isPremium: false, quantityLimit: 30, quantityWon: 0 },
    { id: "rew-9", name: "Notebook Set", color: "#ef4444", probability: 15, isPremium: false, quantityLimit: 200, quantityWon: 0 },
    { id: "rew-10", name: "Programming Book", color: "#8b5cf6", probability: 10, isPremium: false, quantityLimit: 80, quantityWon: 0 },
    { id: "rew-11", name: "Agriculture Book", color: "#ec4899", probability: 10, isPremium: false, quantityLimit: 80, quantityWon: 0 },
    { id: "rew-12", name: "USB Drive", color: "#06b6d4", probability: 5, isPremium: false, quantityLimit: 40, quantityWon: 0 },
    { id: "rew-13", name: "Computer Accessories", color: "#14b8a6", probability: 5, isPremium: false, quantityLimit: 30, quantityWon: 0 },
    { id: "rew-14", name: "Water Bottle", color: "#f97316", probability: 12, isPremium: false, quantityLimit: 100, quantityWon: 0 },
    { id: "rew-15", name: "Free Career Counseling", color: "#6366f1", probability: 15, isPremium: false, quantityLimit: 1000, quantityWon: 0 },
    { id: "rew-16", name: "Campus Tour Pass", color: "#a855f7", probability: 15, isPremium: false, quantityLimit: 1000, quantityWon: 0 },
    { id: "rew-17", name: "Admission Priority", color: "#22c55e", probability: 15, isPremium: false, quantityLimit: 1000, quantityWon: 0 },
    { id: "rew-18", name: "Registration Fee Discount", color: "#eab308", probability: 20, isPremium: false, quantityLimit: 200, quantityWon: 0 },
    { id: "rew-19", name: "Scholarship Eligibility", color: "#3b82f6", probability: 15, isPremium: false, quantityLimit: 1000, quantityWon: 0 },
    { id: "rew-20", name: "Better Luck Next Time", color: "#64748b", probability: 33.6, isPremium: false, quantityLimit: 10000, quantityWon: 0 }
  ];

  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      questions: defaultQuestions,
      colleges: defaultColleges,
      students: [],
      referrals: [],
      rewards: defaultRewards,
      spins: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    console.log("Database initialized and seeded with rewards.");
  } else {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      if (!data.questions || data.questions.length === 0) data.questions = defaultQuestions;
      if (!data.colleges || data.colleges.length === 0) data.colleges = defaultColleges;
      if (!data.students) data.students = [];
      if (!data.referrals) data.referrals = [];
      if (!data.rewards || data.rewards.length === 0) data.rewards = defaultRewards;
      if (!data.spins) data.spins = [];
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Error reading database, resetting...", e);
      const initialData = {
        questions: defaultQuestions,
        colleges: defaultColleges,
        students: [],
        referrals: [],
        rewards: defaultRewards,
        spins: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    }
  }
}

initDB();

function readData() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read database:", err);
    return { questions: [], colleges: [], students: [], referrals: [], rewards: [], spins: [] };
  }
}

function writeData(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to write database:", err);
  }
}

// Security Middleware for Admin APIs
const ADMIN_TOKEN = "admin-super-token-12345";
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized access" });
  }
}

// ---------------------- API ENDPOINTS ----------------------

// 1. Get All Colleges (Matching)
app.get("/api/colleges", (req, res) => {
  const db = readData();
  res.json(db.colleges);
});

// Admin Add College
app.post("/api/colleges", requireAdmin, (req, res) => {
  const { name, location, courses, website, description, streamTags } = req.body;
  if (!name || !courses || !website) {
    return res.status(400).json({ error: "Name, courses, and website are required." });
  }
  const db = readData();
  const newCollege = {
    id: `college-${Date.now()}`,
    name,
    location: location || "Nepal",
    courses: Array.isArray(courses) ? courses : courses.split(",").map((c: string) => c.trim()),
    website,
    description: description || "",
    streamTags: Array.isArray(streamTags) ? streamTags : (streamTags || "").split(",").map((t: string) => t.trim())
  };
  db.colleges.push(newCollege);
  writeData(db);
  res.status(201).json(newCollege);
});

// Admin Edit College
app.put("/api/colleges/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, location, courses, website, description, streamTags } = req.body;
  const db = readData();
  const index = db.colleges.findIndex((c: any) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "College not found" });
  }
  db.colleges[index] = {
    ...db.colleges[index],
    name: name || db.colleges[index].name,
    location: location || db.colleges[index].location,
    courses: Array.isArray(courses) ? courses : courses.split(",").map((c: string) => c.trim()),
    website: website || db.colleges[index].website,
    description: description || db.colleges[index].description,
    streamTags: Array.isArray(streamTags) ? streamTags : (streamTags || "").split(",").map((t: string) => t.trim())
  };
  writeData(db);
  res.json(db.colleges[index]);
});

// Admin Delete College
app.delete("/api/colleges/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readData();
  db.colleges = db.colleges.filter((c: any) => c.id !== id);
  writeData(db);
  res.json({ message: "College deleted successfully." });
});

// 2. Get Questions
app.get("/api/questions", (req, res) => {
  const db = readData();
  res.json(db.questions);
});

// Admin Add/Edit Questions
app.post("/api/questions", requireAdmin, (req, res) => {
  const { id, text, options, answer, category, explanation } = req.body;
  if (!text || !options || !answer || !category) {
    return res.status(400).json({ error: "Text, options, answer, and category are required." });
  }
  const db = readData();
  if (id) {
    // Edit existing
    const idx = db.questions.findIndex((q: any) => q.id === Number(id));
    if (idx !== -1) {
      db.questions[idx] = { id: Number(id), text, options, answer, category, explanation };
      writeData(db);
      return res.json(db.questions[idx]);
    }
  }
  // Add new
  const nextId = db.questions.reduce((max: number, q: any) => q.id > max ? q.id : max, 0) + 1;
  const newQuestion = { id: nextId, text, options, answer, category, explanation };
  db.questions.push(newQuestion);
  writeData(db);
  res.status(201).json(newQuestion);
});

// Admin Delete Question
app.delete("/api/questions/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const db = readData();
  db.questions = db.questions.filter((q: any) => q.id !== id);
  writeData(db);
  res.json({ message: "Question deleted successfully." });
});

// 3. Student Registration and Referral Loop
app.post("/api/register", (req, res) => {
  const { fullName, phone, email, address, plusTwoStream, interestFields, referrerCode } = req.body;

  if (!fullName || !phone || !email || !address || !plusTwoStream || !interestFields) {
    return res.status(400).json({ error: "All student registration details are required." });
  }

  const db = readData();

  // Guard: basic spam/duplicate check
  const duplicate = db.students.find(
    (s: any) => s.email.toLowerCase() === email.toLowerCase() || s.phone === phone
  );

  if (duplicate) {
    return res.status(400).json({ error: "Email or Phone is already registered!" });
  }

  // Generate unique referral code: First 3 letter of name uppercase + 3 random digits
  const cleanName = fullName.replace(/[^a-zA-Z]/g, "").toUpperCase();
  const namePart = cleanName.slice(0, 3).padEnd(3, "X");
  const randPart = Math.floor(100 + Math.random() * 900).toString();
  const myReferralCode = `${namePart}${randPart}`;

  let referralApplied = false;
  let referrerName = "";

  // Process referral link if code is passed and valid
  if (referrerCode && referrerCode.trim() !== "") {
    const referrer = db.students.find(
      (s: any) => s.referralCode.toUpperCase() === referrerCode.trim().toUpperCase()
    );

    if (referrer) {
      // Prevent self referral
      const isSelf = referrer.email.toLowerCase() === email.toLowerCase() || referrer.phone === phone;
      if (!isSelf) {
        referrer.referralPoints = (referrer.referralPoints || 0) + 5;
        referrerName = referrer.fullName;
        referralApplied = true;

        // Save referral history link
        db.referrals.push({
          id: `ref-${Date.now()}`,
          referrerId: referrer.id,
          referrerName: referrer.fullName,
          referredName: fullName,
          referredEmail: email,
          pointsEarned: 5,
          timestamp: Date.now()
        });
      }
    }
  }

  const newStudent = {
    id: `student-${Date.now()}`,
    fullName,
    phone,
    email,
    address,
    plusTwoStream,
    interestFields: Array.isArray(interestFields) ? interestFields : [interestFields],
    referralCode: myReferralCode,
    referralPoints: 0,
    quizScore: null,
    quizTimeTaken: null,
    quizAnswers: null,
    quizCompletedAt: null,
    registeredAt: Date.now(),
    referralApplied,
    referredBy: referrerName || null
  };

  db.students.push(newStudent);
  writeData(db);

  res.status(201).json({
    message: "Registration successful!",
    student: newStudent
  });
});

// 4. Submit Quiz and Calculate Stream Recommendations
app.post("/api/submit-quiz", (req, res) => {
  const { studentId, answers, timeTaken } = req.body; // answers is an object: { questionId: selectedAnswer }

  if (!studentId || !answers) {
    return res.status(400).json({ error: "Student ID and quiz answers are required." });
  }

  const db = readData();
  const student = db.students.find((s: any) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student profile not found." });
  }

  // Calculate scores
  let correctCount = 0;
  let streamPoints = {
    BIT: 0,
    BBA: 0,
    LAW: 0,
    AGRI: 0
  };

  const results = db.questions.map((q: any) => {
    const selected = answers[q.id];
    const isCorrect = selected && selected.trim() === q.answer.trim();
    if (isCorrect) {
      correctCount++;
      // Map category to streams
      if (q.category === "COMPUTER_SCIENCE") {
        streamPoints.BIT += 10;
      }
      if (q.category === "SCIENCE_MATH") {
        streamPoints.AGRI += 10;
        streamPoints.BIT += 5;
      }
      if (q.category === "GENERAL_KNOWLEDGE") {
        streamPoints.BBA += 10;
        streamPoints.LAW += 10;
      }
    }
    return {
      questionId: q.id,
      questionText: q.text,
      selected,
      correct: q.answer,
      isCorrect
    };
  });

  // Basic points calculation: 10 points per correct answer
  let quizPoints = correctCount * 10;

  // Speed Bonus points
  // 5 mins limit (300 secs). If finished under 2 mins (120s): +30 bonus, under 3 mins (180s): +20 bonus, under 4 mins (240s): +10 bonus
  let speedBonus = 0;
  if (timeTaken) {
    if (timeTaken <= 120) speedBonus = 30;
    else if (timeTaken <= 180) speedBonus = 20;
    else if (timeTaken <= 240) speedBonus = 10;
  }
  const totalScore = quizPoints + speedBonus;

  // Determine Best Study Stream
  // Check student interests as tie-breakers or amplifiers
  const interests = student.interestFields || [];
  if (interests.includes("BIT")) streamPoints.BIT += 5;
  if (interests.includes("BBA") || interests.includes("BBS")) streamPoints.BBA += 5;
  if (interests.includes("Law")) streamPoints.LAW += 5;
  if (interests.includes("Agriculture")) streamPoints.AGRI += 5;

  let recommendedStream = "BBA"; // default fallbacks
  let maxPoints = -1;

  for (const [stream, points] of Object.entries(streamPoints)) {
    if (points > maxPoints) {
      maxPoints = points;
      recommendedStream = stream;
    }
  }

  // Description and Explanation for matching
  let recommendationReason = "";
  if (recommendedStream === "BIT") {
    recommendationReason = "You demonstrated strong analytical skills, critical mathematical reasoning, and logical troubleshooting during the quiz combined with an interest in technology. We recommend a Bachelor of Information Technology (BIT) or B.Sc. CSIT.";
  } else if (recommendedStream === "BBA") {
    recommendationReason = "Your profile shows sharp mathematical calculation speeds, administrative reasoning, and a commercial mindset. A Bachelor of Business Administration (BBA) or Bachelor of Business Studies (BBS) is highly recommended for your potential.";
  } else if (recommendedStream === "LAW") {
    recommendationReason = "You successfully parsed logical syllogisms, comprehension statements, and demonstrated structured legal and civic aptitude. A five-year integrated BA LLB course is perfectly aligned with your talents.";
  } else if (recommendedStream === "AGRI") {
    recommendationReason = "You showed high scientific awareness regarding global warming, vegetation growth variables, and earth science concepts. A Bachelor of Science in Agriculture (B.Sc. Ag) or Biotechnology is recommended.";
  }

  // Update Student Profile with score
  student.quizScore = totalScore;
  student.correctCount = correctCount;
  student.quizTimeTaken = timeTaken;
  student.quizAnswers = results;
  student.quizCompletedAt = Date.now();
  student.recommendedStream = recommendedStream;
  student.recommendationReason = recommendationReason;

  writeData(db);

  // Filter matched colleges based on recommended stream tag
  const matchedColleges = db.colleges.filter((c: any) =>
    c.streamTags && c.streamTags.includes(recommendedStream)
  );

  res.json({
    score: totalScore,
    correctCount,
    speedBonus,
    recommendedStream,
    recommendationReason,
    matchedColleges
  });
});

// 5. Admin Auth Endpoint
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    res.json({ token: ADMIN_TOKEN, message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid credentials. Use username 'admin' and password 'admin123'" });
  }
});

// 6. Admin Stats
app.get("/api/admin/stats", requireAdmin, (req, res) => {
  const db = readData();
  const totalUsers = db.students.length;
  const quizCompletedCount = db.students.filter((s: any) => s.quizScore !== null).length;

  // Stream counts
  const streamCounts: { [key: string]: number } = {};
  db.students.forEach((s: any) => {
    if (s.recommendedStream) {
      streamCounts[s.recommendedStream] = (streamCounts[s.recommendedStream] || 0) + 1;
    }
  });

  // Top scoring
  const topScores = [...db.students]
    .filter((s: any) => s.quizScore !== null)
    .sort((a: any, b: any) => b.quizScore - a.quizScore)
    .slice(0, 5);

  // Referral leaderboard
  const referralLeaderboard = [...db.students]
    .filter((s: any) => s.referralPoints > 0)
    .sort((a: any, b: any) => b.referralPoints - a.referralPoints)
    .slice(0, 5);

  const totalSpins = db.spins ? db.spins.length : 0;
  const totalPremiumWins = db.spins ? db.spins.filter((s: any) => s.isPremium).length : 0;
  const pendingApprovalsCount = db.spins ? db.spins.filter((s: any) => s.approvedStatus === "PENDING").length : 0;

  res.json({
    totalUsers,
    quizCompletedCount,
    streamCounts,
    topScores,
    referralLeaderboard,
    totalReferralsCount: db.referrals.length,
    totalSpins,
    totalPremiumWins,
    pendingApprovalsCount
  });
});

// 7. Admin Registered Students List
app.get("/api/admin/students", requireAdmin, (req, res) => {
  const db = readData();
  res.json(db.students);
});

// 8. Admin Referrals List
app.get("/api/admin/referrals", requireAdmin, (req, res) => {
  const db = readData();
  res.json(db.referrals);
});

// 9. Admin CSV Export
app.get("/api/admin/export-csv", (req, res) => {
  // Simple check for safety: query param token
  const { token } = req.query;
  if (token !== ADMIN_TOKEN) {
    return res.status(401).send("Unauthorized");
  }

  const db = readData();
  const header = "Full Name,Phone,Email,Address,Background Stream,Interests,Referral Code,Referral Points,Quiz Score,Correct Questions,Recommended Stream,Referrer\n";
  const rows = db.students.map((s: any) => {
    const name = `"${(s.fullName || "").replace(/"/g, '""')}"`;
    const phone = `"${s.phone || ""}"`;
    const email = `"${s.email || ""}"`;
    const addr = `"${(s.address || "").replace(/"/g, '""')}"`;
    const bg = `"${s.plusTwoStream || ""}"`;
    const interests = `"${(s.interestFields || []).join("; ")}"`;
    const refCode = `"${s.referralCode || ""}"`;
    const refPoints = s.referralPoints || 0;
    const score = s.quizScore !== null ? s.quizScore : "Not Taken";
    const corrects = s.correctCount !== undefined ? s.correctCount : "N/A";
    const stream = `"${s.recommendedStream || "N/A"}"`;
    const referrer = `"${s.referredBy || "None"}"`;

    return `${name},${phone},${email},${addr},${bg},${interests},${refCode},${refPoints},${score},${corrects},${stream},${referrer}`;
  }).join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=students_admission_data.csv");
  res.send(header + rows);
});

// ---------------------- SMART REWARD WHEEL API ----------------------

// 1. Get All Active Rewards Slices
app.get("/api/rewards", (req, res) => {
  const db = readData();
  res.json(db.rewards || []);
});

// 2. Admin Create/Edit/Delete Reward Wheel slices
app.post("/api/rewards", requireAdmin, (req, res) => {
  const { id, name, color, probability, isPremium, quantityLimit, deleteId } = req.body;
  const db = readData();

  if (!db.rewards) db.rewards = [];

  if (deleteId) {
    // Delete action
    db.rewards = db.rewards.filter((r: any) => r.id !== deleteId);
    writeData(db);
    return res.json({ message: "Reward deleted successfully.", rewards: db.rewards });
  }

  if (id) {
    // Edit action
    const idx = db.rewards.findIndex((r: any) => r.id === id);
    if (idx === -1) return res.status(404).json({ error: "Reward not found" });
    db.rewards[idx] = {
      ...db.rewards[idx],
      name: name || db.rewards[idx].name,
      color: color || db.rewards[idx].color,
      probability: Number(probability) >= 0 ? Number(probability) : db.rewards[idx].probability,
      isPremium: isPremium !== undefined ? !!isPremium : db.rewards[idx].isPremium,
      quantityLimit: Number(quantityLimit) >= 0 ? Number(quantityLimit) : db.rewards[idx].quantityLimit
    };
    writeData(db);
    return res.json({ message: "Reward updated successfully.", reward: db.rewards[idx], rewards: db.rewards });
  } else {
    // Create action
    if (!name || !color || probability === undefined) {
      return res.status(400).json({ error: "Name, color and probability are required." });
    }
    const newReward = {
      id: "rew-" + Date.now(),
      name,
      color,
      probability: Number(probability),
      isPremium: !!isPremium,
      quantityLimit: Number(quantityLimit) >= 0 ? Number(quantityLimit) : 100,
      quantityWon: 0
    };
    db.rewards.push(newReward);
    writeData(db);
    return res.status(201).json({ message: "Reward created successfully.", reward: newReward, rewards: db.rewards });
  }
});

// 3. Securely Spin the Wheel and Record Spun Reward
app.post("/api/spin-wheel", (req, res) => {
  const { studentId } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: "Student ID is required to spin the wheel." });
  }

  const db = readData();
  const student = db.students.find((s: any) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student profile not found." });
  }

  if (student.wonReward) {
    return res.status(400).json({ error: "Student has already spun the wheel. Limit of 1 spin per user." });
  }

  // Filter rewards where won < limit
  const activeRewards = (db.rewards || []).filter((r: any) => {
    const limit = r.quantityLimit !== undefined ? Number(r.quantityLimit) : 10000;
    const won = r.quantityWon !== undefined ? Number(r.quantityWon) : 0;
    return won < limit;
  });

  if (activeRewards.length === 0) {
    return res.status(500).json({ error: "No active rewards configured inside quantity limits. Contact Admin." });
  }

  // Choose reward using roulette-wheel selection algorithm
  const totalWeight = activeRewards.reduce((sum: number, r: any) => sum + Number(r.probability), 0);
  let winningReward = null;

  if (totalWeight <= 0) {
    winningReward = activeRewards[activeRewards.length - 1];
  } else {
    let rValue = Math.random() * totalWeight;
    for (const r of activeRewards) {
      rValue -= Number(r.probability);
      if (rValue <= 0) {
        winningReward = r;
        break;
      }
    }
    if (!winningReward) {
      winningReward = activeRewards[activeRewards.length - 1];
    }
  }

  // Increment winner's claim metric in Db
  const rwIdx = db.rewards.findIndex((r: any) => r.id === winningReward.id);
  if (rwIdx !== -1) {
    db.rewards[rwIdx].quantityWon = (db.rewards[rwIdx].quantityWon || 0) + 1;
  }

  // Update student properties
  student.wonReward = winningReward.name;
  student.rewardClaimedAt = Date.now();
  student.rewardApprovedStatus = winningReward.isPremium ? "PENDING" : "NONE";
  student.otpVerified = true;
  student.emailVerified = true;

  // Add Spin History item
  const newSpin = {
    id: "spin-" + Date.now(),
    studentId: student.id,
    studentName: student.fullName,
    studentEmail: student.email,
    studentPhone: student.phone,
    rewardName: winningReward.name,
    isPremium: winningReward.isPremium,
    timestamp: Date.now(),
    approvedStatus: winningReward.isPremium ? "PENDING" : "NONE"
  };

  if (!db.spins) db.spins = [];
  db.spins.push(newSpin);

  writeData(db);
  res.json({ message: "Spin registered successfully.", reward: winningReward, student });
});

// 4. Admin Get All Spins
app.get("/api/admin/spins", requireAdmin, (req, res) => {
  const db = readData();
  res.json(db.spins || []);
});

// 5. Admin Approve/Reject Premium Reward Win
app.post("/api/admin/approve-reward", requireAdmin, (req, res) => {
  const { spinId, status } = req.body; // status: "APPROVED" or "REJECTED"
  if (!spinId || !status) {
    return res.status(400).json({ error: "Spin ID and status are required." });
  }

  const db = readData();
  const spinIndex = (db.spins || []).findIndex((s: any) => s.id === spinId);
  if (spinIndex === -1) {
    return res.status(404).json({ error: "Spin log not found." });
  }

  db.spins[spinIndex].approvedStatus = status;

  // Update corresponding student profile
  const student = db.students.find((s: any) => s.id === db.spins[spinIndex].studentId);
  if (student) {
    student.rewardApprovedStatus = status;
  }

  writeData(db);
  res.json({ message: `Reward spin marked as ${status} successfully.`, spin: db.spins[spinIndex] });
});

// 6. Admin Approve/Reject Merit Scholarship Application Status
app.post("/api/admin/approve-scholarship", requireAdmin, (req, res) => {
  const { studentId, status } = req.body; // status: "APPROVED", "REJECTED", "NONE"
  if (!studentId || !status) {
    return res.status(400).json({ error: "Student ID and status are required." });
  }

  const db = readData();
  const student = db.students.find((s: any) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student not found." });
  }

  student.scholarshipApprovedStatus = status;
  writeData(db);
  res.json({ message: `Student scholarship application status updated to ${status}.`, student });
});

// 10. Optional Gemini API Smart Career Recommendation Letter
app.post("/api/recommend-ai", async (req, res) => {
  const { studentId } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: "Student ID is required." });
  }

  const db = readData();
  const student = db.students.find((s: any) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student not found." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  // If api key is empty or default placeholder, gracefully degrade
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return res.json({
      aiGenerated: false,
      message: `
# 🎓 Personal Career Mentorship Letter (Static Mode)

Dear **${student.fullName}**,

Congratulations on completing your stream evaluation! Based on your educational background in **${student.plusTwoStream}**, your expressed interests in **${(student.interestFields || []).join(", ")}**, and your stellar performance of **${student.quizScore} points** (${student.correctCount}/15 correct answers), here is your custom advice:

## 🧭 Career Roadmap Analysis
1. **Focus Stream**: Since you demonstrated rapid analytical calculations and strategic reasoning, **${student.recommendedStream}** is an exceptionally good match.
2. **Key Capabilities**: You show deep aptitude for parsing complex logical constructs, organizing data, and adapting quickly under timed pressure.
3. **Core Industries**: High-impact career paths include product development, corporate intelligence, technological policy research, or agritech strategy, depending on your final university degree.

## 🛠️ Recommended Action Items
- **Build Core Projects**: If seeking technology/BIT paths, start learning full-stack development. For BBA paths, engage in stock market mock trading or start-up incubators.
- **Connect with Mentors**: Reach out to alumni from our recommended colleges (such as Prime College or KUSOM) to understand college culture.
- **Explore Internships**: Engage in basic corporate or technical writing internships during the gap months before college admissions open.

Wishing you great success on your academic journey!
`
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });

    const prompt = `
You are a senior career guidance counselor and academic mentor. Write a personalized, highly inspiring, professional mentorship letter for a student who just finished Grade 12.

Student Details:
- Name: ${student.fullName}
- Stream of Interest: ${student.recommendedStream}
- Expressed Academic Interests: ${(student.interestFields || []).join(", ")}
- High School (+2) Background: ${student.plusTwoStream}
- Evaluation Quiz Score: ${student.quizScore} / 180 points (${student.correctCount} correct out of 15 questions, completed in ${student.quizTimeTaken} seconds).

Write a highly detailed, encouraging, and actionable response in Markdown format. Address them directly by name. Organize into clearly labeled sections:
1. Executive Assessment (Recognizing their high-school background and quiz achievements)
2. Strategic Why (An explaining why ${student.recommendedStream} fits their high-speed processing or category aptitude)
3. 3-Year Strategic Career Roadmap (Milestones during university)
4. Industry Job Opportunities & Salary/Impact Scale
Keep the tone exceptionally academic, warm, and highly professional.
`;

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({
      aiGenerated: true,
      message: result.text
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate AI response. Degrading gracefully." });
  }
});

// Global Error Handler for API Routes (forces JSON responses instead of Express HTML pages)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Uncaught API Error:", err);
  res.status(500).json({ error: err.message || "An unexpected error occurred on the server." });
});

// ---------------------- FRONTEND ROUTING & VITE MIDDLEWARE ----------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
