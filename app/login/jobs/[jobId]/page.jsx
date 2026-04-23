import { connectDB } from "@/app/lib/mongo";
import Job from "@/app/models/Job";
import { notFound } from "next/navigation";
import JobDetailsClient from "./JobDetailsClient";

export default async function JobDetailsPage({ params }) {
  await connectDB();
  const { jobId } = await params;

  const jobData = await Job.findById(jobId).lean();

  if (!jobData) {
    return notFound();
  }

  // Serialize MongoDB data for the Client Component
  const job = {
    ...jobData,
    _id: jobData._id.toString(),
    startDate: jobData.startDate 
      ? new Date(jobData.startDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) 
      : "Immediate",
    applyBy: jobData.applyBy ? jobData.applyBy.toISOString() : null,
  };

  return <JobDetailsClient job={job} />;
}