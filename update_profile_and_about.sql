-- ============================================
-- UPDATE PROFILE AND ABOUT DATA
-- ============================================
-- Run this in Supabase SQL Editor
-- This updates the hero section (profile) and about section content

-- Update Profile (Hero Section)
UPDATE profile 
SET 
  name = 'Asad',
  title = 'Full Stack Developer',
  description = 'Building intelligent, scalable applications powered by AI and modern web technologies.',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Update About Section
UPDATE about 
SET 
  title = 'About Me',
  content = 'Results-driven Full Stack Developer with 2+ years of experience architecting and optimizing scalable, high-performance web applications. Proficient in the JavaScript/TypeScript ecosystem (React, Next.js, Node.js) with proven expertise in system optimization, third-party API integration (QuickBooks, Twilio), and implementing AI-powered features with ChatGPT and LiveKit.

At NoveltySoft, I engineered a scalable Marketing Collateral System with document uploads, client assignments, and real-time status tracking, leading to a ~90% process efficiency improvement. I developed a Dynamic Forms Module for creating, assigning, and tracking client forms and approvals, resulting in an ~85% efficiency gain.

I designed and implemented a Role-Based Access Control (RBAC) system to manage feature permissions per agent or client, streamlining access management by ~90%. I also implemented Single Sign-On (SSO) for seamless switching between admin and client portals, reducing portal access time by ~95%.

My expertise in AI-powered solutions includes building and customizing communication tools using ChatGPT, LiveKit, and Twilio, including a pop-up widget and AI dialer, automating ~80% of communication and support processes. I automated financial and onboarding workflows by integrating QuickBooks and Zapier, automating ~85% of related processes.

Through refactoring and optimizing legacy codebases, I achieved a ~40% overall improvement in system performance and a significant reduction in bugs. I am passionate about writing clean, maintainable code and modern engineering practices.',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0000-000000000001';
