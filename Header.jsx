import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import { Bell, LogOut, Menu, X, Home, Calendar, User, LogIn } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { unreadCount, fetchNotifications } = useNotificationStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNotifications = () => {
    fetchNotifications()
    navigate('/notifications')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <Calendar className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">EventHub</h1>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button
                onClick={() => navigate('/events')}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
              >
                <Calendar className="w-5 h-5" />
                <span>Events</span>
              </button>
              <button
                onClick={() => navigate('/my-registrations')}
                className="text-gray-700 hover:text-blue-600 transition"
              >
                My Events
              </button>
              <button
                onClick={handleNotifications}
                className="relative flex items-center text-gray-700 hover:text-blue-600 transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
              >
                <User className="w-5 h-5" />
                <span>{user.name}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center space-x-1 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate('/admin/login')}
                className="flex items-center space-x-1 px-4 py-2 text-gray-500 hover:text-gray-800 transition"
              >
                <span>Admin</span>
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-700"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-50 px-4 py-4 space-y-3">
          {user ? (
            <>
              <button
                onClick={() => {
                  navigate('/')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate('/events')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
              >
                Events
              </button>
              <button
                onClick={() => {
                  navigate('/my-registrations')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
              >
                My Events
              </button>
              <button
                onClick={() => {
                  handleNotifications()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
              >
                Notifications ({unreadCount})
              </button>
              <button
                onClick={() => {
                  navigate('/profile')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate('/login')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('/signup')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  navigate('/admin/login')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-200 rounded"
              >
                Admin Login
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
