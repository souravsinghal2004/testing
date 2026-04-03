import mongoose from "mongoose";

const MONGO_URI = "mongodb://sourav:root%40123@ac-hxx0jon-shard-00-00.1lgp0ha.mongodb.net:27017,ac-hxx0jon-shard-00-01.1lgp0ha.mongodb.net:27017,ac-hxx0jon-shard-00-02.1lgp0ha.mongodb.net:27017/ai-interview?ssl=true&replicaSet=atlas-gtxzwa-shard-0&authSource=admin&retryWrites=true&w=majority";

// ✅ ONLY 5 DOMAINS
const domains = [
  "Frontend Developer",
  "Backend Developer",
  "Content Creator",
  "Marketing",
  "Accountant"
];

const companies = ["TechNova", "InnoTech", "Cloudify", "NextGen", "SecureNet"];
const locations = ["Delhi", "Mumbai", "Bangalore", "Remote"];
const workModes = ["WORK_FROM_HOME", "HYBRID", "ONSITE"];

let jobCounter = 101;

const jobs = [];

// ✅ helper for questions
function getQuestions(domain) {
  switch (domain) {
    case "Frontend Developer":
      return [
        "What is React?",
        "Explain useEffect hook.",
        "What is virtual DOM?"
      ];
    case "Backend Developer":
      return [
        "What is REST API?",
        "Explain middleware.",
        "What is JWT?"
      ];
    case "Content Creator":
      return [
        "How do you plan content strategy?",
        "What tools do you use?",
        "How do you measure engagement?"
      ];
    case "Marketing":
      return [
        "What is digital marketing?",
        "Explain SEO basics.",
        "How do you run campaigns?"
      ];
    case "Accountant":
      return [
        "What is balance sheet?",
        "Explain cash flow.",
        "What is GST?"
      ];
    default:
      return ["Tell me about yourself"];
  }
}

// ✅ 4 jobs per domain → total = 20
domains.forEach((domain) => {
  for (let i = 0; i < 4; i++) {

    const questions = getQuestions(domain);

    jobs.push({
      jobId: `JOB_${jobCounter++}`,
      title: `${domain} Intern`,
      company: companies[i % companies.length],
      location: locations[i % locations.length],
      workMode: workModes[i % workModes.length],
      jobType: "INTERNSHIP",
      startDate: "Immediately",
      duration: `${2 + (i % 4)} Months`,

      stipend: {
        min: 5000 + i * 1000,
        max: 12000 + i * 1500,
        currency: "INR"
      },

      applyBy: new Date("2026-05-15"),
      applicants: Math.floor(Math.random() * 500),

      about: `Join as a ${domain} Intern and gain real-world experience...`,

      responsibilities: [
        "Work on real-world tasks",
        "Collaborate with team",
        "Learn industry tools"
      ],

      requirements: [
        "Basic domain knowledge",
        "Good communication skills"
      ],

      goodToHave: [
        "Prior internship",
        "Projects in this domain"
      ],

      benefits: [
        "Certificate",
        "Flexible work",
        "PPO opportunity"
      ],

      skills: [domain, "Communication", "Teamwork"],

      createdBy: "admin_001",
      createdAt: new Date(),

      // ✅ NEW FIELDS
      no_of_questions: questions.length,
      questions: questions
    });
  }
});

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("🧹 Clearing old jobs...");
    await mongoose.connection.collection("jobs").deleteMany();

    console.log("🚀 Inserting 20 jobs...");
    await mongoose.connection.collection("jobs").insertMany(jobs);

    console.log("✅ 20 Jobs Inserted Successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seed();