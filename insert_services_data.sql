-- ============================================
-- MIGRATION: Replace all services (no duplicates)
-- ============================================
-- Run this in Supabase SQL Editor. It removes existing services and inserts the new set.
-- Descriptions use newline (\n) for bullet points — displayed as bullets on the site.

-- Remove existing services
DELETE FROM services;

-- Insert new services (no duplicate titles or overlapping offerings)
INSERT INTO services (title, description, icon, display_order) VALUES
(
  'AI & Machine Learning',
  E'Custom AI solutions tailored to your business.\n• ML models, NLP, and computer vision\n• Intelligent automation and decision systems\n• Chatbots, recommendations, and predictive analytics\n• Strategy, design, and implementation',
  'brain',
  0
),
(
  'Web Application Development',
  E'Modern web apps built for scale and performance.\n• Responsive sites and single-page applications\n• Next.js, React, and modern frameworks\n• Performance optimization and SEO\n• Cross-browser and accessibility standards',
  'globe',
  1
),
(
  'Full-Stack Engineering',
  E'End-to-end development from UI to infrastructure.\n• Frontend, backend, and database design\n• Single team, consistent architecture\n• Deployment and DevOps integration\n• Scalable and maintainable codebases',
  'layers',
  2
),
(
  'Custom Software Development',
  E'Bespoke software for web, desktop, and cloud.\n• Requirements and architecture design\n• Scalable, secure, and maintainable systems\n• Web, desktop, and cloud-native apps\n• Long-term support and iteration',
  'code2',
  3
),
(
  'Back-End Development & APIs',
  E'Robust server-side logic and APIs.\n• RESTful and GraphQL API design\n• Database design and optimization\n• Server logic and cloud infrastructure\n• Security, auth, and rate limiting',
  'server',
  4
),
(
  'Front-End & User Interface',
  E'Polished, fast, and accessible user interfaces.\n• React, Next.js, and modern CSS\n• Responsive and mobile-first design\n• Performance and core web vitals\n• Accessibility (a11y) and UX best practices',
  'monitor',
  5
),
(
  'API Design & Integration',
  E'APIs and integrations that connect your systems.\n• REST and GraphQL API design\n• Third-party and internal integrations\n• Documentation and developer experience\n• Versioning and backward compatibility',
  'workflow',
  6
),
(
  'System Modernization & Migration',
  E'Upgrade legacy systems without disruption.\n• Assessment and refactoring plans\n• Migration to modern stacks\n• Incremental rollout and rollback\n• Training and documentation',
  'refresh-cw',
  7
),
(
  'DevOps & Process Automation',
  E'Automation and pipelines to ship faster.\n• CI/CD pipelines and deployment\n• Workflow and task automation\n• Scripting and tooling\n• Monitoring and incident response',
  'zap',
  8
);
