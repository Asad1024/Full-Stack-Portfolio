-- ============================================
-- DATABASE MIGRATION: Skills Ordering
-- ============================================
-- Run this in Supabase SQL Editor
-- This adds ordering fields to the skills table

-- Add ordering columns to skills table
ALTER TABLE skills 
ADD COLUMN IF NOT EXISTS category_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS skill_order INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_skills_category_order ON skills(category_order);
CREATE INDEX IF NOT EXISTS idx_skills_skill_order ON skills(skill_order);

-- Update existing skills with default order values based on category and name
-- This will set initial ordering based on alphabetical order
DO $$
DECLARE
    cat RECORD;
    skill_rec RECORD;
    cat_order_counter INTEGER := 0;
    skill_order_counter INTEGER;
BEGIN
    -- First, set category_order for each unique category
    FOR cat IN 
        SELECT DISTINCT category 
        FROM skills 
        ORDER BY category
    LOOP
        UPDATE skills 
        SET category_order = cat_order_counter 
        WHERE category = cat.category;
        
        -- Then set skill_order within each category
        skill_order_counter := 0;
        FOR skill_rec IN
            SELECT id 
            FROM skills 
            WHERE category = cat.category 
            ORDER BY name
        LOOP
            UPDATE skills 
            SET skill_order = skill_order_counter 
            WHERE id = skill_rec.id;
            
            skill_order_counter := skill_order_counter + 1;
        END LOOP;
        
        cat_order_counter := cat_order_counter + 1;
    END LOOP;
END $$;
