import { create } from 'zustand'
import { notificationApi } from '@/api/endpoints'

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await notificationApi.getAll()
      const notifications = response.data || []
      const unreadCount = notifications.filter((n) => !n.isRead).length
      set({ notifications, unreadCount, isLoading: false })
      return notifications
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch notifications'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  markAsRead: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await notificationApi.markAsRead(id)
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
        isLoading: false,
      }))
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark as read'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  markAllAsRead: async () => {
    set({ isLoading: true, error: null })
    try {
      await notificationApi.markAllAsRead()
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
        isLoading: false,
      }))
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark all as read'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  deleteNotification: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await notificationApi.delete(id)
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete notification'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
