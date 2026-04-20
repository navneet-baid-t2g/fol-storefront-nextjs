import { Metadata } from "next"

import ResetPasswordTemplate from "@modules/account/templates/reset-password-template"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Fiber Opticals Labs account password.",
}

export default function ResetPassword() {
  return <ResetPasswordTemplate />
}