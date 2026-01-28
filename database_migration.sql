-- ============================================
-- DATABASE MIGRATION - ADD IMAGE AND VIDEO FIELDS
-- ============================================
-- Run this in Supabase SQL Editor if tables already exist
-- This adds new columns for images and videos

-- Add profile image URL
ALTER TABLE profile 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add skill image URL
ALTER TABLE skills 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add demo video URL to projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS demo_video_url TEXT;

-- Add role, published date, and map URL for project modal
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS role TEXT;

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS published_date DATE;

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS map_url TEXT;

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
