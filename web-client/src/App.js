import { useEffect, useState } from 'react'
import axios from 'axios'

export default function App() {
  const [airports, setAirports] = useState([])
  const [selectedAirport, setSelectedAirport] = useState('')
  const categories = [
    'Lounge',
    'Parking',
    'Transport',
    'Restroom',
    'Eatery',
    'Retail',
    'Medical/First Aid',
    'ATM/Banking',
    'Wi-Fi Zone',
  ]

  // Fetch airports via CRA proxy
  useEffect(() => {
    axios
      .get('/api/airports')
      .then(res => setAirports(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Select an Airport</h1>

      <select
        className="border p-2 rounded w-full"
        value={selectedAirport}
        onChange={e => setSelectedAirport(e.target.value)}
      >
        <option value="" disabled>
          -- Choose an airport --
        </option>
        {airports.map(a => (
          <option key={a.id} value={a.id}>
            {a.name} ({a.iata})
          </option>
        ))}
      </select>

      {/* Category Grid */}
      {selectedAirport && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          {categories.map(cat => (
            <div
              key={cat}
              className="p-4 border rounded text-center hover:shadow cursor-pointer"
              onClick={() => {
                /* TODO: fetch facilities for
                   this airport and category */
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
