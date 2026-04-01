import mongoose from "mongoose";

const MONGO_URI = "mongodb://sourav:root%40123@ac-hxx0jon-shard-00-00.1lgp0ha.mongodb.net:27017,ac-hxx0jon-shard-00-01.1lgp0ha.mongodb.net:27017,ac-hxx0jon-shard-00-02.1lgp0ha.mongodb.net:27017/ai-interview?ssl=true&replicaSet=atlas-gtxzwa-shard-0&authSource=admin&retryWrites=true&w=majority"; // 👈 replace

// ✅ 20 domains (each will have 5 jobs)
const domains = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "QA Tester",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cyber Security",
  "AI/ML Engineer",
  "Mobile App Developer",
  "UI/UX Designer",
  "Product Manager",
  "Business Analyst",
  "Accounting",
  "Finance Analyst",
  "HR",
  "Sales Executive",
  "Digital Marketing",
  "Content Writer"
];

const companies = ["TechNova", "InnoTech", "Cloudify", "NextGen", "SecureNet"];
const locations = ["Delhi", "Mumbai", "Bangalore", "Remote"];
const workModes = ["WORK_FROM_HOME", "HYBRID", "ON_SITE"];

let jobCounter = 101;

const jobs = [];

domains.forEach((domain) => {
  for (let i = 0; i < 5; i++) {
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
      applicants: Math.floor(Math.random() * 800),
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
      createdAt: new Date()
    });
  }
});

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("🧹 Clearing old jobs...");
    await mongoose.connection.collection("jobs").deleteMany();

    console.log("🚀 Inserting 100 jobs...");
    await mongoose.connection.collection("jobs").insertMany(jobs);

    console.log("✅ 100 Jobs Inserted Successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seed();