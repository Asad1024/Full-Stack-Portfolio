-- ============================================
-- MIGRATION: Projects – other images (no video in admin)
-- ============================================
-- Run in Supabase SQL Editor.
-- Adds other_images (JSON array of URLs). Admin will use thumbnail (image_url) + other images.
-- demo_video_url column is left in DB for existing data but not used in admin.

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS other_images TEXT;

-- other_images stores JSON array of image URLs, e.g. ["https://...", "https://..."]
