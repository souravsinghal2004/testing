import mongoose from "mongoose";

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


     userId:{
       type: String, 
       required: true,
       },  // ✅ ADD


    jobId: {
      type: String,
      required: true,
    },  // ✅ ADD


    qa: [
      {
        question: String,
        answer: String,
      },
    ],

    scores: {
      communication: Number,
      technical_knowledge: Number,
      problem_solving: Number,
      confidence: Number,
      leadership: Number,
      teamwork: Number,
      adaptability: Number,
      clarity: Number,
      relevance: Number,
    },

    questionAnalysis: [
      {
        question: String,
        score: Number,
        feedback: String,
      },
    ],

    strengths: [String],
    weaknesses: [String],

    summary: String,

    hire_recommendation: {
      type: String,
      enum: ["Hire", "No Hire"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Report ||
  mongoose.model("Report", ReportSchema);