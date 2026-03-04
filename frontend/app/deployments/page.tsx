"use client";

import Link from "next/link";
import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";
import type { Deployment, Experiment } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<
    (Deployment & { experiment?: Experiment | null })[]
  >([]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) {
      setDeployments([
        {
          id: "1",
          experiment_id: "e1",
          status: "DEPLOYED",
          created_at: new Date().toISOString(),
          experiment: {
            id: "e1",
            name: "Image Classification",
            status: "COMPLETED",
            version: "v3",
            accuracy: 88.2,
            loss: 0.12,
            created_at: "",
            project: "default",
          },
        },
      ]);
      return;
    }
    const load = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from("deployments")
        .select("*, experiments(*)")
        .order("created_at", { ascending: false });
      if (data?.length) {
        setDeployments(
          (data as (Deployment & { experiments: Experiment | null })[]).map(
            (d) => ({
              ...d,
              experiment: d.experiments ?? null,
            })
          )
        );
      }
    };
    load();
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="mb-6 text-lg font-semibold text-white">Deployments</h2>
        <div className="rounded-xl border border-slate-700/60 bg-surface-800/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/60 bg-surface-900/50">
                <th className="text-left py-3 px-4 font-medium text-slate-400">
                  Model / Version
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-400">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-slate-700/40 hover:bg-slate-700/20"
                >
                  <td className="py-3 px-4 text-slate-200">
                    {d.experiment
                      ? `${d.experiment.name} (${d.experiment.version})`
                      : d.experiment_id}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {d.created_at
                      ? new Date(d.created_at).toLocaleString()
                      : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          <Link href="/" className="text-blue-400 hover:underline">
            ← Back to Experiments
          </Link>
        </p>
      </main>
    </>
  );
}
