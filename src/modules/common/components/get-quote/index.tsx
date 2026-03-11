"use client"
import Cookies from "js-cookie"
import { Button } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import LocalizedClientLink from "../localized-client-link"
import { QuoteProps } from "types/quote"

export default function QuoteButton({ product }: QuoteProps) {
  const router = useRouter()
  const email = Cookies.get("email") // check login

  const handleClick = () => {
  if (!email) {
    router.push("/account")
  } else {
    const quoteUrl = product
      ? `/quote-form?product=${encodeURIComponent(product)}`
      : "/quote-form"

    router.push(quoteUrl)
  }
}


  return (
  <button
    onClick={handleClick}
    className="btn-primary whitespace-nowrap"
  >
    Request a Quote
  </button>
)

}
