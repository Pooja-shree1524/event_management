import { useState, useEffect } from 'react'
import { useEventStore } from '@/store/eventStore'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { format, getDaysInMonth, getDay, startOfMonth } from 'date-fns'

export function EventCalendarPage() {
  const { events, fetchEvents } = useEventStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [eventsOnDate, setEventsOnDate] = useState([])

  useEffect(() => {
    fetchEvents()
  }, [])

  const monthStart = startOfMonth(currentDate)
  const daysInMonth = getDaysInMonth(currentDate)
  const startingDayOfWeek = getDay(monthStart)

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
  }

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day)
      const dayEvents = events.filter(
        e => format(new Date(e.dateTime), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      setEventsOnDate(dayEvents)
    }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Event Calendar</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Month Navigation */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="p-4"></div>
                  }

                  const dayEvents = events.filter(
                    e => format(new Date(e.dateTime), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                  )

                  const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDateClick(day)}
                      className={`p-4 border-2 rounded-lg transition text-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-800">{format(day, 'd')}</div>
                      {dayEvents.length > 0 && (
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                            {dayEvents.length}
                          </span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Events List for Selected Date */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
              {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select a date'}
            </h3>

            {selectedDate && eventsOnDate.length > 0 ? (
              <div className="space-y-4">
                {eventsOnDate.map(event => (
                  <div key={event.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-800 mb-2">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{event.description.substring(0, 100)}...</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        {event.category}
                      </span>
                      <span className="text-xs text-gray-600">
                        {format(new Date(event.dateTime), 'hh:mm a')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedDate ? (
              <p className="text-gray-500 text-center py-8">No events on this date</p>
            ) : (
              <p className="text-gray-500 text-center py-8">Select a date to view events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
