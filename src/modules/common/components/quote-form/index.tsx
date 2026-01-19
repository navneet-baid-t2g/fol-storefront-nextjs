"use client"

import { useEffect, useState } from "react"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export default function QuoteForm() {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    productId: "",
    company: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { products: fetched } = await sdk.store.product.list({
          limit: 100,
          fields: "id,title",
        })
        setProducts(fetched || [])
      } catch (err) {
        console.error("Failed to load products", err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // 🔜 Replace this with backend API call
      console.log("QUOTE REQUEST:", form)

      alert("Quote request submitted successfully!")

      setForm({
        productId: "",
        company: "",
        name: "",
        email: "",
        phone: "",
        message: "",
      })
    } catch (err) {
      console.error("Quote submission failed", err)
      alert("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Request a Quote</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product */}
        <div>
          <label className="block mb-1 font-medium">Product</label>
          <select
            name="productId"
            required
            value={form.productId}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div>
          <label className="block mb-1 font-medium">Company Name</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Contact Person</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block mb-1 font-medium">Message / Requirements</label>
          <textarea
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full"
        >
          {submitting ? "Submitting..." : "Submit Quote Request"}
        </button>
      </form>
    </div>
  )
}
