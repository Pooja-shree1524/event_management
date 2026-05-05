import { create } from 'zustand'
import { eventApi } from '@/api/endpoints'

export const useEventStore = create((set, get) => ({
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,

  fetchEvents: async (params = {}) => {
    set({ isLoading: true, error: null })
    try {
      const response = await eventApi.getAll(params)
      set({ events: response.data, isLoading: false })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch events'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  fetchEventById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await eventApi.getById(id)
      set({ selectedEvent: response.data, isLoading: false })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch event'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  createEvent: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await eventApi.create(data)
      const newEvent = response.data
      set((state) => ({
        events: [...state.events, newEvent],
        isLoading: false,
      }))
      return newEvent
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create event'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  updateEvent: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await eventApi.update(id, data)
      const updatedEvent = response.data
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? updatedEvent : e)),
        selectedEvent: updatedEvent,
        isLoading: false,
      }))
      return updatedEvent
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update event'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  deleteEvent: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await eventApi.delete(id)
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete event'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  searchEvents: async (query) => {
    set({ isLoading: true, error: null })
    try {
      const response = await eventApi.search(query)
      set({ events: response.data, isLoading: false })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Search failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
