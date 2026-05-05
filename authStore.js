import { create } from 'zustand'
import { authApi } from '@/api/endpoints'

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.login(email, password)
      const { token, id, name, email: userEmail, authority } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem(
        'user',
        JSON.stringify({ id, name, email: userEmail, role: authority })
      )

      set({ user: { id, name, email: userEmail, role: authority }, token, isLoading: false })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  signup: async (name, email, password, role) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authApi.signup(name, email, password, role)
      set({ isLoading: false })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  logout: () => {
    authApi.logout()
    set({ user: null, token: null })
  },

  clearError: () => set({ error: null }),

  isAuthenticated: () => {
    const state = useAuthStore.getState()
    return !!state.token && !!state.user
  },
}))
