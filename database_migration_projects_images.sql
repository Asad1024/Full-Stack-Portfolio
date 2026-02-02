-- ============================================
-- MIGRATION: Projects – Thumbnail + Other Images (no video)
-- ============================================
-- Run this in Supabase SQL Editor if your projects table already exists.
-- Brings projects table up to date: thumbnail (image_url) + other images (other_images).
-- Video tutorial removed from admin; demo_video_url is no longer used.

-- 1. Add other_images (JSON array of image URLs, stored as TEXT)
-- Example: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS other_images TEXT;

-- 2. Ensure other project columns exist (safe if already present)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS published_date DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS map_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 3. Optional: remove demo_video_url (uncomment to drop)
-- ALTER TABLE projects DROP COLUMN IF EXISTS demo_video_url;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- After running:
-- - image_url = thumbnail image (one per project)
-- - other_images = JSON array of extra image URLs (shown under green link box in modal)
-- - demo_video_url remains in DB but is unused; uncomment step 3 to remove it
