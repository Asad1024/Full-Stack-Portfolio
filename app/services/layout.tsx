import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services | Asad — Full Stack Developer',
  description: 'End-to-end digital solutions: strategy, design, development, and delivery. Built for scale and long-term partnership.',
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
