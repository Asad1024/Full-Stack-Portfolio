-- ============================================
-- JOURNEY TABLE FOR PORTFOLIO
-- ============================================
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS journey (
  id UUID DEFAULT '00000000-0000-0000-0000-000000000001'::uuid PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'My Journey',
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE journey ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Journey is viewable by everyone"
  ON journey FOR SELECT
  USING (true);

-- Allow authenticated users (admin) to update
CREATE POLICY "Authenticated users can update journey"
  ON journey FOR ALL
  USING (auth.role() = 'authenticated');

INSERT INTO journey (id, title, content, image_url)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'My Journey',
  'Add your professional journey, education, and experience here. You can edit this in the Admin > Journey section.',
  NULL
)
ON CONFLICT (id) DO NOTHING;
