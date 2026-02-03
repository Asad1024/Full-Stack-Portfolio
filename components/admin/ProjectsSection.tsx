'use client'

import { useState } from 'react'
import ProjectsManager from './ProjectsManager'
import ProjectCategoriesManager from './ProjectCategoriesManager'

type SubTab = 'projects' | 'categories'

const ProjectsSection = () => {
  const [subTab, setSubTab] = useState<SubTab>('projects')

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        <button
          onClick={() => setSubTab('projects')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            subTab === 'projects'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setSubTab('categories')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            subTab === 'categories'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Categories
        </button>
      </div>
      {subTab === 'projects' && <ProjectsManager />}
      {subTab === 'categories' && <ProjectCategoriesManager />}
    </div>
  )
}

export default ProjectsSection
