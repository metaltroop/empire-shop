// empire-client/app/Searchpg/page.tsx
'use client'

import { Search, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function Searchpg() {
  const [query, setQuery] = useState('')

  return (
    <div className="fixed inset-0 bg-white z-50 p-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-3 shadow">
        <Search className="text-blue-600" />
        <input
          type="text"
          placeholder="search anything"
          className="flex-1 bg-transparent outline-none text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ArrowRight />
      </div>

      {/* Recent Searches */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Recent Searches</h2>
        <ul className="text-gray-600 space-y-2">
          <li>Laptop cooling pad</li>
          <li>Custom Gaming PC</li>
          <li>Printer Ink</li>
        </ul>
      </div>
    </div>
  )
}
