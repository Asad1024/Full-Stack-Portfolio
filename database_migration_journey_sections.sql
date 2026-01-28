-- ============================================
-- JOURNEY SECTIONS (Who I Am, What I Do, Goals, etc.)
-- ============================================
-- Run in Supabase SQL Editor after database_migration_journey.sql

-- Add new columns (safe to run multiple times with IF NOT EXISTS pattern)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journey' AND column_name = 'headline') THEN
    ALTER TABLE journey ADD COLUMN headline TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journey' AND column_name = 'who_i_am') THEN
    ALTER TABLE journey ADD COLUMN who_i_am TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journey' AND column_name = 'what_i_do') THEN
    ALTER TABLE journey ADD COLUMN what_i_do TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journey' AND column_name = 'short_term_goals') THEN
    ALTER TABLE journey ADD COLUMN short_term_goals TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journey' AND column_name = 'long_term_goals') THEN
    ALTER TABLE journey ADD COLUMN long_term_goals TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journey' AND column_name = 'experience') THEN
    ALTER TABLE journey ADD COLUMN experience TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journey' AND column_name = 'how_i_work') THEN
    ALTER TABLE journey ADD COLUMN how_i_work TEXT DEFAULT '';
  END IF;
END $$;

-- Backfill: copy content to who_i_am if who_i_am is empty
UPDATE journey SET who_i_am = content WHERE (who_i_am IS NULL OR who_i_am = '') AND content IS NOT NULL AND content != '';
