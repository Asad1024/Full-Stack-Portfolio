'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PenTool, 
  Code, 
  Server, 
  Database, 
  ClipboardCheck, 
  Users,
  ChevronDown,
  Brain,
  Layout
} from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  imageUrl?: string
}

// Function to get icon based on category name
const getCategoryIcon = (category: string) => {
  const categoryLower = category.toLowerCase()
  
  if ((categoryLower.includes('programming') && categoryLower.includes('language')) || categoryLower === 'programming languages') {
    return <Code className="w-8 h-8 shrink-0" strokeWidth={1.5} />
  }
  if (categoryLower.includes('frontend') || categoryLower.includes('front-end') || categoryLower.includes('ui') || categoryLower.includes('ux')) {
    return <Layout className="w-8 h-8 shrink-0" strokeWidth={1.5} />
  }
  if (categoryLower.includes('backend') || categoryLower.includes('back-end') || categoryLower.includes('server')) {
    return <Server className="w-8 h-8 shrink-0" strokeWidth={1.5} />
  }
  if (categoryLower.includes('database') || categoryLower.includes('db') || categoryLower.includes('databases')) {
    return <Database className="w-8 h-8 shrink-0" strokeWidth={1.5} />
  }
  if (categoryLower.includes('ai') || categoryLower.includes('machine learning') || categoryLower.includes('ml')) {
    return <Brain className="w-8 h-8 shrink-0" strokeWidth={1.5} />
  }
  if (categoryLower.includes('design') && categoryLower.includes('tools')) {
    return <PenTool className="w-8 h-8 shrink-0" strokeWidth={1.5} />
  }
  if (categoryLower.includes('design')) {
    return <PenTool className="w-8 h-8 shrink-0" strokeWidth={1.5} />
  }
  if (categoryLower.includes('tools') || categoryLower.includes('platforms')) {
    return <ClipboardCheck className="w-8 h-8 shrink-0" strokeWidth={1.5} />
  }
  if (categoryLower.includes('team') || categoryLower.includes('collaboration') || categoryLower.includes('integration')) {
    return <Users className="w-8 h-8 shrink-0" strokeWidth={1.5} />
  }
  return <Code className="w-8 h-8 shrink-0" strokeWidth={1.5} />
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills')
        if (response.ok) {
          const data = await response.json()
          setSkills(data)
          // Get unique categories sorted by category_order
          const categoryMap = new Map<string, number>()
          data.forEach((skill: Skill & { category_order?: number }) => {
            if (!categoryMap.has(skill.category)) {
              categoryMap.set(skill.category, skill.category_order || 0)
            }
          })
          const sortedCategories = Array.from(categoryMap.entries())
            .sort((a, b) => a[1] - b[1])
            .map(([category]) => category)
          setCategories(sortedCategories)
        }
      } catch (error) {
        console.error('Error fetching skills:', error)
      }
    }
    fetchSkills()
  }, [])

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(category)
    }
  }

  const getCategorySkills = (category: string) => {
    return skills
      .filter((skill) => skill.category === category)
      .sort((a, b) => {
        const aOrder = (a as any).skill_order || 0
        const bOrder = (b as any).skill_order || 0
        return aOrder - bOrder
      })
  }

  // Use all categories from database
  const displayCategories = categories

  return (
    <section id="skills" className="relative py-8 lg:py-10 bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="container mx-auto px-10 md:px-14 lg:px-20 xl:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4"
            >
              Skills
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base md:text-lg text-gray-600"
            >
              I specialize in the following areas:
            </motion.p>
          </div>
          
          {/* Category Boxes Row - equal height boxes */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 items-stretch">
              {displayCategories.map((category, index) => {
                const isSelected = selectedCategory === category

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="min-h-[160px] h-full flex"
                  >
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(category)}
                      className={`w-full h-full min-h-[160px] p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center justify-between gap-2 hover:shadow-lg bg-white dark:bg-zinc-900 ${
                        isSelected 
                          ? 'border-black dark:border-white shadow-lg' 
                          : 'border-gray-200 dark:border-zinc-600 hover:border-gray-300 dark:hover:border-zinc-500'
                      }`}
                    >
                      <div className="flex-shrink-0 text-black dark:text-white">
                        {getCategoryIcon(category)}
                      </div>
                      <span className="text-sm font-medium text-center leading-tight line-clamp-3 flex-1 flex items-center justify-center text-black dark:text-white">
                        {category}
                      </span>
                      <ChevronDown 
                        className={`w-4 h-4 flex-shrink-0 text-black dark:text-white transition-transform duration-300 ${
                          isSelected ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Skills Display Below Selected Category */}
          <AnimatePresence>
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl mx-auto"
              >
                <div className="bg-gray-50 border-2 border-black rounded-lg p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-black mb-6">
                    {selectedCategory}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getCategorySkills(selectedCategory).map((skill, skillIndex) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                        className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-md hover:border-black hover:shadow-md transition-all duration-300"
                      >
                        {skill.imageUrl ? (
                          <div className="w-12 h-12 rounded-md bg-white flex items-center justify-center p-2 mb-3">
                            <img
                              src={skill.imageUrl}
                              alt={skill.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-black text-white flex items-center justify-center mb-3">
                            <span className="text-lg font-bold">
                              {skill.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-semibold text-black text-center">
                          {skill.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
