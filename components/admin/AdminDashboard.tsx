'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'
import { LogOut, User, Briefcase, Code, Mail, Settings, Filter, Phone, BookOpen } from 'lucide-react'
import ProfileManager from './ProfileManager'
import AboutManager from './AboutManager'
import JourneyManager from './JourneyManager'
import SkillsManager from './SkillsManager'
import ProjectsManager from './ProjectsManager'
import ContactsManager from './ContactsManager'
import ProjectFiltersManager from './ProjectFiltersManager'
import ContactInfoManager from './ContactInfoManager'
import AuthDebug from './AuthDebug'

type Tab = 'profile' | 'about' | 'journey' | 'skills' | 'projects' | 'project-filters' | 'contact-info' | 'contacts' | 'debug'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'about' as Tab, label: 'About', icon: Settings },
    { id: 'journey' as Tab, label: 'Journey', icon: BookOpen },
    { id: 'skills' as Tab, label: 'Skills', icon: Code },
    { id: 'projects' as Tab, label: 'Projects', icon: Briefcase },
    { id: 'project-filters' as Tab, label: 'Project Filters', icon: Filter },
    { id: 'contact-info' as Tab, label: 'Contact Info', icon: Phone },
    { id: 'contacts' as Tab, label: 'Contacts', icon: Mail },
    { id: 'debug' as Tab, label: 'Debug Auth', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-100 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-10 md:px-14 lg:px-20 xl:px-24 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'profile' && <ProfileManager />}
            {activeTab === 'about' && <AboutManager />}
            {activeTab === 'journey' && <JourneyManager />}
            {activeTab === 'skills' && <SkillsManager />}
            {activeTab === 'projects' && <ProjectsManager />}
            {activeTab === 'project-filters' && <ProjectFiltersManager />}
            {activeTab === 'contact-info' && <ContactInfoManager />}
            {activeTab === 'contacts' && <ContactsManager />}
            {activeTab === 'debug' && <AuthDebug />}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
