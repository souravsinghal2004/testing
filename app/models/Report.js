import mongoose from "mongoose";

const QASchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const AnalysisSchema = new mongoose.Schema({
  question: String,
  score: Number,
  feedback: String,
});

const ReportSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    jobId: {
      type: String,
      required: true,
    },

    qa: [QASchema],

    questionAnalysis: [AnalysisSchema],

    scores: {
      communication: { type: Number, default: 0 },
      technical_knowledge: { type: Number, default: 0 },
      problem_solving: { type: Number, default: 0 },
      confidence: { type: Number, default: 0 },
      leadership: { type: Number, default: 0 },
      teamwork: { type: Number, default: 0 },
      adaptability: { type: Number, default: 0 },
      clarity: { type: Number, default: 0 },
      relevance: { type: Number, default: 0 },
    },

    strengths: [String],
    weaknesses: [String],

    summary: String,

    hire_recommendation: {
      type: String,
      enum: ["Hire", "No Hire"],
      default: "No Hire",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Report ||
  mongoose.model("Report", ReportSchema);