import { useState, useEffect } from 'react'
import { useEventStore } from '@/store/eventStore'
import { useRegistrationStore } from '@/store/registrationStore'
import { useAuthStore } from '@/store/authStore'
import { Calendar, Users, Zap, TrendingUp, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

export function DashboardPage() {
  const { events } = useEventStore()
  const { registrations } = useRegistrationStore()
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    myRegistrations: 0,
    categories: {},
  })

  useEffect(() => {
    const upcoming = events.filter(e => new Date(e.dateTime) > new Date()).length
    const myRegs = registrations.filter(r => r.user?.id === user?.id).length
    const categoryCount = events.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1
      return acc
    }, {})

    setStats({
      totalEvents: events.length,
      upcomingEvents: upcoming,
      myRegistrations: myRegs,
      categories: categoryCount,
    })
  }, [events, registrations, user?.id])

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 border border-gray-100 hover:shadow-lg transition ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <Icon className="w-10 h-10 opacity-10" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-blue-100">Here's what's happening with your events</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Calendar}
            title="Total Events"
            value={stats.totalEvents}
            color="border-l-4 border-blue-500"
          />
          <StatCard
            icon={Zap}
            title="Upcoming Events"
            value={stats.upcomingEvents}
            color="border-l-4 border-purple-500"
          />
          <StatCard
            icon={Users}
            title="My Registrations"
            value={stats.myRegistrations}
            color="border-l-4 border-pink-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Categories"
            value={Object.keys(stats.categories).length}
            color="border-l-4 border-green-500"
          />
        </div>

        {/* Categories Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Events by Category</h2>
            <div className="space-y-4">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div key={category}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">{category}</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(count / stats.totalEvents) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 font-bold">•</span>
                <span className="text-gray-700 text-sm">Check upcoming events regularly</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 font-bold">•</span>
                <span className="text-gray-700 text-sm">Register early to secure your spot</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 font-bold">•</span>
                <span className="text-gray-700 text-sm">Check notifications for updates</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Events</h2>
            <a href="/events" className="flex items-center text-blue-600 hover:text-blue-800">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(event.dateTime), 'MMM dd, yyyy - hh:mm a')}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {event.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
