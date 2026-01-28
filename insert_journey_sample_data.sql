-- ============================================
-- SAMPLE JOURNEY DATA (based on portfolio profile)
-- ============================================
-- Run AFTER database_migration_journey.sql and database_migration_journey_sections.sql
-- in Supabase SQL Editor.
-- Edit names, dates, and companies to match your real resume.

UPDATE journey
SET
  title = 'My Journey',
  headline = E'Full-stack developer who thinks in systems and builds for the long term. I focus on clean architecture, maintainable code, and products that scale.\n\nMy work spans the stack—from React and Next.js on the front end to Node and Express on the back end, with SQL and NoSQL databases and modern tooling. I integrate AI where it adds value and care deeply about design and user experience.\n\nHere is how I got here and where I am headed.',
  who_i_am = 'I''m a full-stack developer with a focus on building reliable, scalable digital products. I care about clean architecture, user experience, and shipping things that last.

I started in web development and have grown into full-stack work—frontend with React and Next.js, backend with Node and Express, and databases from MySQL to MongoDB and Firebase. I also work with AI tools and integrations (OpenAI, ElevenLabs, Hugging Face) and design in Figma and Adobe Illustrator when needed.

What drives me is solving real problems with code and designing systems that are easy to maintain and extend.',
  what_i_do = 'Full-stack web development (React, Next.js, Node.js, TypeScript)
REST API design and backend services
Database design and implementation (MySQL, MongoDB, Firebase)
UI/UX implementation with Tailwind, Material UI, and Bootstrap
AI integrations (OpenAI, ElevenLabs, Hugging Face)
Design support (Figma, Adobe Illustrator) and design-to-code
Real-time and communication APIs (LiveKit, Twilio, SendGrid, Zapier)',
  short_term_goals = 'Ship and iterate on side projects and portfolio pieces
Deepen experience with AI/ML tooling and integrations
Contribute to open source and share learnings',
  long_term_goals = 'Lead or heavily influence product and technical direction
Build products that scale and stay maintainable
Mentor others and grow as a technical leader',
  experience = 'Present · Full-stack development — Building web apps, APIs, and integrations. Tech: React, Next.js, Node, TypeScript, SQL/NoSQL.
Earlier roles · Web and software development — Frontend and backend work, API integrations, and cross-functional collaboration.',
  how_i_work = 'User-first and outcome-focused
Iterative: ship, learn, improve
Clean code and sensible architecture
Design and development together
Documentation and communication',
  content = 'Add your professional journey, education, and experience here. You can edit this in the Admin > Journey section.',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;

-- ============================================
-- DONE. Check your Journey page and Admin > Journey to edit.
-- ============================================
