"use client";

import StatusBadge from "./StatusBadge";
import type { Experiment, Deployment } from "@/lib/supabase";

type Row = Experiment & { deployments?: Deployment[] };

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return "Just now";
}

export default function ExperimentsTable({
  experiments,
  deploymentsByExperiment,
}: {
  experiments: Experiment[];
  deploymentsByExperiment: Record<string, Deployment[]>;
}) {
  const rows: Row[] = experiments.map((e) => ({
    ...e,
    deployments: deploymentsByExperiment[e.id] || [],
  }));

  return (
    <div className="rounded-xl border border-slate-700/60 bg-surface-800/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/60 bg-surface-900/50">
              <th className="text-left py-3 px-4 font-medium text-slate-400">
                Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-slate-400">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-slate-400">
                Version
              </th>
              <th className="text-left py-3 px-4 font-medium text-slate-400">
                Accuracy
              </th>
              <th className="text-left py-3 px-4 font-medium text-slate-400">
                Loss
              </th>
              <th className="text-left py-3 px-4 font-medium text-slate-400">
                Created
              </th>
              <th className="w-10 py-3 px-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-700/40 hover:bg-slate-700/20"
              >
                <td className="py-3 px-4 text-slate-200">
                  {row.name} ({row.version})
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    <StatusBadge status={row.status} />
                    {row.deployments?.map((d) => (
                      <StatusBadge key={d.id} status={d.status} />
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-300">{row.version}</td>
                <td className="py-3 px-4 text-slate-300">
                  {row.accuracy != null ? `${row.accuracy}%` : "–"}
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {row.loss != null ? row.loss : "–"}
                </td>
                <td className="py-3 px-4 text-slate-400">
                  {formatTime(row.created_at)}
                </td>
                <td className="py-3 px-2">
                  <button
                    type="button"
                    className="rounded p-1 text-slate-500 hover:text-slate-300"
                    aria-label="View"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
