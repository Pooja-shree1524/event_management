import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function Dropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="input-field flex justify-between items-center"
      >
        <span>{options.find(opt => opt.value === value)?.label || 'Select...'}</span>
        <ChevronDown className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 transition"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
