-- ModelForge: experiments and deployments for dashboard
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- Experiments (runs)
CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('RUNNING', 'COMPLETED', 'FAILED')),
  version TEXT NOT NULL,
  accuracy NUMERIC(5,2),
  loss NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  project TEXT DEFAULT 'default'
);

-- Deployment status per experiment
CREATE TABLE IF NOT EXISTS deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('DEPLOYING', 'DEPLOYED', 'RUNNING', 'FAILED')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Accuracy per epoch (for chart)
CREATE TABLE IF NOT EXISTS experiment_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  epoch INT NOT NULL,
  accuracy NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed data: Baseline Regression experiments (MSE in accuracy column, R² in loss column)
INSERT INTO experiments (name, status, version, accuracy, loss, created_at, project) VALUES
  ('Baseline Regression', 'RUNNING', 'v1', 0.21, 0.79, now() - interval '2 days', 'default'),
  ('Baseline Regression', 'COMPLETED', 'v2', 0.14, 0.86, now() - interval '1 day', 'default'),
  ('Baseline Regression', 'COMPLETED', 'v3', 0.12, 0.88, now() - interval '1 hour', 'default')
;

-- Deployment badges (run after experiments exist)
INSERT INTO deployments (experiment_id, status)
SELECT id, 'DEPLOYED' FROM experiments WHERE version = 'v3'
UNION ALL
SELECT id, 'DEPLOYED' FROM experiments WHERE version = 'v2'
UNION ALL
SELECT id, 'RUNNING' FROM experiments WHERE version = 'v1';

-- Epoch metrics for chart (MSE per run; accuracy column stores MSE)
INSERT INTO experiment_metrics (experiment_id, version, epoch, accuracy)
SELECT e.id, e.version, s.epoch, s.accuracy
FROM experiments e
CROSS JOIN (
  SELECT 1 AS epoch, 0.52 AS accuracy UNION SELECT 2, 0.38 UNION SELECT 3, 0.28 UNION SELECT 4, 0.23 UNION SELECT 5, 0.21
) s
WHERE e.version = 'v1'
UNION ALL
SELECT e.id, e.version, s.epoch, s.accuracy
FROM experiments e
CROSS JOIN (
  SELECT 1 AS epoch, 0.45 AS accuracy UNION SELECT 2, 0.32 UNION SELECT 3, 0.22 UNION SELECT 4, 0.17 UNION SELECT 5, 0.14
) s
WHERE e.version = 'v2'
UNION ALL
SELECT e.id, e.version, s.epoch, s.accuracy
FROM experiments e
CROSS JOIN (
  SELECT 1 AS epoch, 0.40 AS accuracy UNION SELECT 2, 0.26 UNION SELECT 3, 0.18 UNION SELECT 4, 0.14 UNION SELECT 5, 0.12
) s
WHERE e.version = 'v3';

-- RLS: allow read for anon (for public dashboard; tighten in production)
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read experiments" ON experiments FOR SELECT USING (true);
CREATE POLICY "Allow public read deployments" ON deployments FOR SELECT USING (true);
CREATE POLICY "Allow public read experiment_metrics" ON experiment_metrics FOR SELECT USING (true);
