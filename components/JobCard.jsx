import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";

export default function JobCard({ job }) {

  // ✅ SAFE: hooks inside component (not loop)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]));
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]));

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY }}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: -150 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="relative rounded-3xl p-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl"
    >
      <div className="absolute inset-0 blur-xl opacity-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl" />

      <div className="relative rounded-3xl bg-white/5 backdrop-blur-2xl p-6 border border-white/10">

        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-400 text-sm">{job.company}</p>
          </div>

          <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
            Hiring
          </span>
        </div>

        {job.about && (
          <p className="text-gray-300 mb-4 line-clamp-3">
            {job.about}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="bg-blue-500/10 p-3 rounded-xl">
            🏠 {job.workMode || "Remote"}
          </div>

          {job.duration && (
            <div className="bg-purple-500/10 p-3 rounded-xl">
              ⏳ {job.duration}
            </div>
          )}

          {job.stipend && (
            <div className="bg-green-500/10 p-3 rounded-xl col-span-2">
              💰 ₹{job.stipend?.min} - ₹{job.stipend?.max}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {job.skills?.map((s, i) => (
            <span key={i} className="text-xs px-3 py-1 bg-white/10 rounded-full">
              {s}
            </span>
          ))}
        </div>

        <Link
          href={`/login/jobs/${job._id}`}
          className="block text-center bg-gradient-to-r from-blue-500 to-purple-500 py-2 rounded-lg font-semibold hover:scale-105 transition"
        >
          View Job
        </Link>
      </div>
    </motion.div>
  );
}