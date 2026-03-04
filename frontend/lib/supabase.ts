import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (null as unknown as SupabaseClient);

export type Experiment = {
  id: string;
  name: string;
  status: string;
  version: string;
  accuracy: number | null;
  loss: number | null;
  created_at: string;
  project: string | null;
};

export type Deployment = {
  id: string;
  experiment_id: string;
  status: string;
  created_at: string;
};

export type ExperimentMetric = {
  id: string;
  experiment_id: string;
  version: string;
  epoch: number;
  accuracy: number;
  created_at: string;
};
