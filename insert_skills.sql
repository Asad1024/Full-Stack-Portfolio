-- ============================================
-- INSERT SKILLS DATA (CLEAN VERSION)
-- ============================================
-- Run this in Supabase SQL Editor
-- This will delete all existing skills and insert fresh data

-- Delete all existing skills to avoid duplicates
DELETE FROM skills;

-- Insert all skills
INSERT INTO skills (name, category, proficiency) VALUES
-- Programming Languages
('JavaScript', 'Programming Languages', 90),
('TypeScript', 'Programming Languages', 88),
('HTML5', 'Programming Languages', 95),
('CSS3', 'Programming Languages', 92),

-- Frontend
('React', 'Frontend', 90),
('Next.js', 'Frontend', 85),
('Redux', 'Frontend', 82),
('Material UI', 'Frontend', 80),
('Tailwind CSS', 'Frontend', 88),
('Bootstrap', 'Frontend', 85),

-- Backend
('Node.js', 'Backend', 87),
('Express', 'Backend', 85),
('REST APIs', 'Backend', 88),

-- Databases
('MySQL', 'Databases', 85),
('MongoDB', 'Databases', 82),
('Firebase Firestore', 'Databases', 80),

-- Tools & Platforms
('Git', 'Tools & Platforms', 90),
('GitHub', 'Tools & Platforms', 88),
('Postman', 'Tools & Platforms', 85),
('Figma', 'Tools & Platforms', 75),

-- Third-Party Integration
('ChatGPT (OpenAI)', 'Third-Party Integration', 80),
('LiveKit', 'Third-Party Integration', 70),
('Twilio', 'Third-Party Integration', 75),
('QuickBooks', 'Third-Party Integration', 70),
('Zapier', 'Third-Party Integration', 75),
('SendGrid', 'Third-Party Integration', 80);

-- ============================================
-- INSERT COMPLETE!
-- ============================================
-- All skills have been inserted with 6 categories:
-- 1. Programming Languages (4 skills)
-- 2. Frontend (6 skills)
-- 3. Backend (3 skills)
-- 4. Databases (3 skills)
-- 5. Tools & Platforms (4 skills)
-- 6. Third-Party Integration (6 skills)
-- Total: 26 skills
-- ============================================
