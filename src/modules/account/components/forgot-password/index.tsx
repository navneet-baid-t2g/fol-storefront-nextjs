import { generateResetPasswordToken } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const ForgotPassword = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(generateResetPasswordToken, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="forgot-password-page"
    >
      <h1 className="mb-6 text-xl font-semibold">Forgot Password</h1>

      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
        </div>

        <ErrorMessage error={message?.error} data-testid="forgot-password-error-message" />

        {message?.success && (
          <div className="text-green-600 text-sm mt-2" data-testid="forgot-password-success-message">
            {message.message}
          </div>
        )}

        <SubmitButton
          data-testid="send-reset-link-button"
          className="w-full mt-6 btn-secondary"
        >
          Send Reset Link
        </SubmitButton>
      </form>

      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Remember your password?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
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

export default ForgotPassword
