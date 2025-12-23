"use client"

import { Suspense, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { RiMenuLine, RiCloseLine, RiUserLine, RiShoppingCartLine } from "@remixicon/react"
import CartButton from "@modules/layout/components/cart-button"

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="xl:hidden absolute left-3 top-8 px-2 rounded-md text-2xl"
      >
        <RiMenuLine />
      </button>

      {/* Drawer Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 xl:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div
          className={`bg-white w-72 h-full py-6 px-5 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="text-2xl absolute right-4 top-4"
          >
            <RiCloseLine />
          </button>

          {/* Logo */}
          <LocalizedClientLink href="/" onClick={() => setOpen(false)}>
            <img src="/images/logo.png" className="w-[75%] mb-8" />
          </LocalizedClientLink>

          {/* Menu Links */}
          <ul className="space-y-4 uppercase tracking-wide text-gray-700">
            <li><LocalizedClientLink href="/" onClick={() => setOpen(false)}>Home</LocalizedClientLink></li>
            <li><LocalizedClientLink href="/store" onClick={() => setOpen(false)}>Our Products</LocalizedClientLink></li>
            <li><LocalizedClientLink href="#" onClick={() => setOpen(false)}>Installations</LocalizedClientLink></li>
            <li><LocalizedClientLink href="#" onClick={() => setOpen(false)}>Support</LocalizedClientLink></li>
            <li><LocalizedClientLink href="#" onClick={() => setOpen(false)}>Resources</LocalizedClientLink></li>
            <li><LocalizedClientLink href="#" onClick={() => setOpen(false)}>About Us</LocalizedClientLink></li>
            <li><LocalizedClientLink href="/contact-us" onClick={() => setOpen(false)}>Contact Us</LocalizedClientLink></li>
          </ul>
          <div className="flex items-start gap-2 flex-1 mt-8 flex-col justify-start ">

            <div className="flex items-center gap-2">
              <RiUserLine />
              <LocalizedClientLink href="/account" className="text-sm">
            Sign In
              </LocalizedClientLink>
            </div>

            {/* Cart */}
            <div className="flex items-center gap-2">
              <RiShoppingCartLine />
           <LocalizedClientLink href="/cart" className="text-sm">
                Cart
              </LocalizedClientLink>
            </div>
          </div>
          {/* Bottom CTA */}
          <div className="mt-10">
            <LocalizedClientLink
              href="/become-a-sales-partner"
              onClick={() => setOpen(false)}
              className="w-full block btn-primary"
            >
              Become a Sales Partner
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </>
  )
}
