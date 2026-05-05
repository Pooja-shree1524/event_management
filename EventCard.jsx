import { Calendar, MapPin, Users, Tag } from 'lucide-react'
import { format } from 'date-fns'

export function EventCard({ event, onClick, onRegister }) {
  const eventDate = new Date(event.dateTime)
  const formattedDate = format(eventDate, 'MMM dd, yyyy')
  const formattedTime = format(eventDate, 'hh:mm a')

  return (
    <div className="card hover:shadow-xl transition cursor-pointer" onClick={onClick}>
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            {event.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-gray-700">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm">{formattedDate} at {formattedTime}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm">{event.venue}</span>
        </div>
        {event.organizerDetails && (
          <div className="flex items-center space-x-2 text-gray-700">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm">{event.organizerDetails}</span>
          </div>
        )}
      </div>

      {onRegister && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRegister()
          }}
          className="w-full btn-primary mt-4"
        >
          Register
        </button>
      )}
    </div>
  )
}
