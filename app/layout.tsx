import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Asad | Full Stack Developer',
  description: 'Full stack developer building digital solutions with React, Next.js, Node.js, and modern tools. Portfolio, projects, and journey.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className={poppins.className}>{children}</body>
    </html>
  )
}
