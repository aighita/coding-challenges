'use client';

import Link from "next/link";
import { ArrowRight, WifiOff, Wifi, RefreshCw } from "lucide-react";
import { useServiceStatus } from "@/lib/serviceStatus";
import { GITHUB_REPO_URL } from "@/lib/mockData";

export default function Announcement() {
  const { isOnline, isChecking, checkStatus } = useServiceStatus();

  // Don't show announcement if services are online
  if (isOnline && !isChecking) {
    return null;
  }

  return (
    <div className={`relative z-[101] flex items-center justify-center px-4 py-2 text-white sm:px-6 lg:px-8 ${
      isChecking 
        ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
        : 'bg-gradient-to-r from-amber-600 to-orange-600'
    }`}>
      <p className="text-center text-sm font-medium flex items-center gap-2">
        {isChecking ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Checking service status...</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>Services are offline - Demo mode active.</span>
            <Link 
              href={GITHUB_REPO_URL} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center font-bold hover:text-orange-100 transition-colors underline"
            >
              View GitHub Repository <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            <button
              onClick={() => checkStatus()}
              className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
              title="Retry connection"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </>
        )}
      </p>
    </div>
  );
}
