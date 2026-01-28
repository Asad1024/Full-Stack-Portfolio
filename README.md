# Professional Portfolio - Full Stack Developer

A modern, professional portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features a clean, monochrome design and a complete admin dashboard for content management.

## Features

- **Professional Design**: Clean, monochrome UI with smooth animations
- **Fully Dynamic**: All content managed through Supabase database
- **Admin Dashboard**: Secure login system with full CRUD operations
- **Responsive**: Works perfectly on all devices
- **SEO Optimized**: Built with Next.js for optimal performance

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form + Zod validation

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Follow the setup instructions in `SUPABASE_SETUP.md`
3. Create your admin user in Supabase Authentication

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

1. Navigate to `/admin`
2. Login with your Supabase admin credentials
3. Manage all portfolio content:
   - Profile information
   - About section
   - Skills & Technologies
   - Projects
   - Contact submissions

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin dashboard page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── admin/            # Admin components
│   ├── Header.tsx        # Navigation header
│   ├── Hero.tsx          # Hero section
│   ├── About.tsx         # About section
│   ├── Skills.tsx        # Skills section
│   ├── Projects.tsx      # Projects section
│   ├── Contact.tsx       # Contact form
│   └── Footer.tsx        # Footer
├── lib/
│   └── supabase/         # Supabase client configuration
└── SUPABASE_SETUP.md     # Database setup instructions
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The site will be live at `your-project.vercel.app`

### Other Platforms

This Next.js app can be deployed to:
- Netlify
- Railway
- Render
- AWS Amplify

## Customization

- **Colors**: Edit `tailwind.config.ts` for color scheme
- **Fonts**: Change font in `app/layout.tsx`
- **Content**: Use admin dashboard to update all content
- **Sections**: Add/remove sections in `app/page.tsx`

## License

MIT License - feel free to use this for your portfolio!
