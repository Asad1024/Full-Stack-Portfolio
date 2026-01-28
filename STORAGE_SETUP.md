# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for image uploads in your portfolio admin panel.

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **New bucket**
5. Create a bucket with these settings:
   - **Name**: `portfolio-assets`
   - **Public bucket**: ✅ **Enable** (check this box)
   - **File size limit**: 5 MB (or your preferred limit)
   - **Allowed MIME types**: `image/*` (or leave empty for all types)

6. Click **Create bucket**

## Step 2: Set Up Storage Policies

**IMPORTANT**: Storage policies MUST be set up using the Dashboard UI. SQL scripts cannot modify storage policies directly.

### Using Policy Editor (Required Method)

1. Click on the `portfolio-assets` bucket in Storage
2. Go to the **Policies** tab
3. Click **New Policy**
4. Select **For full customization** (or use the template if available)
5. Create these 3 policies:

**Policy 1: Allow Authenticated Users to Upload**
- **Policy name**: `Authenticated users can upload`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **USING expression**: (leave empty)
- **WITH CHECK expression**: `bucket_id = 'portfolio-assets'`
- Click **Review** then **Save policy**

**Policy 2: Allow Public to Read**
- **Policy name**: `Public can read`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: `bucket_id = 'portfolio-assets'`
- **WITH CHECK expression**: (leave empty)
- Click **Review** then **Save policy**

**Policy 3: Allow Authenticated Users to Delete**
- **Policy name**: `Authenticated users can delete`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **USING expression**: `bucket_id = 'portfolio-assets'`
- **WITH CHECK expression**: (leave empty)
- Click **Review** then **Save policy**

## Step 3: Verify Setup

1. Go to your admin panel: `http://localhost:3000/admin`
2. Try uploading an image in any of the forms:
   - Profile Settings → Profile Image
   - Skills → Skill Image
   - Projects → Project Image

3. The uploaded image should appear in your Supabase Storage bucket

## Troubleshooting

### Error: "new row violates row-level security policy"

- Make sure you're logged in to the admin panel
- Check that the storage policies are set up correctly
- Verify the bucket name is exactly `portfolio-assets`

### Error: "Bucket not found"

- Make sure the bucket name in `lib/supabase/storage.ts` matches your bucket name
- The bucket must be public for images to be accessible

### Images not displaying

- Check that the bucket is set to **Public**
- Verify the image URL is correct in the database
- Check browser console for CORS errors

## File Structure in Storage

Images will be stored in the following structure:
```
portfolio-assets/
  ├── profile/
  │   └── [timestamp]-[random].jpg
  ├── skills/
  │   └── [timestamp]-[random].png
  └── projects/
      └── [timestamp]-[random].jpg
```

## Notes

- Maximum file size: 5MB (configurable in bucket settings)
- Supported formats: All image formats (jpg, png, gif, webp, etc.)
- Images are automatically given unique names to prevent conflicts
- Old images are not automatically deleted when you upload new ones (you may want to clean up manually)
