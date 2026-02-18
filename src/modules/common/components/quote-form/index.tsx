"use client"

import { useEffect, useState } from "react"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"


export default function QuoteForm() {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [otp, setOtp] = useState("")
const [otpSent, setOtpSent] = useState(false)
const [emailVerified, setEmailVerified] = useState(false)
const [verifying, setVerifying] = useState(false)

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
    const selectedProduct = products.find(
      (p) => p.id === form.productId
    )

    await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/quote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
        body: JSON.stringify({
          product_id: form.productId,
          product_title: selectedProduct?.title || "",
          company_name: form.company,
          contact_person: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      }
    )

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

const sendOtp = async () => {
  if (!form.email) {
    alert("Enter email first")
    return
  }

  try {
    await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/email-otp`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
  },
  body: JSON.stringify({
    email: form.email,
    action: "send",
  }),
})


    setOtpSent(true)
    alert("OTP sent to your email")
  } catch (err) {
    alert("Failed to send OTP")
  }
}

const verifyOtp = async () => {
  setVerifying(true)

  try {
    await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/email-otp`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
  },
  body: JSON.stringify({
    email: form.email,
    otp,
    action: "verify",
  }),
})


    setEmailVerified(true)
    alert("Email verified successfully!")
  } catch (err) {
    alert("Invalid OTP")
  } finally {
    setVerifying(false)
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
        {/* Email */}
<div>
  <label className="block mb-1 font-medium">Email</label>
  <div className="flex gap-2">
    <input
      type="email"
      name="email"
      required
      value={form.email}
      onChange={(e) => {
        handleChange(e)
        setEmailVerified(false)
      }}
      className="w-full border rounded p-2"
    />

    <button
      type="button"
      onClick={sendOtp}
      disabled={!form.email}
      className="px-4 bg-gray-200 rounded"
    >
      Send OTP
    </button>
  </div>
</div>

{/* OTP Input */}
{otpSent && !emailVerified && (
  <div>
    <label className="block mb-1 font-medium">Enter OTP</label>
    <div className="flex gap-2">
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border rounded p-2"
      />
      <button
        type="button"
        onClick={verifyOtp}
        disabled={verifying}
        className="px-4 bg-blue-500 text-white rounded"
      >
        {verifying ? "Verifying..." : "Verify"}
      </button>
    </div>
  </div>
)}

{emailVerified && (
  <p className="text-green-600 text-sm">✓ Email verified</p>
)}


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
  disabled={submitting || !emailVerified}
  className={`w-full ${
    emailVerified
      ? "bg-blue-600 text-white"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  } p-2 rounded`}
>
  {submitting ? "Submitting..." : "Submit Quote Request"}
</button>

      </form>
    </div>
  )
}
