import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
    },

    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,

    workMode: {
      type: String,
      enum: ["WORK_FROM_HOME", "ONSITE", "HYBRID"],
      default: "WORK_FROM_HOME",
    },

    jobType: {
  type: String,
  enum: ["INTERNSHIP", "FULL_TIME"],
},

    startDate: {
  type: Date,
},
    duration: String,

    stipend: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "INR",
      },
    },

    applyBy: Date,

    applicants: {
      type: Number,
      default: 0,
    },

    about: String,

    responsibilities: [String],
    requirements: [String],
    goodToHave: [String],
    benefits: [String],

    skills: [String],

    createdBy: {
      type: String, // clerkId
      required: true,
    },

    no_of_questions: {
      type: Number,
      default: 1,
    },

    questions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);