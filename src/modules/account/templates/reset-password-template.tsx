"use client"

import ResetPassword from "@modules/account/components/reset-password"

const ResetPasswordTemplate = () => {
  const setCurrentView = () => {
    // This is a standalone page, so we don't need to switch views
    // But the component expects this prop, so we provide a no-op
  }

  return (
    <div className="w-full flex justify-center px-8 py-8">
      <ResetPassword setCurrentView={setCurrentView} />
    </div>
  )
}

export default ResetPasswordTemplate