import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useEventStore } from '@/store/eventStore'
import { Alert } from '@/components/Alert'
import { ArrowLeft } from 'lucide-react'
import { Dropdown } from '@/components/Dropdown'

export function CreateEventPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { createEvent, isLoading, error } = useEventStore()
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
    venue: '',
    category: 'Technical',
    organizerDetails: '',
    rules: '',
  })

  const categoryOptions = [
    { label: 'Technical', value: 'Technical' },
    { label: 'Cultural', value: 'Cultural' },
    { label: 'Sports', value: 'Sports' },
    { label: 'Academic', value: 'Academic' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (category) => {
    setFormData(prev => ({ ...prev, category }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createEvent(formData)
      setMessage('Event created successfully!')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create event')
    }
  }

  // Check if user is admin
  if (user?.role !== 'ROLE_ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Only admins can create events</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Event</h1>

          {message && (
            <Alert
              type={message.includes('successfully') ? 'success' : 'error'}
              message={message}
              onClose={() => setMessage('')}
            />
          )}

          {error && <Alert type="error" message={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field resize-none h-32"
                placeholder="Enter event description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Event venue"
                  required
                />
              </div>
            </div>

            <div>
              <Dropdown
                label="Category *"
                options={categoryOptions}
                value={formData.category}
                onChange={handleCategoryChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizer Details
              </label>
              <input
                type="text"
                name="organizerDetails"
                value={formData.organizerDetails}
                onChange={handleChange}
                className="input-field"
                placeholder="Name of the organizer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rules & Guidelines
              </label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                className="input-field resize-none h-24"
                placeholder="Enter event rules and guidelines"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary py-3 font-semibold disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 btn-secondary py-3 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
