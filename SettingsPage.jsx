import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Bell, Lock, Users, Shield, Palette } from 'lucide-react'

export function SettingsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('notifications')
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    newsAndUpdates: false,
    theme: 'light',
    privacyLevel: 'public',
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const SettingCard = ({ icon: Icon, title, description, children }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {[
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'privacy', label: 'Privacy', icon: Shield },
                { id: 'appearance', label: 'Appearance', icon: Palette },
                { id: 'account', label: 'Account', icon: Lock },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-6 py-4 border-l-4 transition ${
                    activeTab === tab.id
                      ? 'bg-blue-50 border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Notification Preferences</h2>

                  <div className="space-y-4">
                    <SettingCard
                      icon={Bell}
                      title="Email Notifications"
                      description="Receive email updates about events and registrations"
                    >
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        className="w-5 h-5 text-blue-600"
                      />
                    </SettingCard>

                    <SettingCard
                      icon={Bell}
                      title="Push Notifications"
                      description="Receive push notifications on your device"
                    >
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                        className="w-5 h-5 text-blue-600"
                      />
                    </SettingCard>

                    <SettingCard
                      icon={Bell}
                      title="Event Reminders"
                      description="Get reminded before registered events start"
                    >
                      <input
                        type="checkbox"
                        checked={settings.eventReminders}
                        onChange={(e) => handleSettingChange('eventReminders', e.target.checked)}
                        className="w-5 h-5 text-blue-600"
                      />
                    </SettingCard>

                    <SettingCard
                      icon={Bell}
                      title="News and Updates"
                      description="Receive platform news and feature announcements"
                    >
                      <input
                        type="checkbox"
                        checked={settings.newsAndUpdates}
                        onChange={(e) => handleSettingChange('newsAndUpdates', e.target.checked)}
                        className="w-5 h-5 text-blue-600"
                      />
                    </SettingCard>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Privacy Settings</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Profile Visibility
                    </label>
                    <select
                      value={settings.privacyLevel}
                      onChange={(e) => handleSettingChange('privacyLevel', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="public">Public - Everyone can see your profile</option>
                      <option value="friends">Friends Only - Only connections can see</option>
                      <option value="private">Private - Only you can see</option>
                    </select>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Privacy Tip:</strong> Your registration history and event participation are always kept private.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Appearance</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Theme
                    </label>
                    <div className="flex space-x-4">
                      {['light', 'dark', 'auto'].map(theme => (
                        <label key={theme} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            value={theme}
                            checked={settings.theme === theme}
                            onChange={(e) => handleSettingChange('theme', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-700 capitalize">{theme}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Information</h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Account Type</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Student'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-700 mb-4">Delete your account permanently</p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
