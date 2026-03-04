"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-700/60 bg-surface-900/80 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            ModelForge
          </h1>
          <p className="text-xs text-slate-400">AutoML & MLOps Platform</p>
        </div>
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
