-- ============================================
-- DATABASE MIGRATION: Contact Information
-- ============================================
-- Run this in Supabase SQL Editor
-- This adds contact information fields to the profile table

-- Add contact information columns to profile table
ALTER TABLE profile 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Update existing profile with default contact info (optional)
UPDATE profile 
SET 
  email = COALESCE(email, 'contact@example.com'),
  phone = COALESCE(phone, '+1 (555) 123-4567'),
  location = COALESCE(location, 'Available Worldwide')
WHERE id = '00000000-0000-0000-0000-000000000001';
