-- ============================================
-- DATABASE MIGRATION: Project Categories (Admin-managed)
-- ============================================
-- Run this in Supabase SQL Editor
-- Categories like Clone, Original, Landing Page - used to filter projects

CREATE TABLE IF NOT EXISTS project_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read project categories" ON project_categories;
DROP POLICY IF EXISTS "Authenticated users can manage project categories" ON project_categories;

CREATE POLICY "Public can read project categories" ON project_categories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage project categories" ON project_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default categories (optional - can be managed via admin)
INSERT INTO project_categories (name, display_order) VALUES
('Original', 0),
('Clone', 1),
('Landing Page', 2),
('SaaS', 3),
('E-commerce', 4),
('Full-stack App', 5),
('API', 6),
('Other', 7)
ON CONFLICT (name) DO NOTHING;
