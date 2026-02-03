'use client'

import { useState } from 'react'
import ContactInfoManager from './ContactInfoManager'
import ContactsManager from './ContactsManager'

type SubTab = 'info' | 'messages'

const ContactSection = () => {
  const [subTab, setSubTab] = useState<SubTab>('info')

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        <button
          onClick={() => setSubTab('info')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            subTab === 'info'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Contact Info
        </button>
        <button
          onClick={() => setSubTab('messages')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            subTab === 'messages'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Messages
        </button>
      </div>
      {subTab === 'info' && <ContactInfoManager />}
      {subTab === 'messages' && <ContactsManager />}
    </div>
  )
}

export default ContactSection
