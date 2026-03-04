"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AccuracyChart from "@/components/AccuracyChart";
import ExperimentsTable from "@/components/ExperimentsTable";
import DeployingBanner from "@/components/DeployingBanner";
import {
  supabase,
  type Experiment,
  type Deployment,
  type ExperimentMetric,
} from "@/lib/supabase";

type ChartPoint = { epoch: number; v1?: number; v2?: number; v3?: number };

function buildChartData(metrics: ExperimentMetric[]): ChartPoint[] {
  const byEpoch: Record<number, Record<string, number>> = {};
  metrics.forEach((m) => {
    if (!byEpoch[m.epoch]) byEpoch[m.epoch] = {};
    byEpoch[m.epoch][m.version] = Number(m.accuracy);
  });
  return Object.entries(byEpoch)
    .map(([epoch, v]) => ({ epoch: Number(epoch), ...v }))
    .sort((a, b) => a.epoch - b.epoch);
}

const MOCK_EXPERIMENTS: Experiment[] = [
  {
    id: "1",
    name: "Image Classification",
    status: "RUNNING",
    version: "v1",
    accuracy: 79.3,
    loss: 0.21,
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    project: "default",
  },
  {
    id: "2",
    name: "Text Classification",
    status: "COMPLETED",
    version: "v2",
    accuracy: 85.9,
    loss: 0.14,
    created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    project: "default",
  },
  {
    id: "3",
    name: "Image Classification",
    status: "COMPLETED",
    version: "v3",
    accuracy: 88.2,
    loss: 0.12,
    created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    project: "default",
  },
];

const MOCK_DEPLOYMENTS: Deployment[] = [
  { id: "d1", experiment_id: "1", status: "RUNNING", created_at: "" },
  { id: "d2", experiment_id: "2", status: "DEPLOYED", created_at: "" },
  { id: "d3", experiment_id: "3", status: "DEPLOYED", created_at: "" },
];

const MOCK_METRICS: ExperimentMetric[] = [
  { id: "m1", experiment_id: "1", version: "v1", epoch: 1, accuracy: 20, created_at: "" },
  { id: "m2", experiment_id: "1", version: "v1", epoch: 2, accuracy: 45, created_at: "" },
  { id: "m3", experiment_id: "1", version: "v1", epoch: 3, accuracy: 65, created_at: "" },
  { id: "m4", experiment_id: "1", version: "v1", epoch: 4, accuracy: 75, created_at: "" },
  { id: "m5", experiment_id: "1", version: "v1", epoch: 5, accuracy: 79.3, created_at: "" },
  { id: "m6", experiment_id: "2", version: "v2", epoch: 1, accuracy: 25, created_at: "" },
  { id: "m7", experiment_id: "2", version: "v2", epoch: 2, accuracy: 50, created_at: "" },
  { id: "m8", experiment_id: "2", version: "v2", epoch: 3, accuracy: 70, created_at: "" },
  { id: "m9", experiment_id: "2", version: "v2", epoch: 4, accuracy: 82, created_at: "" },
  { id: "m10", experiment_id: "2", version: "v2", epoch: 5, accuracy: 85.9, created_at: "" },
  { id: "m11", experiment_id: "3", version: "v3", epoch: 1, accuracy: 30, created_at: "" },
  { id: "m12", experiment_id: "3", version: "v3", epoch: 2, accuracy: 55, created_at: "" },
  { id: "m13", experiment_id: "3", version: "v3", epoch: 3, accuracy: 75, created_at: "" },
  { id: "m14", experiment_id: "3", version: "v3", epoch: 4, accuracy: 85, created_at: "" },
  { id: "m15", experiment_id: "3", version: "v3", epoch: 5, accuracy: 88.2, created_at: "" },
];

export default function Home() {
  const [experiments, setExperiments] = useState<Experiment[]>(MOCK_EXPERIMENTS);
  const [deployments, setDeployments] = useState<Deployment[]>(MOCK_DEPLOYMENTS);
  const [metrics, setMetrics] = useState<ExperimentMetric[]>(MOCK_METRICS);
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) return;

    const load = async () => {
      if (!supabase) return;
      const [expRes, depRes, metRes] = await Promise.all([
        supabase.from("experiments").select("*").order("created_at", { ascending: false }),
        supabase.from("deployments").select("*"),
        supabase.from("experiment_metrics").select("*"),
      ]);
      if (expRes.data?.length) setExperiments(expRes.data as Experiment[]);
      if (depRes.data?.length) setDeployments(depRes.data as Deployment[]);
      if (metRes.data?.length) setMetrics(metRes.data as ExperimentMetric[]);
    };
    load();
  }, []);

  const deploymentsByExperiment = deployments.reduce<Record<string, Deployment[]>>(
    (acc, d) => {
      if (!acc[d.experiment_id]) acc[d.experiment_id] = [];
      acc[d.experiment_id].push(d);
      return acc;
    },
    {}
  );

  const chartData = buildChartData(metrics);

  const filtered = experiments.filter((e) => {
    if (projectFilter !== "All Projects" && e.project !== projectFilter) return false;
    if (statusFilter !== "All Statuses" && e.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.name.toLowerCase().includes(q) && !e.version.toLowerCase().includes(q))
        return false;
    }
    return true;
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8 pb-24">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">Experiments</h2>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="rounded-lg border border-slate-600 bg-surface-800 px-3 py-2 text-sm text-slate-200"
            >
              <option>All Projects</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-600 bg-surface-800 px-3 py-2 text-sm text-slate-200"
            >
              <option>All Statuses</option>
              <option value="RUNNING">RUNNING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
            </select>
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Search experiments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-surface-800 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500"
              />
            </div>
          </div>

          <div className="mb-8">
            <AccuracyChart data={chartData} />
          </div>

          <ExperimentsTable
            experiments={filtered}
            deploymentsByExperiment={deploymentsByExperiment}
          />
        </section>
      </main>
      <DeployingBanner />
    </>
  );
}
