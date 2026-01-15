"use client"
import Cookies from "js-cookie"
import { Button } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "../localized-client-link"

type Props = {
  product?: string
}

export default function QuoteButton({ product }: Props) {
  const router = useRouter()
  const email = Cookies.get("email") // check login

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!email) {
      // Not logged in → redirect to login page
      router.push("/account")
    } else {
      // Logged in → go to quote form page
      // You can pass product in query if needed
      const quoteUrl = product
        ? `quote-form?product=${encodeURIComponent(product)}`
        : "quote-form"
      router.push(quoteUrl)
    }
  }

  return (
    <LocalizedClientLink href="/quote-form" onClick={handleClick} className="btn-primary whitespace-nowrap">
      {email ? "Request a Quote" : "Sign in to Request a Quote"}
    </LocalizedClientLink>
  )
}
