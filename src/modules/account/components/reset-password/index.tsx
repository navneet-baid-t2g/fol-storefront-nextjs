import { resetPassword } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const ResetPassword = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(resetPassword, null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      // If no token, redirect to forgot password
      router.push("/account")
    }
  }, [token, router])

  useEffect(() => {
    if (message?.success) {
      // Redirect to login after successful password reset
      setTimeout(() => {
        if (setCurrentView) {
          setCurrentView(LOGIN_VIEW.SIGN_IN)
        } else {
          router.push("/account")
        }
      }, 2000)
    }
  }, [message, setCurrentView, router])

  if (!token) {
    return null
  }

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="reset-password-page"
    >
      <h1 className="mb-6 text-xl font-semibold">Reset Password</h1>

      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Enter your new password below.
      </p>

      <form className="w-full" action={formAction}>
        <input type="hidden" name="token" value={token} />

        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="New Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            data-testid="password-input"
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            data-testid="confirm-password-input"
          />
        </div>

        <ErrorMessage error={message?.error} data-testid="reset-password-error-message" />

        {message?.success && (
          <div className="text-green-600 text-sm mt-2" data-testid="reset-password-success-message">
            {message.message}. Redirecting to login...
          </div>
        )}

        <SubmitButton
          data-testid="reset-password-button"
          className="w-full mt-6 btn-secondary"
          disabled={message?.success}
        >
          {message?.success ? "Password Reset!" : "Reset Password"}
        </SubmitButton>
      </form>

      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Remember your password?{" "}
        <button
          onClick={() => setCurrentView ? setCurrentView(LOGIN_VIEW.SIGN_IN) : router.push("/account")}
          className="underline"
          data-testid="back-to-login-button"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default ResetPassword
