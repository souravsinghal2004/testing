export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center              bg-gradient-to-br from-black via-[#0f172a] to-blue-900 text-white">

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-10 py-8 rounded-2xl text-center shadow-xl">

        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-400 mx-auto mb-4"></div>

        <p className="text-gray-300">Loading...</p>

      </div>

    </div>
  );
}