"use client"

import { useEffect, useState } from "react"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export default function RMAForm() {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    productId: "",
    full_name: "",
    business_name: "",
    country: "",
    phone: "",
    email: "",
    order_number: "",
    serial_number: "",
    issue_description: "",
    message: "",
    urgency: "Normal",
    file_url: "", // store file URL or file name
  })

  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
  const loadProducts = async () => {
    try {
      const { products: fetched } = await sdk.store.product.list({
        limit: 100,
        fields: "id,title",
      })

      const sortedProducts = (fetched || []).sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      )

      setProducts(sortedProducts)
    } catch (err) {
      console.error("Failed to load products", err)
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

const validate = () => {
    let err: any = {}

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const phoneRegex = /^\d{10,13}$/

    const f = { ...form }

    // trim values
    Object.keys(f).forEach((key) => {
      if (typeof f[key as keyof typeof f] === "string") {
        f[key as keyof typeof f] = (f[key as keyof typeof f] as string).trim()
      }
    })

    // Product - Required
    if (!f.productId) err.productId = "Please select a product"

    // Full Name - Required, min 1 char
    if (!f.full_name) err.full_name = "Full name is required"

    // Country - Required
    if (!f.country) err.country = "Please select a country"

    // Phone - Required, 10-13 digits
    if (!f.phone) err.phone = "Phone number is required"
    else if (!phoneRegex.test(f.phone)) err.phone = "Enter valid 10-13 digit phone number"

    // Email - Required, valid format
    if (!f.email) err.email = "Email is required"
    else if (!emailRegex.test(f.email)) err.email = "Enter a valid email address"

    // Issue Description - Required, min 10 chars
    if (!f.issue_description) err.issue_description = "Issue description is required"
    else if (f.issue_description.length < 10) err.issue_description = "Minimum 10 characters required"

    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  // ✅ Email validation
if (!validate()) return
  setSubmitting(true)

  try {
    const selectedProduct = products.find((p) => p.id === form.productId)

    if (!selectedProduct) {
      alert("Please select a valid product")
      setSubmitting(false)
      return
    }

    // Build payload including product_title
    const payload = {
      product_id: form.productId,
      product_title: selectedProduct.title, // <-- include this
      full_name: form.full_name,
      business_name: form.business_name || null,
      country: form.country,
      email: form.email,
      phone: form.phone || null,
      order_number: form.order_number || null,
      serial_number: form.serial_number || null,
      issue_description: form.issue_description || null,
      message: form.message || null,
      urgency: form.urgency || "Normal",
      file_url: form.file_url || null,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/rma`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    console.log("RMA API response:", data)

    if (!response.ok) {
      alert(`Error submitting RMA: ${data.message}`)
      return
    }

    alert("RMA submitted successfully!")

    // Reset form
    setForm({
      productId: "",
      full_name: "",
      business_name: "",
      country: "",
      email: "",
      phone: "",
      order_number: "",
      serial_number: "",
      issue_description: "",
      message: "",
      urgency: "Normal",
      file_url: "",
    })
  } catch (err) {
    console.error("RMA submission failed", err)
    alert("Something went wrong. Please try again.")
  } finally {
    setSubmitting(false)
  }
}


  return (
    <div>

      <div className="static-banner">
        <div className="static-banner-overlay"></div>
        <div className="static-banner-content">
          <h1>RMA (Return Merchandise Authorization)</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6">
        {/* Product */}
        <div>

        <p>
        A customer service agent will be in touch with you within 24 hours.
      </p>
          <label className="block mb-1 font-medium">Select Product</label>
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
          {errors.productId && (
  <p className="text-red-500 text-sm">{errors.productId}</p>
)}
        </div>

        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="full_name"
            required
            value={form.full_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.full_name && (
  <p className="text-red-500 text-sm">{errors.full_name}</p>
)}
        </div>

        {/* Business Name */}
        <div>
          <label className="block mb-1 font-medium">Business / Organization Name</label>
          <input
            type="text"
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block mb-1 font-medium">Country</label>
          <select
            name="country"
            value={form.country}
            required
            onChange={handleChange}
            className={`w-full border rounded p-2 ${errors.country ? "border-red-500" : ""}`}
          >
            <option value="">Select</option>
            <option>India</option>
            <option>United States</option>
            <option>Other</option>
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country}</p>
          )}
        </div>

{/* Phone */}
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "") // remove non-digits
              setForm((prev) => ({ ...prev, phone: value }))
              // Clear error when user types
              if (errors.phone) setErrors((prev: any) => ({ ...prev, phone: "" }))
            }}
            maxLength={13}
            pattern="[0-9]{10,13}"
            placeholder="Enter 10-13 digit phone number"
            className={`w-full border rounded p-2 ${errors.phone ? "border-red-500" : ""}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Order Number */}
        <div>
          <label className="block mb-1 font-medium">Order Number</label>
          <input
            type="text"
            name="order_number"
            value={form.order_number}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Serial Number */}
        <div>
          <label className="block mb-1 font-medium">Serial Number</label>
          <input
            type="text"
            name="serial_number"
            value={form.serial_number}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Issue Description */}
        <div>
          <label className="block mb-1 font-medium">What is wrong with the product</label>
          <textarea
            name="issue_description"
            rows={3}
            required
            value={form.issue_description}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.issue_description && (
  <p className="text-red-500 text-sm">{errors.issue_description}</p>
)}
        </div>

        {/* Additional Message */}
        <div>
          <label className="block mb-1 font-medium">Additional Message</label>
          <textarea
            name="message"
            rows={3}
            value={form.message}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Urgency */}
        <div>
          <label className="block mb-1 font-medium">Urgency</label>
          <select
            name="urgency"
            value={form.urgency}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option>Normal</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
        </div>

        {/* File URL */}
        <div>
          <label className="block mb-1 font-medium">File URL / Attachment</label>
          <input
            type="text"
            name="file_url"
            value={form.file_url}
            onChange={handleChange}
            placeholder="Paste file URL here"
            className="w-full border rounded p-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {submitting ? "Submitting..." : "Submit RMA"}
        </button>
      </form>
    </div>
  )
}
