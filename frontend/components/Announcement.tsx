import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Announcement() {
  return (
    <div className="relative z-[101] flex items-center justify-center bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-white sm:px-6 lg:px-8">
      <p className="text-center text-sm font-medium flex items-center gap-2">
        {/* <span>.</span> */}
        <Link href="/challenges" className="inline-flex items-center font-bold hover:text-indigo-100 transition-colors">
          GitHub Repository <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </p>
    </div>
  );
}
