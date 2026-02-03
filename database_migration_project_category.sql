-- Add category column to projects for filtering (Clone, Original, Landing Page, etc.)
-- Run this in Supabase SQL Editor

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Original';

-- Optional: Backfill existing projects
-- UPDATE projects SET category = 'Original' WHERE category IS NULL;

COMMENT ON COLUMN projects.category IS 'Project type: Clone, Original, Landing Page, SaaS, E-commerce, Full-stack App, API, Other';
