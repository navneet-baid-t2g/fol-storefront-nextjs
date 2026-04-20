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

      const sortedProducts = (fetched || []).sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      )

      setProducts(sortedProducts)
    } catch (err) {
      console.error("Failed to load products", err)
    } finally {
      setLoading(false)
    }
  }

  loadProducts()
  }, [])

  // Get logged-in user's email from cookie and pre-fill
  useEffect(() => {
    try {
      // Get all cookies
      const cookies = document.cookie
      
      // Try to find email cookie (case insensitive)
      const cookieList = cookies.split(";")
      let emailValue = ""
      
      for (const cookie of cookieList) {
        const [name, value] = cookie.trim().split("=")
        if (name.toLowerCase() === "email") {
          emailValue = value
          break
        }
      }
      
      if (emailValue && emailValue !== "undefined" && emailValue !== "null" && emailValue !== "") {
        // Decode URL encoding
        let userEmail = ""
        try {
          userEmail = decodeURIComponent(emailValue)
        } catch {
          userEmail = emailValue // Use as-is if decode fails
        }
        
        if (userEmail && userEmail.includes("@")) {
          setForm(prev => ({ ...prev, email: userEmail }))
        }
      }
    } catch (e) {
      console.error("Error reading email cookie:", e)
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const isValidPhone = (phone: string) => {
  return /^[6-9]\d{9}$/.test(phone)
}

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!isValidPhone(form.phone)) {
    alert("Enter a valid 10-digit phone number")
    return
  }

  if (!emailVerified) {
    alert("Please verify your email first")
    return
  }

  setSubmitting(true)

  try {
    const selectedProduct = products.find(
      (p) => p.id === form.productId
    )

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/quote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
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

    if (!res.ok) throw new Error("Submission failed")

    alert("Quote request submitted successfully!")

  } catch (err) {
    alert("Something went wrong. Please try again.")
  } finally {
    setSubmitting(false)
  }
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

const sendOtp = async () => {
  // Check if email is pre-filled from login
  if (!form.email || !form.email.includes("@")) {
    alert("Please login first - email not found")
    return
  }

  // Validate phone number before sending OTP
  if (!form.phone || form.phone.length < 10) {
    alert("Please enter a valid 10-digit phone number first")
    return
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/email-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
        body: JSON.stringify({
          email: form.email,
          action: "send",
        }),
      }
    )
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      alert(`Failed to send OTP: ${errorData.message || res.statusText}`)
      return
    }

    setOtpSent(true)
    alert("OTP sent to your email")

  } catch (err) {
    console.error("OTP send error:", err)
    alert("Failed to send OTP - check console for details")
  }
}

const verifyOtp = async () => {
  setVerifying(true)

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/email-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
        },
        body: JSON.stringify({
          email: form.email,
          otp,
          action: "verify",
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message || "Invalid OTP")
    }

    // ✅ ONLY here it should pass
    setEmailVerified(true)
    alert("Email verified successfully!")

  } catch (err: any) {
    console.error(err)
    alert(err.message || "Invalid OTP")
  } finally {
    setVerifying(false)
  }
}

  return (
    <div>
      <div className="static-banner">
        <div className="static-banner-overlay"></div>
        <div className="static-banner-content">
          <h1>Request a Quote</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6">
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
  <label className="block mb-1 font-medium">Email (Verified)</label>
  <div className="flex gap-2">
    <input
      type="email"
      name="email"
      value={form.email}
      disabled={true}
      className="w-full border rounded p-2 bg-gray-100"
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
