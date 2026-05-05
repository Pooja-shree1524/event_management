import { useEffect, useState } from 'react'
import { useNotificationStore } from '@/store/notificationStore'
import { Alert, LoadingSpinner } from '@/components'
import { Bell, Trash2, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

export function NotificationsPage() {
  const { notifications, fetchNotifications, markAsRead, deleteNotification, markAllAsRead, isLoading } =
    useNotificationStore()
  const [filter, setFilter] = useState('all') // all, unread, read

  useEffect(() => {
    fetchNotifications()
  }, [])

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.isRead
    if (filter === 'read') return notif.isRead
    return true
  })

  const handleMarkAsRead = (id, isRead) => {
    if (!isRead) {
      markAsRead(id)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          {['all', 'unread', 'read'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-2 px-4 capitalize font-medium transition ${
                filter === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`card flex items-start justify-between p-4 ${
                  !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`mt-1 ${!notification.isRead ? 'text-blue-600' : 'text-gray-400'}`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`${!notification.isRead ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {format(new Date(notification.createdAt), 'MMM dd, yyyy hh:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id, notification.isRead)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete notification"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              {filter === 'all'
                ? 'No notifications yet'
                : `No ${filter} notifications`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
