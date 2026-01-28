# Journey Page Setup

## 1. Create the database table

Run the migration in Supabase SQL Editor:

1. Open your Supabase project → **SQL Editor** → New query
2. Copy and run the contents of `database_migration_journey.sql`

This creates the `journey` table and RLS policies.

## 2. Add your journey content

1. Go to **Admin** → **Journey**
2. Set the page title (e.g. "My Journey")
3. Upload or enter an image URL (or leave blank to use your profile image)
4. Paste or write your journey content (education, experience, story). Use one paragraph per block; each new line becomes a new paragraph on the page.

## 3. Where Journey appears

- **Nav**: "Journey" link in the header (opens `/journey`)
- **About section**: "Read my full journey →" link below the about text
- **Journey page**: `/journey` — classic layout with your image and full journey content

You can paste content from your resume/PDF into the Journey content field in Admin.
