# Email Setup Guide

## Problem
Contact form submissions are saved to the database and visible in the admin panel, but emails are not being sent to your Gmail.

## Solution
The contact form now uses **Resend** to send emails. Follow these steps to set it up:

## Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (free tier includes 3,000 emails/month)
3. Verify your email address

## Step 2: Get Your API Key

1. After logging in, go to **API Keys** in the sidebar
2. Click **Create API Key**
3. Give it a name (e.g., "Portfolio Contact Form")
4. Copy the API key (starts with `re_`)

## Step 3: Add API Key to Environment Variables

1. Open your `.env.local` file (create it if it doesn't exist)
2. Add your Resend API key:

```env
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=your-email@gmail.com
```

Replace:
- `re_your_api_key_here` with your actual Resend API key
- `your-email@gmail.com` with your Gmail address where you want to receive contact form emails

## Step 4: Verify Your Domain (Optional but Recommended)

For production use, you should verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Follow the DNS setup instructions
4. Once verified, update the `from` field in `app/api/contact/route.ts`:
   ```typescript
   from: 'Portfolio Contact <contact@yourdomain.com>',
   ```

**Note:** For testing, you can use `onboarding@resend.dev` (already configured), but emails will be limited.

## Step 5: Restart Your Development Server

After adding the environment variables:

```bash
npm run dev
```

## Step 6: Test the Contact Form

1. Fill out the contact form on your portfolio
2. Submit it
3. Check your Gmail inbox (and spam folder)
4. You should receive an email with the contact form details

## Troubleshooting

### Emails not arriving?

1. **Check Resend Dashboard**: Go to Resend dashboard > **Logs** to see if emails were sent
2. **Check Spam Folder**: Emails might be in spam initially
3. **Verify API Key**: Make sure `RESEND_API_KEY` is correct in `.env.local`
4. **Check Console**: Look for errors in your terminal/console
5. **Verify Email Address**: Make sure `CONTACT_EMAIL` is correct

### Still using onboarding@resend.dev?

- This is fine for testing, but has limitations
- For production, verify your domain in Resend
- Update the `from` field in the contact route

## How It Works

1. User submits contact form
2. Form data is saved to Supabase database (for admin panel)
3. Email is sent via Resend to your Gmail
4. You receive the email with all form details
5. You can reply directly to the email (reply-to is set to the sender's email)

## Email Format

The email includes:
- Sender's name and email
- Subject line
- Message content
- Reply-to is set to the sender's email for easy replies

## Alternative: Use Your Profile Email

The system will automatically try to use the email from your profile table. If you have an `email` field in your profile, it will use that. Otherwise, it uses `CONTACT_EMAIL` from environment variables.
