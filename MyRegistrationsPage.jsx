import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegistrationStore } from '@/store/registrationStore'
import { useAuthStore } from '@/store/authStore'
import { Alert, LoadingSpinner, SkeletonCard } from '@/components'
import { Calendar, MapPin, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

export function MyRegistrationsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { registrations, fetchUserRegistrations, cancelRegistration, isLoading, error } =
    useRegistrationStore()

  useEffect(() => {
    if (user?.id) {
      fetchUserRegistrations(user.id)
    }
  }, [user?.id])

  const handleCancel = async (registrationId) => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      await cancelRegistration(registrationId)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Registrations</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Registrations</h1>

        {error && <Alert type="error" message={error} />}

        {registrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.map((registration) => (
              <div key={registration.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {registration.event?.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(registration.status)}`}>
                    {registration.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">
                      {registration.event?.dateTime
                        ? format(new Date(registration.event.dateTime), 'MMM dd, yyyy')
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{registration.event?.venue}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Registered on {format(new Date(registration.registrationTime), 'MMM dd, yyyy hh:mm a')}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/events/${registration.event?.id}`)}
                    className="flex-1 btn-secondary"
                  >
                    View Details
                  </button>
                  {registration.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleCancel(registration.id)}
                      className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg mb-4">You haven't registered for any events yet</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Browse Events
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
