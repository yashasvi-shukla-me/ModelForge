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
    name: "Baseline Regression",
    status: "RUNNING",
    version: "v1",
    accuracy: 0.21,
    loss: 0.79,
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    project: "default",
  },
  {
    id: "2",
    name: "Baseline Regression",
    status: "COMPLETED",
    version: "v2",
    accuracy: 0.14,
    loss: 0.86,
    created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    project: "default",
  },
  {
    id: "3",
    name: "Baseline Regression",
    status: "COMPLETED",
    version: "v3",
    accuracy: 0.12,
    loss: 0.88,
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
  { id: "m1", experiment_id: "1", version: "v1", epoch: 1, accuracy: 0.52, created_at: "" },
  { id: "m2", experiment_id: "1", version: "v1", epoch: 2, accuracy: 0.38, created_at: "" },
  { id: "m3", experiment_id: "1", version: "v1", epoch: 3, accuracy: 0.28, created_at: "" },
  { id: "m4", experiment_id: "1", version: "v1", epoch: 4, accuracy: 0.23, created_at: "" },
  { id: "m5", experiment_id: "1", version: "v1", epoch: 5, accuracy: 0.21, created_at: "" },
  { id: "m6", experiment_id: "2", version: "v2", epoch: 1, accuracy: 0.45, created_at: "" },
  { id: "m7", experiment_id: "2", version: "v2", epoch: 2, accuracy: 0.32, created_at: "" },
  { id: "m8", experiment_id: "2", version: "v2", epoch: 3, accuracy: 0.22, created_at: "" },
  { id: "m9", experiment_id: "2", version: "v2", epoch: 4, accuracy: 0.17, created_at: "" },
  { id: "m10", experiment_id: "2", version: "v2", epoch: 5, accuracy: 0.14, created_at: "" },
  { id: "m11", experiment_id: "3", version: "v3", epoch: 1, accuracy: 0.4, created_at: "" },
  { id: "m12", experiment_id: "3", version: "v3", epoch: 2, accuracy: 0.26, created_at: "" },
  { id: "m13", experiment_id: "3", version: "v3", epoch: 3, accuracy: 0.18, created_at: "" },
  { id: "m14", experiment_id: "3", version: "v3", epoch: 4, accuracy: 0.14, created_at: "" },
  { id: "m15", experiment_id: "3", version: "v3", epoch: 5, accuracy: 0.12, created_at: "" },
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
