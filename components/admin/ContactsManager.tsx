'use client'

import { useEffect, useState } from 'react'
import { Trash2, Mail, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { authFetch } from '@/lib/api-helpers'

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

const ContactsManager = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await authFetch('/api/admin/contacts')
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setContacts(data)
        } else if (data?.error) {
          console.error('API Error:', data.error, data.details)
          alert(`Failed to load contacts: ${data.error}`)
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Fetch Error:', response.status, errorData)
        alert(`Failed to load contacts (${response.status}): ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      alert('Network error loading contacts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string, read: boolean) => {
    try {
      const response = await authFetch('/api/admin/contacts', {
        method: 'PUT',
        body: JSON.stringify({ id, read }),
      })

      if (response.ok) {
        fetchContacts()
      }
    } catch (error) {
      console.error('Error updating contact:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return

    try {
      const response = await authFetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchContacts()
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  if (isLoading) {
    return <div className="text-black">Loading...</div>
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-6">Contact Submissions</h2>

      {contacts.length === 0 ? (
        <p className="text-gray-600">No contact submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`border p-6 ${
                contact.read ? 'border-gray-200 bg-gray-50' : 'border-black bg-white'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-bold text-black">{contact.subject}</h3>
                    {!contact.read && (
                      <span className="px-2 py-1 bg-black text-white text-xs">New</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      {contact.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {format(new Date(contact.created_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-black mb-1">From: {contact.name}</p>
                </div>
                <div className="flex gap-2">
                  {!contact.read && (
                    <button
                      onClick={() => handleMarkAsRead(contact.id, true)}
                      className="px-3 py-1 text-sm bg-gray-200 text-black hover:bg-gray-300 transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ContactsManager
