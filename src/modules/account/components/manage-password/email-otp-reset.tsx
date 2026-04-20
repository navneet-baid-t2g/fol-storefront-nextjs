"use client"

import { useState } from "react"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"

type Props = {
  onBack: () => void
}

const EmailOtpReset = ({ onBack }: Props) => {
  const [step, setStep] = useState<"email" | "otp" | "password">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!form.email) {
        throw new Error("Email is required")
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/email-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
          },
          body: JSON.stringify({
            email: form.email,
            action: "send",
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Failed to send OTP")
      }

      setStep("otp")
    } catch (err: any) {
      setError(err.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!form.otp) {
        throw new Error("OTP is required")
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/email-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
          },
          body: JSON.stringify({
            email: form.email,
            otp: form.otp,
            action: "verify",
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Invalid OTP")
      }

      setStep("password")
    } catch (err: any) {
      setError(err.message || "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
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
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/reset-password-with-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
          },
          body: JSON.stringify({
            email: form.email,
            otp: form.otp,
            new_password: form.newPassword,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Failed to reset password")
      }

      setSuccess(true)
      setTimeout(() => {
        onBack()
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to reset password")
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
      {step === "email" && (
        <>
          <h1 className="mb-6 text-xl font-semibold">Reset with Email OTP</h1>

          <p className="text-center text-base-regular text-ui-fg-base mb-8">
            Enter your email to receive a one-time password.
          </p>

          <form className="w-full" onSubmit={handleSendOtp}>
            <div className="flex flex-col w-full gap-y-2">
              <Input
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                data-testid="email-input"
              />
            </div>

            <ErrorMessage error={error} data-testid="email-error-message" />

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
                data-testid="send-otp-button"
                className="w-full btn-secondary"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </SubmitButton>
            </div>
          </form>
        </>
      )}

      {step === "otp" && (
        <>
          <h1 className="mb-6 text-xl font-semibold">Verify OTP</h1>

          <p className="text-center text-base-regular text-ui-fg-base mb-8">
            Enter the one-time password sent to {form.email}
          </p>

          <form className="w-full" onSubmit={handleVerifyOtp}>
            <div className="flex flex-col w-full gap-y-2">
              <Input
                label="One-Time Password"
                name="otp"
                type="text"
                autoComplete="off"
                required
                value={form.otp}
                onChange={handleChange}
                data-testid="otp-input"
              />
            </div>

            <ErrorMessage error={error} data-testid="otp-error-message" />

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                data-testid="back-to-email-button"
              >
                Back
              </button>
              <SubmitButton
                data-testid="verify-otp-button"
                className="w-full btn-secondary"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </SubmitButton>
            </div>
          </form>
        </>
      )}

      {step === "password" && (
        <>
          <h1 className="mb-6 text-xl font-semibold">Set New Password</h1>

          <p className="text-center text-base-regular text-ui-fg-base mb-8">
            Create your new password.
          </p>

          <form className="w-full" onSubmit={handleResetPassword}>
            <div className="flex flex-col w-full gap-y-2">
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

            <ErrorMessage error={error} data-testid="password-error-message" />

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep("otp")}
                className="w-full py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                data-testid="back-to-otp-button"
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
        </>
      )}
    </div>
  )
}

export default EmailOtpReset
