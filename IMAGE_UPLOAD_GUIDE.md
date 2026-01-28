# Image Upload Guide

## Where Images Are Uploaded

Images are uploaded to **Supabase Storage** in a bucket called `portfolio-assets`. 

### Storage Location

- **Service**: Supabase Storage
- **Bucket Name**: `portfolio-assets`
- **Access**: Public (images are publicly accessible via URL)
- **Structure**:
  - Profile images: `portfolio-assets/profile/[filename]`
  - Skill images: `portfolio-assets/skills/[filename]`
  - Project images: `portfolio-assets/projects/[filename]`

## How It Works

1. **Upload Process**:
   - When you select a file in the admin panel, it's uploaded directly to Supabase Storage
   - The file gets a unique name: `[timestamp]-[random].ext`
   - After upload, you get a public URL that's automatically saved to the database

2. **Two Options**:
   - **Upload File**: Click "Upload Image" button to select and upload a file
   - **Enter URL**: Type or paste an image URL if the image is already hosted elsewhere

3. **Image Preview**:
   - After uploading or entering a URL, you'll see a preview of the image
   - This helps verify the image is correct before saving

## Setup Required

Before you can upload images, you need to:

1. **Create the Storage Bucket** in Supabase Dashboard
2. **Set up Storage Policies** for security
3. **Make the bucket public** so images can be accessed

📖 **See `STORAGE_SETUP.md` for detailed setup instructions**

## File Limits

- **Maximum file size**: 5MB
- **Supported formats**: All image formats (jpg, png, gif, webp, svg, etc.)
- **Validation**: The system checks file type and size before uploading

## Accessing Uploaded Images

Once uploaded, images are accessible via public URLs like:
```
https://[your-project].supabase.co/storage/v1/object/public/portfolio-assets/profile/1234567890-abc123.jpg
```

These URLs are automatically stored in your database and used to display images on your portfolio.

## Troubleshooting

### "Upload failed" error
- Check that the Supabase Storage bucket exists
- Verify storage policies are set up correctly
- Make sure you're logged in to the admin panel
- Check file size (must be under 5MB)

### Images not showing
- Verify the bucket is set to **Public**
- Check the image URL in the database
- Clear browser cache and refresh

### "Bucket not found"
- The bucket name must be exactly `portfolio-assets`
- Check that the bucket exists in Supabase Dashboard → Storage
