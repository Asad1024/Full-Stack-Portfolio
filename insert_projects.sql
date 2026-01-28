-- ============================================
-- INSERT NEW PROJECTS
-- ============================================
-- Run this in Supabase SQL Editor
-- This removes all existing projects and inserts new ones

-- Delete all existing projects
DELETE FROM projects;

-- Insert new projects
INSERT INTO projects (title, description, technologies, role, featured) VALUES
(
  'MysticShop – Ecommerce Platform',
  'Architected a full-stack e-commerce platform with user authentication, shopping cart, and Stripe payments, delivering a seamless end-to-end customer experience.',
  '["React", "Node.js", "MongoDB"]',
  'Full-Stack Developer',
  true
),
(
  'House Marketplace – Real Estate Web App',
  'Engineered a property listing application featuring user authentication and an interactive Mapbox-based search to visually explore listing locations.',
  '["React", "Firebase", "Mapbox"]',
  'Full-Stack Developer',
  true
),
(
  'TubeVibe – YouTube Clone Web App',
  'Built a feature-rich YouTube clone with video search, filtering, and channel pages by consuming and managing data from the RapidAPI.',
  '["React", "Material UI", "RapidAPI"]',
  'Frontend Developer',
  true
),
(
  'Gold''s Gym – Fitness Web App',
  'Developed a fitness application that displays categorized exercises with integrated YouTube demo videos and search functionality.',
  '["React", "RapidAPI", "YouTube API"]',
  'Frontend Developer',
  true
);
