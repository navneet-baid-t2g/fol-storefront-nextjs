"use client"

import { useState } from "react"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import OldPasswordReset from "./old-password-reset"
import EmailOtpReset from "./email-otp-reset"
import PhoneOtpReset from "./phone-otp-reset"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

export enum MANAGE_PASSWORD_VIEW {
  METHOD_SELECTION = "method-selection",
  OLD_PASSWORD = "old-password",
  EMAIL_OTP = "email-otp",
  PHONE_OTP = "phone-otp",
}

const ManagePassword = ({ setCurrentView }: Props) => {
  const [currentMethod, setCurrentMethod] = useState(MANAGE_PASSWORD_VIEW.METHOD_SELECTION)

  const handleBackToMethods = () => {
    setCurrentMethod(MANAGE_PASSWORD_VIEW.METHOD_SELECTION)
  }

  const handleBackToLogin = () => {
    setCurrentView(LOGIN_VIEW.SIGN_IN)
  }

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
      {currentMethod === MANAGE_PASSWORD_VIEW.METHOD_SELECTION && (
        <>
          <h1 className="mb-6 text-xl font-semibold">Manage Password</h1>

          <p className="text-center text-base-regular text-ui-fg-base mb-8">
            Choose how you'd like to reset your password:
          </p>

          <div className="w-full space-y-3">
            <button
              onClick={() => setCurrentMethod(MANAGE_PASSWORD_VIEW.OLD_PASSWORD)}
              className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left"
              data-testid="reset-with-old-password-button"
            >
              <div className="font-semibold text-sm">Using Old Password</div>
              <div className="text-xs text-gray-500 mt-1">Verify your identity with your current password</div>
            </button>

            <button
              onClick={() => setCurrentMethod(MANAGE_PASSWORD_VIEW.EMAIL_OTP)}
              className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left"
              data-testid="reset-with-email-otp-button"
            >
              <div className="font-semibold text-sm">Using Email OTP</div>
              <div className="text-xs text-gray-500 mt-1">Get a one-time password sent to your email</div>
            </button>

            <button
              onClick={() => setCurrentMethod(MANAGE_PASSWORD_VIEW.PHONE_OTP)}
              className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-left"
              data-testid="reset-with-phone-otp-button"
            >
              <div className="font-semibold text-sm">Using Phone OTP</div>
              <div className="text-xs text-gray-500 mt-1">Get a one-time password sent to your phone</div>
            </button>
          </div>

          <span className="text-center text-ui-fg-base text-small-regular mt-8">
            Remember your password?{" "}
            <button
              onClick={handleBackToLogin}
              className="underline text-blue-600 hover:text-blue-700"
              data-testid="back-to-login-button"
            >
              Sign in
            </button>
            .
          </span>
        </>
      )}

      {currentMethod === MANAGE_PASSWORD_VIEW.OLD_PASSWORD && (
        <OldPasswordReset onBack={handleBackToMethods} />
      )}

      {currentMethod === MANAGE_PASSWORD_VIEW.EMAIL_OTP && (
        <EmailOtpReset onBack={handleBackToMethods} />
      )}

      {currentMethod === MANAGE_PASSWORD_VIEW.PHONE_OTP && (
        <PhoneOtpReset onBack={handleBackToMethods} />
      )}
    </div>
  )
}

export default ManagePassword
