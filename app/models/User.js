import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: String,

    email: {
      type: String,
      lowercase: true,
    },

    keywords: {
      type: [String],
      default: [],
    },

    role: {
      type: String,
      enum: ["CANDIDATE", "RECRUITER"],
      default: "CANDIDATE",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);