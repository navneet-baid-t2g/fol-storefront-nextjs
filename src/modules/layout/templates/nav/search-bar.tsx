"use client"

import { useState, useEffect, useCallback } from "react"
import { sdk } from "@lib/config"
import Link from "next/link"
import { RiSearchLine } from "@remixicon/react"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showBox, setShowBox] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<any>(null)

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setShowBox(false)
  }

  const fetchSearchResults = useCallback(async () => {
    if (!query.trim()) {
      setResults([])
      setShowBox(false)
      return
    }

    setLoading(true)
    setShowBox(true)

    try {
      const res = await sdk.store.product.list({
        q: query,
        limit: 5,
      })

      setResults(res.products || [])
    } catch {
      setResults([])
    }

    setLoading(false)
  }, [query])

  const handleSearchButton = async () => {
    await fetchSearchResults()
  }

  // Debounce search
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer)

    const timer = setTimeout(() => {
      fetchSearchResults()
    }, 300)

    setDebounceTimer(timer)

    return () => clearTimeout(timer)
  }, [query, fetchSearchResults])

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="flex search-container w-full">
        <input
          type="text"
          placeholder="Search the store"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none text-sm"
        />

        <button
          onClick={handleSearchButton}
          className="bg-red-600 text-white px-4 flex items-center gap-2 rounded-r-md text-sm hover:bg-red-700 transition"
        >
          <RiSearchLine />
        </button>
      </div>

      {/* Results Box */}
      {showBox && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-2 z-50 p-4">
          {loading && <p className="text-sm text-gray-500">Searching...</p>}

          {!loading && results.length === 0 && query.length > 0 && (
            <p className="text-sm text-gray-500">No products found.</p>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-3">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.handle}`}
                  onClick={clearSearch}   // ← CLEAR SEARCH ON CLICK
                  className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 transition"
                >
                  <img
                    src={product.thumbnail || "/placeholder.png"}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div className="text-left">
                    <h4 className="text-sm font-medium">{product.title}</h4>

                    {product?.variants?.[0]?.prices?.[0]?.amount && (
                      <p className="text-xs text-gray-600">
                        Starting from ₹
                        {product.variants[0].prices[0].amount / 100}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
