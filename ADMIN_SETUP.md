# Admin User Setup Guide

## How Admin Works in This Portfolio

**Important:** In Supabase, there's no separate "admin" role. **ANY authenticated user** (any user you create in Supabase Authentication) will have admin access to your portfolio dashboard.

## Creating Your Admin User

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Select your project: `lgonxhiavrtisgoxxnzi`

### Step 2: Create Admin User
1. Click **"Authentication"** in the left sidebar
2. Click **"Users"** tab
3. Click **"Add User"** button (top right)
4. Select **"Create new user"**

### Step 3: Fill in User Details
- **Email**: Enter your email (e.g., `admin@yourdomain.com` or `yourname@gmail.com`)
- **Password**: Create a strong password
- **Auto Confirm User**: **Turn this ON** ✅ (this skips email verification)
- **Send invitation email**: Turn this OFF (optional)

### Step 4: Create User
Click **"Create User"**

## That's It!

The user you just created is now an **admin**. They can:
- Login at `/admin`
- Edit profile, about, skills, projects
- View contact submissions
- Manage all portfolio content

## Multiple Admins

You can create multiple admin users:
- Each user you create in Supabase Authentication becomes an admin
- They can all login and manage the portfolio
- Useful if you want to give access to team members

## Testing Admin Access

1. Go to: http://localhost:3000/admin
2. Enter the email and password you just created
3. You should see the admin dashboard!

## Troubleshooting

### "Invalid login credentials"
- Make sure you're using the exact email you created
- Check if password is correct
- Make sure "Auto Confirm User" was enabled when creating the user

### "Unauthorized" error when updating
- Make sure you ran the complete `database_setup.sql` file
- Check that RLS policies were created successfully
- Try logging out and logging back in

### User not found
- Go to Authentication > Users
- Check if the user exists
- If not, create a new user

## Security Note

Since ANY authenticated user is an admin, be careful:
- Only create users you trust
- Use strong passwords
- Don't share admin credentials publicly
- If you need to revoke access, delete the user from Authentication > Users
