"use client"

import { useEffect } from "react"
import Script from "next/script"
import { Button } from "@medusajs/ui"
import { placeOrder } from "@lib/data/cart"


const RazorpayPaymentButton = ({ cart, session, notReady }: any) => {
  const ensureShippingMethod = async () => {
  console.log("🔄 Checking shipping...")

  // ❌ REMOVE cart fetch (it is failing and NOT needed)

  if (cart.shipping_methods?.length) {
    console.log("✅ Shipping already exists")
    return
  }

  console.log("⚠️ Adding shipping method...")

  // ✅ STEP 1: Get shipping options
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/shipping-options?cart_id=${cart.id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  const data = await res.json()
  console.log("🚚 OPTIONS:", data)

  if (!data.shipping_options?.length) {
    throw new Error("❌ No shipping options available")
  }

  const optionId = data.shipping_options[0].id

  // ✅ STEP 2: Add shipping method
  const addRes = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}/shipping-methods`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        option_id: optionId,
      }),
    }
  )

  const addData = await addRes.json()
  console.log("✅ Shipping added:", addData)
}
  const handlePayment = async () => {
    try{
      await ensureShippingMethod()
      if (!cart || !session) {
        console.error("❌ No payment session found")
        return
      }
    }
    catch(err) {
      console.error("❌ Error ensuring shipping method:", err)
      return
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,

      // ✅ Use cart total in paisa (multiply by 100 since cart.total is in rupees)
      amount: cart.total * 100,
      currency: "INR",
      order_id: session.data?.id,

      name: "Fiber Optics Labs",
      description: "Order Payment",

      handler: async function (response: any) {
        console.log("✅ SUCCESS", response)

        // ✅ THIS WILL NOW WORK
        await placeOrder()

        window.location.href = "/order/confirmed"
      },

      prefill: {
        name: cart.shipping_address?.first_name,
        email: cart.email,
      },
    }


    const rzp = new (window as any).Razorpay(options)
    rzp.open()
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Button
        size="large"
        className="mt-6"
        onClick={handlePayment}
        disabled={notReady}
      >
        Pay with Razorpay
      </Button>
    </>
  )
}

export default RazorpayPaymentButton