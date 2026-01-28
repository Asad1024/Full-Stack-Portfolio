-- ============================================
-- COMPLETE DATABASE SETUP FOR PORTFOLIO
-- ============================================
-- Run this entire file in Supabase SQL Editor
-- Go to: Dashboard > SQL Editor > New Query

-- ============================================
-- STEP 1: CREATE TABLES
-- ============================================

-- Profile Table (Single row - your main profile info)
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT '00000000-0000-0000-0000-000000000001'::uuid PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Table (Single row - about section content)
CREATE TABLE IF NOT EXISTS about (
  id UUID DEFAULT '00000000-0000-0000-0000-000000000001'::uuid PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'About Me',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Table (Multiple rows - your skills)
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table (Multiple rows - your projects)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT NOT NULL, -- JSON array stored as text
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  demo_video_url TEXT,
  role TEXT,
  published_date DATE,
  map_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Submissions Table (Messages from visitors)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 2: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: DROP EXISTING POLICIES (if any)
-- ============================================

-- Profile Policies
DROP POLICY IF EXISTS "Public can read profile" ON profile;
DROP POLICY IF EXISTS "Authenticated users can insert profile" ON profile;
DROP POLICY IF EXISTS "Authenticated users can update profile" ON profile;
DROP POLICY IF EXISTS "Only authenticated users can update profile" ON profile;
DROP POLICY IF EXISTS "Only authenticated users can insert profile" ON profile;

-- About Policies
DROP POLICY IF EXISTS "Public can read about" ON about;
DROP POLICY IF EXISTS "Authenticated users can insert about" ON about;
DROP POLICY IF EXISTS "Authenticated users can update about" ON about;
DROP POLICY IF EXISTS "Only authenticated users can update about" ON about;
DROP POLICY IF EXISTS "Only authenticated users can insert about" ON about;

-- Skills Policies
DROP POLICY IF EXISTS "Public can read skills" ON skills;
DROP POLICY IF EXISTS "Authenticated users can manage skills" ON skills;
DROP POLICY IF EXISTS "Only authenticated users can manage skills" ON skills;

-- Projects Policies
DROP POLICY IF EXISTS "Public can read projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON projects;
DROP POLICY IF EXISTS "Only authenticated users can manage projects" ON projects;

-- Contact Submissions Policies
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can read contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can update contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can delete contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Only authenticated users can read contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Only authenticated users can update contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Only authenticated users can delete contact submissions" ON contact_submissions;

-- ============================================
-- STEP 4: CREATE SECURITY POLICIES
-- ============================================

-- PROFILE POLICIES
-- Anyone can read profile (public access)
CREATE POLICY "Public can read profile" ON profile
  FOR SELECT USING (true);

-- Authenticated users can insert profile (for initial setup)
CREATE POLICY "Authenticated users can insert profile" ON profile
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update profile (admin access)
CREATE POLICY "Authenticated users can update profile" ON profile
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ABOUT POLICIES
-- Anyone can read about (public access)
CREATE POLICY "Public can read about" ON about
  FOR SELECT USING (true);

-- Authenticated users can insert about (for initial setup)
CREATE POLICY "Authenticated users can insert about" ON about
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update about (admin access)
CREATE POLICY "Authenticated users can update about" ON about
  FOR UPDATE USING (auth.role() = 'authenticated');

-- SKILLS POLICIES
-- Anyone can read skills (public access)
CREATE POLICY "Public can read skills" ON skills
  FOR SELECT USING (true);

-- Authenticated users can manage skills (admin access - all operations)
CREATE POLICY "Authenticated users can manage skills" ON skills
  FOR ALL USING (auth.role() = 'authenticated');

-- PROJECTS POLICIES
-- Anyone can read projects (public access)
CREATE POLICY "Public can read projects" ON projects
  FOR SELECT USING (true);

-- Authenticated users can manage projects (admin access - all operations)
CREATE POLICY "Authenticated users can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- CONTACT SUBMISSIONS POLICIES
-- Anyone can insert contact submissions (public can send messages)
CREATE POLICY "Anyone can insert contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Authenticated users can read contact submissions (admin access)
CREATE POLICY "Authenticated users can read contact submissions" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can update contact submissions (admin access)
CREATE POLICY "Authenticated users can update contact submissions" ON contact_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete contact submissions (admin access)
CREATE POLICY "Authenticated users can delete contact submissions" ON contact_submissions
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- STEP 5: INSERT INITIAL DATA (Optional)
-- ============================================

-- Insert default profile data
INSERT INTO profile (id, name, title, description) VALUES
('00000000-0000-0000-0000-000000000001', 'Full Stack Developer', 'Building Digital Solutions', 'Creating exceptional web experiences with modern technologies')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Insert default about data
INSERT INTO about (id, title, content) VALUES
('00000000-0000-0000-0000-000000000001', 'About Me', 'Experienced Full Stack Developer with a passion for creating innovative digital solutions. I specialize in building scalable web applications using modern technologies and best practices.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Insert sample skills (you can delete/modify these later via admin panel)
INSERT INTO skills (name, category, proficiency) VALUES
('React', 'Frontend', 90),
('Next.js', 'Frontend', 85),
('TypeScript', 'Language', 88),
('Node.js', 'Backend', 85),
('PostgreSQL', 'Database', 80),
('Supabase', 'Backend', 82),
('Tailwind CSS', 'Frontend', 88),
('JavaScript', 'Language', 90)
ON CONFLICT DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- 
-- Next Steps:
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. Create a user (any user you create will be an admin)
-- 3. Login at http://localhost:3000/admin
-- 4. Start managing your portfolio content!
--
-- Note: In Supabase, ANY authenticated user is an admin.
-- There's no separate admin role - if a user can login,
-- they can access the admin dashboard.
-- ============================================
