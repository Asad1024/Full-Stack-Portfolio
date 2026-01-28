-- ============================================
-- DATABASE MIGRATION: Project Filter Categories
-- ============================================
-- Run this in Supabase SQL Editor
-- This adds a table for managing project filter categories

-- Create project_filters table
CREATE TABLE IF NOT EXISTS project_filters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE project_filters ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can read project filters" ON project_filters;
DROP POLICY IF EXISTS "Authenticated users can manage project filters" ON project_filters;

-- Create policies
-- Public can read active filters
CREATE POLICY "Public can read project filters" ON project_filters
  FOR SELECT USING (is_active = true);

-- Authenticated users can manage filters (admin access)
CREATE POLICY "Authenticated users can manage project filters" ON project_filters
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default filter categories (optional - can be managed via admin)
INSERT INTO project_filters (name, display_order, is_active) VALUES
('All', 0, true),
('React', 1, true),
('Next.js', 2, true),
('TypeScript', 3, true),
('Node.js', 4, true),
('Full Stack', 5, true)
ON CONFLICT (name) DO NOTHING;
