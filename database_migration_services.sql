-- ============================================
-- DATABASE MIGRATION: Services
-- ============================================
-- Run this in Supabase SQL Editor
-- Adds a services table for the Services section (admin-managed)

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "Public can read services" ON services;
CREATE POLICY "Public can read services" ON services
  FOR SELECT USING (true);

-- Authenticated full access (admin)
DROP POLICY IF EXISTS "Authenticated users can manage services" ON services;
CREATE POLICY "Authenticated users can manage services" ON services
  FOR ALL USING (auth.role() = 'authenticated');

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
