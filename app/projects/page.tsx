'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Projects from '@/components/Projects'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <article className="pt-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 sm:px-8 md:px-14 lg:px-20 xl:px-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Home
          </Link>
        </div>

        {/* Hero */}
        <header className="container mx-auto px-6 sm:px-8 md:px-14 lg:px-20 xl:px-24 pb-8 md:pb-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-2">
              Portfolio
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-[1.1]">
              My Work
            </h1>
            <p className="mt-4 text-base text-zinc-600 leading-relaxed">
              Full-stack development, AI integration, and digital solutions.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-colors w-fit"
            >
              Discuss a project
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </header>

        {/* Projects grid - all projects */}
        <section className="bg-zinc-50/60 border-t border-zinc-100">
          <Projects compact />
        </section>

        {/* CTA */}
        <section className="border-t border-zinc-100 bg-white py-16 md:py-20">
          <div className="container mx-auto px-6 sm:px-8 md:px-14 lg:px-20 xl:px-24">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
                Let&apos;s work together
              </h2>
              <p className="mt-3 text-zinc-600">
                Have a project in mind? Get in touch.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition-colors"
              >
                Contact
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </article>
      <Footer />
    </main>
  )
}
