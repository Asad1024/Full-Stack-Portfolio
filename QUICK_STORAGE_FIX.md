# Super Simple Storage Setup

## Just 2 Steps!

### Step 1: Create Bucket
1. Go to Supabase Dashboard → **Storage**
2. Click **New bucket**
3. Name: `portfolio-assets`
4. ✅ **Enable "Public bucket"**
5. Click **Create**

### Step 2: Create Simple Policies (3 clicks)

Click on `portfolio-assets` → **Policies** tab → Create these 3 policies:

**Policy 1 - Upload:**
- Operation: `INSERT`
- Role: `authenticated` 
- WITH CHECK: `bucket_id = 'portfolio-assets'`

**Policy 2 - Read:**
- Operation: `SELECT`
- Role: `public`
- USING: `bucket_id = 'portfolio-assets'`

**Policy 3 - Delete:**
- Operation: `DELETE`
- Role: `authenticated`
- USING: `bucket_id = 'portfolio-assets'`

**That's it!** Now upload images and they'll work.
