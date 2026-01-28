'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowLeft } from 'lucide-react'

interface JourneyData {
  title: string
  content: string
  imageUrl?: string | null
  headline?: string
  whoIAm?: string
  whatIDo?: string
  shortTermGoals?: string
  longTermGoals?: string
  experience?: string
  howIWork?: string
}

const parseLines = (text: string | undefined) =>
  (text ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

export default function JourneyPage() {
  const [journey, setJourney] = useState<JourneyData | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const res = await fetch('/api/journey')
        if (res.ok) {
          const data = await res.json()
          if (data) setJourney(data)
        }
      } catch (error) {
        console.error('Error fetching journey:', error)
      }
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          if (data?.imageUrl) setProfileImage(data.imageUrl)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    fetchJourney()
    fetchProfile()
  }, [])

  const imageUrl = journey?.imageUrl || profileImage
  const whatIDoList = parseLines(journey?.whatIDo)
  const shortTermList = parseLines(journey?.shortTermGoals)
  const longTermList = parseLines(journey?.longTermGoals)
  const experienceList = parseLines(journey?.experience)
  const howIWorkList = parseLines(journey?.howIWork)

  const hasWhoIAm = Boolean(journey?.whoIAm?.trim())
  const hasWhatIDo = whatIDoList.length > 0
  const hasGoals = shortTermList.length > 0 || longTermList.length > 0
  const hasExperience = experienceList.length > 0
  const hasHowIWork = howIWorkList.length > 0
  const hasLegacyContent = Boolean(journey?.content?.trim())

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <Header />
      <article className="pt-24 pb-16">
        <div className="container mx-auto px-10 md:px-14 lg:px-20 xl:px-24 max-w-4xl">
          <Link
            href="/#about"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors mb-12"
          >
            <ArrowLeft size={18} />
            Back to portfolio
          </Link>

          {/* Hero: image + title + headline */}
          <header className="mb-16 border-b border-gray-200 dark:border-zinc-800 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-14 items-start">
              {imageUrl && (
                <div className="aspect-[3/4] max-w-[280px] mx-auto lg:mx-0">
                  <img
                    src={imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-sm grayscale"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-3">
                  About
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white tracking-tight">
                  {journey?.title || 'My Journey'}
                </h1>
                <div className="mt-6 h-px w-16 bg-gray-300 dark:bg-zinc-600" />
                {journey?.headline?.trim() && (
                  <div className="mt-6 space-y-4">
                    {journey.headline.split('\n').filter((l) => l.trim()).map((line, i) => (
                      <p key={i} className="text-base md:text-lg text-gray-600 dark:text-zinc-400 leading-relaxed">
                        {line.trim()}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Who I Am */}
          {hasWhoIAm && (
            <section className="mb-14">
              <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-6">
                Who I Am
              </h2>
              <div className="prose prose-lg max-w-none prose-p:text-gray-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4">
                {journey!.whoIAm!.split('\n').map((p, i) => (
                  <p key={i} className="mb-4 last:mb-0">
                    {p.trim()}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* What I Do */}
          {hasWhatIDo && (
            <section className="mb-16">
              <div className="flex items-baseline gap-4 mb-8">
                <h2 className="text-xl font-semibold text-black dark:text-white tracking-tight">
                  What I Do
                </h2>
                <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700 max-w-[120px]" aria-hidden />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {whatIDoList.map((item, i) => (
                  <div
                    key={i}
                    className="group relative rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/80 dark:bg-zinc-900/50 p-5 transition-colors hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-900/80"
                  >
                    <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="mt-2 text-gray-800 dark:text-zinc-200 font-medium leading-snug">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* My Goals */}
          {hasGoals && (
            <section className="mb-16">
              <div className="flex items-baseline gap-4 mb-8">
                <h2 className="text-xl font-semibold text-black dark:text-white tracking-tight">
                  My Goals
                </h2>
                <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700 max-w-[120px]" aria-hidden />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {shortTermList.length > 0 && (
                  <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-zinc-400 mb-4">
                      Short-term
                    </h3>
                    <ul className="space-y-3">
                      {shortTermList.map((item, i) => (
                        <li key={i} className="flex gap-3 text-gray-700 dark:text-zinc-300">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400 dark:bg-zinc-500" aria-hidden />
                          <span className="text-sm md:text-base leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {longTermList.length > 0 && (
                  <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 p-6 shadow-sm">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-zinc-400 mb-4">
                      Long-term
                    </h3>
                    <ul className="space-y-3">
                      {longTermList.map((item, i) => (
                        <li key={i} className="flex gap-3 text-gray-700 dark:text-zinc-300">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400 dark:bg-zinc-500" aria-hidden />
                          <span className="text-sm md:text-base leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Experience */}
          {hasExperience && (
            <section className="mb-16">
              <div className="flex items-baseline gap-4 mb-8">
                <h2 className="text-xl font-semibold text-black dark:text-white tracking-tight">
                  Experience
                </h2>
                <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700 max-w-[120px]" aria-hidden />
              </div>
              <div className="relative pl-6 sm:pl-8">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-gray-200 dark:bg-zinc-700" aria-hidden />
                {experienceList.map((item, i) => (
                  <div key={i} className="relative pb-8 last:pb-0">
                    <span
                      className="absolute left-0 top-1.5 h-3 w-3 -translate-x-[5px] rounded-full border-2 border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-950"
                      aria-hidden
                    />
                    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 px-5 py-4 shadow-sm">
                      <p className="text-gray-800 dark:text-zinc-200 leading-relaxed">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* How I Work */}
          {howIWorkList.length > 0 && (
            <section className="mb-16">
              <div className="flex items-baseline gap-4 mb-8">
                <h2 className="text-xl font-semibold text-black dark:text-white tracking-tight">
                  How I Work
                </h2>
                <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-700 max-w-[120px]" aria-hidden />
              </div>
              <div className="flex flex-wrap gap-3">
                {howIWorkList.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50 text-sm font-medium text-gray-700 dark:text-zinc-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Legacy content (single-column story if no sections filled) */}
          {hasLegacyContent && (hasWhoIAm || hasWhatIDo || hasGoals || hasExperience || hasHowIWork ? null : (
            <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-black dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed">
              {journey!.content!.split('\n').filter((p) => p.trim()).map((paragraph, i) => (
                <p key={i} className="mb-6 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}

          {!hasWhoIAm && !hasWhatIDo && !hasGoals && !hasExperience && !hasHowIWork && !hasLegacyContent && (
            <p className="text-gray-600 dark:text-zinc-400 italic">
              Journey content will appear here. Edit it in Admin → Journey.
            </p>
          )}
        </div>
      </article>
      <Footer />
    </main>
  )
}
