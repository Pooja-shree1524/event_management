import api from '@/api/client'

export const authApi = {
  login: (email, password) =>
    api.post('/auth/signin', { email, password }),

  signup: (name, email, password, role = 'student') =>
    api.post('/auth/signup', { name, email, password, role }),

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

export const eventApi = {
  getAll: (params) =>
    api.get('/events', { params }),

  getById: (id) =>
    api.get(`/events/${id}`),

  create: (data) =>
    api.post('/events', data),

  update: (id, data) =>
    api.put(`/events/${id}`, data),

  delete: (id) =>
    api.delete(`/events/${id}`),

  search: (query) =>
    api.get('/events/search', { params: { q: query } }),
}

export const registrationApi = {
  getAll: () =>
    api.get('/registrations'),

  getByUserId: (userId) =>
    api.get(`/registrations/user/${userId}`),

  getByEventId: (eventId) =>
    api.get(`/registrations/event/${eventId}`),

  create: (userId, eventId) =>
    api.post('/registrations', { userId, eventId }),

  update: (id, status) =>
    api.put(`/registrations/${id}`, { status }),

  delete: (id) =>
    api.delete(`/registrations/${id}`),
}

export const notificationApi = {
  getAll: () =>
    api.get('/notifications'),

  getUnread: () =>
    api.get('/notifications/unread'),

  markAsRead: (id) =>
    api.put(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.put('/notifications/read-all'),

  delete: (id) =>
    api.delete(`/notifications/${id}`),
}

export const userApi = {
  getProfile: () =>
    api.get('/users/profile'),

  updateProfile: (data) =>
    api.put('/users/profile', data),

  getAll: () =>
    api.get('/users'),
}
