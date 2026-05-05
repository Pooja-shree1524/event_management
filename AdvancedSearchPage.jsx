import { useState, useEffect } from 'react'
import { useEventStore } from '@/store/eventStore'
import { EventCard } from '@/components/EventCard'
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react'
import { Dropdown } from '@/components/Dropdown'

export function AdvancedSearchPage() {
  const { events, fetchEvents, isLoading } = useEventStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredEvents, setFilteredEvents] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'recent',
    minDate: '',
    maxDate: '',
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    let results = events

    // Text search
    if (searchQuery.trim()) {
      results = results.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (filters.category !== 'all') {
      results = results.filter(e => e.category === filters.category)
    }

    // Date filters
    if (filters.minDate) {
      results = results.filter(e => new Date(e.dateTime) >= new Date(filters.minDate))
    }
    if (filters.maxDate) {
      results = results.filter(e => new Date(e.dateTime) <= new Date(filters.maxDate))
    }

    // Sorting
    if (filters.sortBy === 'recent') {
      results.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
    } else if (filters.sortBy === 'upcoming') {
      results.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
    } else if (filters.sortBy === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredEvents(results)
  }, [events, searchQuery, filters])

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    { label: 'Technical', value: 'Technical' },
    { label: 'Cultural', value: 'Cultural' },
    { label: 'Sports', value: 'Sports' },
    { label: 'Academic', value: 'Academic' },
  ]

  const sortOptions = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Upcoming First', value: 'upcoming' },
    { label: 'Alphabetical', value: 'title' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Advanced Search</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by title, description, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2 text-blue-600" />
                Filters
              </h2>

              <div className="space-y-6">
                <Dropdown
                  label="Category"
                  options={categoryOptions}
                  value={filters.category}
                  onChange={(value) => setFilters({ ...filters, category: value })}
                />

                <Dropdown
                  label="Sort By"
                  options={sortOptions}
                  value={filters.sortBy}
                  onChange={(value) => setFilters({ ...filters, sortBy: value })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.minDate}
                    onChange={(e) => setFilters({ ...filters, minDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.maxDate}
                    onChange={(e) => setFilters({ ...filters, maxDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={() =>
                    setFilters({
                      category: 'all',
                      sortBy: 'recent',
                      minDate: '',
                      maxDate: '',
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 font-medium">
                Found <span className="text-blue-600 font-bold">{filteredEvents.length}</span> events
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading events...</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">No events match your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
