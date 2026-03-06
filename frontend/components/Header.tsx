"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-700/60 bg-surface-900/95 backdrop-blur sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-md ring-1 ring-white/10">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L14 7L19 8L15 11L16 16L12 14L8 16L9 11L5 8L10 7L12 2Z" />
              <circle cx="12" cy="20" r="2" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
              ModelForge
            </h1>
            <p className="text-xs font-medium text-slate-400">AutoML & MLOps Platform</p>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-white bg-slate-700/50"
          >
            Experiments
          </Link>
          <Link
            href="/deployments"
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/30"
          >
            Deployments
          </Link>
          <span className="ml-2 text-slate-500">⋯</span>
          <button
            type="button"
            className="ml-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            + Run Experiment
          </button>
        </nav>
      </div>
    </header>
  );
}
