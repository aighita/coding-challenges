export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-4">Welcome to Coding Challenges</h1>
      <p className="text-xl mb-8">Improve your coding skills by solving algorithmic problems.</p>
      <a
        href="/challenges"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
      >
        Browse Challenges
      </a>
    </div>
  )
}
