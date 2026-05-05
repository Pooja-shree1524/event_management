import { create } from 'zustand'
import { registrationApi } from '@/api/endpoints'

export const useRegistrationStore = create((set) => ({
  registrations: [],
  isLoading: false,
  error: null,

  fetchRegistrations: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await registrationApi.getAll()
      set({ registrations: response.data, isLoading: false })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch registrations'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  fetchUserRegistrations: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await registrationApi.getByUserId(userId)
      set({ registrations: response.data, isLoading: false })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch registrations'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  registerEvent: async (userId, eventId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await registrationApi.create(userId, eventId)
      set((state) => ({
        registrations: [...state.registrations, response.data],
        isLoading: false,
      }))
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  updateRegistrationStatus: async (id, status) => {
    set({ isLoading: true, error: null })
    try {
      const response = await registrationApi.update(id, status)
      set((state) => ({
        registrations: state.registrations.map((r) =>
          r.id === id ? response.data : r
        ),
        isLoading: false,
      }))
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update registration'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  cancelRegistration: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await registrationApi.delete(id)
      set((state) => ({
        registrations: state.registrations.filter((r) => r.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel registration'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
