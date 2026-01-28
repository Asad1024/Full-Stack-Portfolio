-- ============================================
-- PROFESSIONAL SKILLS DATA (RECOMMENDED VERSION)
-- ============================================
-- Run this in Supabase SQL Editor
-- This will delete all existing skills and insert professional skills data

-- Delete all existing skills to avoid duplicates
DELETE FROM skills;

-- Insert professional skills with proper categorization
INSERT INTO skills (name, category, proficiency, category_order, skill_order) VALUES

-- 1. Programming Languages (category_order: 0)
('JavaScript', 'Programming Languages', 90, 0, 0),
('TypeScript', 'Programming Languages', 88, 0, 1),
('HTML5', 'Programming Languages', 95, 0, 2),
('CSS3', 'Programming Languages', 92, 0, 3),

-- 2. Frontend Development (category_order: 1)
('React', 'Frontend Development', 90, 1, 0),
('Next.js', 'Frontend Development', 85, 1, 1),
('Redux', 'Frontend Development', 82, 1, 2),
('Material UI', 'Frontend Development', 80, 1, 3),
('Tailwind CSS', 'Frontend Development', 88, 1, 4),
('Bootstrap', 'Frontend Development', 85, 1, 5),

-- 3. Backend Development (category_order: 2)
('Node.js', 'Backend Development', 87, 2, 0),
('Express', 'Backend Development', 85, 2, 1),
('REST APIs', 'Backend Development', 88, 2, 2),

-- 4. Databases (category_order: 3)
('MySQL', 'Databases', 85, 3, 0),
('MongoDB', 'Databases', 82, 3, 1),
('Firebase Firestore', 'Databases', 80, 3, 2),

-- 5. AI & Machine Learning (category_order: 4)
('ChatGPT (OpenAI)', 'AI & Machine Learning', 80, 4, 0),
('ElevenLabs', 'AI & Machine Learning', 75, 4, 1),
('Hugging Face', 'AI & Machine Learning', 70, 4, 2),

-- 6. Design & Development Tools (category_order: 5)
('Figma', 'Design & Development Tools', 75, 5, 0),
('Adobe Illustrator', 'Design & Development Tools', 70, 5, 1),
('Git', 'Design & Development Tools', 90, 5, 2),
('GitHub', 'Design & Development Tools', 88, 5, 3),
('Postman', 'Design & Development Tools', 85, 5, 4),
('LiveKit', 'Design & Development Tools', 70, 5, 5),
('Twilio', 'Design & Development Tools', 75, 5, 6),
('SendGrid', 'Design & Development Tools', 80, 5, 7),
('Zapier', 'Design & Development Tools', 75, 5, 8);

-- ============================================
-- INSERT COMPLETE!
-- ============================================
-- Professional skills structure:
-- 1. Programming Languages (4 skills)
-- 2. Frontend Development (6 skills)
-- 3. Backend Development (3 skills)
-- 4. Databases (3 skills)
-- 5. AI & Machine Learning (3 skills)
-- 6. Design & Development Tools (9 skills)
-- Total: 28 skills across 6 professional categories
-- ============================================
