'use client';

import Link from "next/link";
import { ArrowRight, WifiOff } from "lucide-react";
import { useServiceStatus } from "@/lib/serviceStatus";
import { GITHUB_REPO_URL } from "@/lib/mockData";

export default function Announcement() {
  const { isOnline, isChecking } = useServiceStatus();

  // Don't show announcement if services are online or still checking
  if (isOnline || isChecking) {
    return null;
  }

  return (
    <div className="relative z-[101] flex items-center justify-center px-4 py-2 text-white sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-orange-600">
      <p className="text-center text-sm font-medium flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>Demo mode - Clone and run locally for full functionality.</span>
        <Link 
          href={GITHUB_REPO_URL} 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center font-bold hover:text-orange-100 transition-colors underline"
        >
          GitHub Repository <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </p>
    </div>
  );
}
