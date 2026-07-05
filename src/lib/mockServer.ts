// Local Storage based simulation database for static environments like Vercel
import { Question, College, Student, ReferralHistory, AdminStats } from "../types";

const DB_KEY = "jcc_mock_db";

const DEFAULT_QUESTIONS: Question[] = [
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

const DEFAULT_COLLEGES: College[] = [
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

interface MockDBData {
  questions: Question[];
  colleges: College[];
  students: Student[];
  referrals: ReferralHistory[];
}

function getDB(): MockDBData {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const defaultData: MockDBData = {
      questions: DEFAULT_QUESTIONS,
      colleges: DEFAULT_COLLEGES,
      students: [],
      referrals: []
    };
    localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.questions || parsed.questions.length === 0) parsed.questions = DEFAULT_QUESTIONS;
    if (!parsed.colleges || parsed.colleges.length === 0) parsed.colleges = DEFAULT_COLLEGES;
    if (!parsed.students) parsed.students = [];
    if (!parsed.referrals) parsed.referrals = [];
    return parsed;
  } catch (e) {
    const defaultData: MockDBData = {
      questions: DEFAULT_QUESTIONS,
      colleges: DEFAULT_COLLEGES,
      students: [],
      referrals: []
    };
    localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
}

function saveDB(db: MockDBData) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

const ADMIN_TOKEN = "admin-super-token-12345";

export function handleMockRequest(urlStr: string, init?: RequestInit): Response {
  // Parse URL path
  const parsedUrl = new URL(urlStr, window.location.origin);
  const path = parsedUrl.pathname;
  const method = init?.method?.toUpperCase() || "GET";
  
  let body: any = null;
  if (init?.body && typeof init.body === "string") {
    try {
      body = JSON.parse(init.body);
    } catch (_) {}
  }

  // Helper to create Response object
  const makeResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  };

  const makeError = (message: string, status = 400) => {
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  };

  const db = getDB();

  // 1. /api/admin/login
  if (path === "/api/admin/login" && method === "POST") {
    const { username, password } = body || {};
    if (username === "admin" && password === "admin123") {
      return makeResponse({ token: ADMIN_TOKEN, message: "Login successful" });
    } else {
      return makeError("Invalid credentials. Use username 'admin' and password 'admin123'", 401);
    }
  }

  // RequireAdmin check helper
  const isAdminAuthorized = () => {
    const authHeader = init?.headers ? (init.headers as any)["Authorization"] || (init.headers as any)["authorization"] : null;
    return authHeader === `Bearer ${ADMIN_TOKEN}`;
  };

  // 2. /api/admin/stats
  if (path === "/api/admin/stats" && method === "GET") {
    if (!isAdminAuthorized()) return makeError("Unauthorized access", 401);
    
    const totalUsers = db.students.length;
    const quizCompletedCount = db.students.filter((s: any) => s.quizScore !== null).length;

    const streamCounts: { [key: string]: number } = {};
    db.students.forEach((s: any) => {
      if (s.recommendedStream) {
        streamCounts[s.recommendedStream] = (streamCounts[s.recommendedStream] || 0) + 1;
      }
    });

    const topScores = [...db.students]
      .filter((s: any) => s.quizScore !== null)
      .sort((a: any, b: any) => b.quizScore - a.quizScore)
      .slice(0, 5);

    const referralLeaderboard = [...db.students]
      .filter((s: any) => s.referralPoints > 0)
      .sort((a: any, b: any) => b.referralPoints - a.referralPoints)
      .slice(0, 5);

    return makeResponse({
      totalUsers,
      quizCompletedCount,
      streamCounts,
      topScores,
      referralLeaderboard,
      totalReferralsCount: db.referrals.length
    });
  }

  // 3. /api/admin/students
  if (path === "/api/admin/students" && method === "GET") {
    if (!isAdminAuthorized()) return makeError("Unauthorized access", 401);
    return makeResponse(db.students);
  }

  // 4. /api/admin/referrals
  if (path === "/api/admin/referrals" && method === "GET") {
    if (!isAdminAuthorized()) return makeError("Unauthorized access", 401);
    return makeResponse(db.referrals);
  }

  // 5. /api/colleges
  if (path === "/api/colleges") {
    if (method === "GET") {
      return makeResponse(db.colleges);
    }
    if (method === "POST") {
      if (!isAdminAuthorized()) return makeError("Unauthorized access", 401);
      const { name, location, courses, website, description, streamTags } = body || {};
      if (!name || !courses || !website) {
        return makeError("Name, courses, and website are required.", 400);
      }
      const newCollege: College = {
        id: `college-${Date.now()}`,
        name,
        location: location || "Nepal",
        courses: Array.isArray(courses) ? courses : courses.split(",").map((c: string) => c.trim()),
        website,
        description: description || "",
        streamTags: Array.isArray(streamTags) ? streamTags : (streamTags || "").split(",").map((t: string) => t.trim())
      };
      db.colleges.push(newCollege);
      saveDB(db);
      return makeResponse(newCollege, 201);
    }
  }

  // PUT /api/colleges/:id
  if (path.startsWith("/api/colleges/") && method === "PUT") {
    if (!isAdminAuthorized()) return makeError("Unauthorized access", 401);
    const id = path.replace("/api/colleges/", "");
    const index = db.colleges.findIndex((c: any) => c.id === id);
    if (index === -1) return makeError("College not found", 404);
    
    const { name, location, courses, website, description, streamTags } = body || {};
    db.colleges[index] = {
      ...db.colleges[index],
      name: name || db.colleges[index].name,
      location: location || db.colleges[index].location,
      courses: Array.isArray(courses) ? courses : courses.split(",").map((c: string) => c.trim()),
      website: website || db.colleges[index].website,
      description: description || db.colleges[index].description,
      streamTags: Array.isArray(streamTags) ? streamTags : (streamTags || "").split(",").map((t: string) => t.trim())
    };
    saveDB(db);
    return makeResponse(db.colleges[index]);
  }

  // DELETE /api/colleges/:id
  if (path.startsWith("/api/colleges/") && method === "DELETE") {
    if (!isAdminAuthorized()) return makeError("Unauthorized access", 401);
    const id = path.replace("/api/colleges/", "");
    db.colleges = db.colleges.filter((c: any) => c.id !== id);
    saveDB(db);
    return makeResponse({ message: "College deleted successfully." });
  }

  // 6. /api/questions
  if (path === "/api/questions") {
    if (method === "GET") {
      return makeResponse(db.questions);
    }
    if (method === "POST") {
      if (!isAdminAuthorized()) return makeError("Unauthorized access", 401);
      const { id, text, options, answer, category, explanation } = body || {};
      if (!text || !options || !answer || !category) {
        return makeError("Text, options, answer, and category are required.", 400);
      }
      if (id) {
        // Edit
        const idx = db.questions.findIndex((q: any) => q.id === Number(id));
        if (idx !== -1) {
          db.questions[idx] = { id: Number(id), text, options, answer, category, explanation };
          saveDB(db);
          return makeResponse(db.questions[idx]);
        }
      }
      // Add
      const nextId = db.questions.reduce((max: number, q: any) => q.id > max ? q.id : max, 0) + 1;
      const newQuestion = { id: nextId, text, options, answer, category, explanation };
      db.questions.push(newQuestion);
      saveDB(db);
      return makeResponse(newQuestion, 201);
    }
  }

  // DELETE /api/questions/:id
  if (path.startsWith("/api/questions/") && method === "DELETE") {
    if (!isAdminAuthorized()) return makeError("Unauthorized access", 401);
    const id = Number(path.replace("/api/questions/", ""));
    db.questions = db.questions.filter((q: any) => q.id !== id);
    saveDB(db);
    return makeResponse({ message: "Question deleted successfully." });
  }

  // 7. /api/register
  if (path === "/api/register" && method === "POST") {
    const { fullName, phone, email, address, plusTwoStream, interestFields, referrerCode } = body || {};

    if (!fullName || !phone || !email || !address || !plusTwoStream || !interestFields) {
      return makeError("All student registration details are required.", 400);
    }

    const duplicate = db.students.find(
      (s: any) => s.email.toLowerCase() === email.toLowerCase() || s.phone === phone
    );

    if (duplicate) {
      return makeError("Email or Phone is already registered!", 400);
    }

    const cleanName = fullName.replace(/[^a-zA-Z]/g, "").toUpperCase();
    const namePart = cleanName.slice(0, 3).padEnd(3, "X");
    const randPart = Math.floor(100 + Math.random() * 900).toString();
    const myReferralCode = `${namePart}${randPart}`;

    let referralApplied = false;
    let referrerName = "";

    if (referrerCode && referrerCode.trim() !== "") {
      const referrer = db.students.find(
        (s: any) => s.referralCode.toUpperCase() === referrerCode.trim().toUpperCase()
      );

      if (referrer) {
        const isSelf = referrer.email.toLowerCase() === email.toLowerCase() || referrer.phone === phone;
        if (!isSelf) {
          referrer.referralPoints = (referrer.referralPoints || 0) + 5;
          referrerName = referrer.fullName;
          referralApplied = true;

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

    const newStudent: Student = {
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
      referrerApplied: referralApplied,
      referredBy: referrerName || null
    };

    db.students.push(newStudent);
    saveDB(db);

    return makeResponse({
      message: "Registration successful!",
      student: newStudent
    }, 201);
  }

  // 8. /api/submit-quiz
  if (path === "/api/submit-quiz" && method === "POST") {
    const { studentId, answers, timeTaken } = body || {};

    if (!studentId || !answers) {
      return makeError("Student ID and quiz answers are required.", 400);
    }

    const studentIndex = db.students.findIndex((s: any) => s.id === studentId);
    if (studentIndex === -1) {
      return makeError("Student profile not found.", 404);
    }
    const student = db.students[studentIndex];

    let correctCount = 0;
    const streamPoints = {
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

    const quizPoints = correctCount * 10;
    let speedBonus = 0;
    if (timeTaken) {
      if (timeTaken <= 120) speedBonus = 30;
      else if (timeTaken <= 180) speedBonus = 20;
      else if (timeTaken <= 240) speedBonus = 10;
    }
    const totalScore = quizPoints + speedBonus;

    const interests = student.interestFields || [];
    if (interests.includes("BIT")) streamPoints.BIT += 5;
    if (interests.includes("BBA") || interests.includes("BBS")) streamPoints.BBA += 5;
    if (interests.includes("Law")) streamPoints.LAW += 5;
    if (interests.includes("Agriculture")) streamPoints.AGRI += 5;

    let recommendedStream = "BBA";
    let maxPoints = -1;

    for (const [stream, points] of Object.entries(streamPoints)) {
      if (points > maxPoints) {
        maxPoints = points;
        recommendedStream = stream;
      }
    }

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

    student.quizScore = totalScore;
    student.correctCount = correctCount;
    student.quizTimeTaken = timeTaken;
    student.quizAnswers = results;
    student.quizCompletedAt = Date.now();
    student.recommendedStream = recommendedStream;
    student.recommendationReason = recommendationReason;

    db.students[studentIndex] = student;
    saveDB(db);

    const matchedColleges = db.colleges.filter((c: any) =>
      c.streamTags && c.streamTags.includes(recommendedStream)
    );

    return makeResponse({
      score: totalScore,
      correctCount,
      speedBonus,
      recommendedStream,
      recommendationReason,
      matchedColleges
    });
  }

  // 9. /api/recommend-ai
  if (path === "/api/recommend-ai" && method === "POST") {
    const { studentId } = body || {};
    if (!studentId) return makeError("Student ID is required.", 400);

    const student = db.students.find((s: any) => s.id === studentId);
    if (!student) return makeError("Student not found.", 404);

    return makeResponse({
      aiGenerated: false,
      message: `
# 🎓 Personal Career Mentorship Letter (Static Fallback Mode)

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

  // Default fallback for unhandled /api
  return makeError(`Mock route ${method} ${path} not implemented`, 404);
}
