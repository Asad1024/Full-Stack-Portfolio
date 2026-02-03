import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects | Asad — Full Stack Developer',
  description: 'A complete collection of projects spanning full-stack development, AI integration, and digital solutions.',
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
