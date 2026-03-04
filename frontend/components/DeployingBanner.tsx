"use client";

import Link from "next/link";

export default function DeployingBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-700/60 bg-slate-800/95 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-200">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
            <span className="text-xs">i</span>
          </span>
          <span>Deploying – version 3 – Image Classification</span>
        </div>
        <Link
          href="/deployments"
          className="rounded bg-slate-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-500"
        >
          View
        </Link>
      </div>
    </div>
  );
}
