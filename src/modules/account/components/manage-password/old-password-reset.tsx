"use client"

import { useState } from "react"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"

type Props = {
  onBack: () => void
}

const OldPasswordReset = ({ onBack }: Props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!form.email) {
        throw new Error("Email is required")
      }
      if (!form.oldPassword) {
        throw new Error("Current password is required")
      }
      if (!form.newPassword) {
        throw new Error("New password is required")
      }
      if (form.newPassword !== form.confirmPassword) {
        throw new Error("Passwords do not match")
      }
      if (form.newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters")
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/reset-password-with-old-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
          },
          body: JSON.stringify({
            email: form.email,
            old_password: form.oldPassword,
            new_password: form.newPassword,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Failed to reset password")
      }

      setSuccess(true)
      setForm({
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        onBack()
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-sm w-full flex flex-col items-center">
        <div className="text-center">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h2 className="text-xl font-semibold mb-2">Password Reset Successfully</h2>
          <p className="text-gray-600">Your password has been updated. Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
      <h1 className="mb-6 text-xl font-semibold">Reset with Old Password</h1>

      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Verify your identity with your current password to set a new one.
      </p>

      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            data-testid="email-input"
          />

          <Input
            label="Current Password"
            name="oldPassword"
            type="password"
            autoComplete="current-password"
            required
            value={form.oldPassword}
            onChange={handleChange}
            data-testid="old-password-input"
          />

          <Input
            label="New Password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            value={form.newPassword}
            onChange={handleChange}
            data-testid="new-password-input"
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            data-testid="confirm-password-input"
          />
        </div>

        <ErrorMessage error={error} data-testid="old-password-error-message" />

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
            data-testid="back-button"
          >
            Back
          </button>
          <SubmitButton
            data-testid="reset-password-button"
            className="w-full btn-secondary"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}

export default OldPasswordReset
