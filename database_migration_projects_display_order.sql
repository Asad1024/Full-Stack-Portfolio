-- Add display_order to projects for admin-controlled ordering
ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
