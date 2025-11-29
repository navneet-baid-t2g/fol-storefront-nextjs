import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { RiSearchLine, RiShoppingCartLine, RiUserLine } from "@remixicon/react"
import SearchBar from "./search-bar"
import MobileMenu from "./mobile-menu"
export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <>
      <div className="bg-white shadow-sm">

        {/* Top Notification Bar */}
        <div className="topbar overflow-hidden whitespace-nowrap">
          <div className="marquee inline-block">
            FR302 range is 100 km, 50 km per sensor, and 2 sensors per controller •
            FR302 range is 100 km, 50 km per sensor, and 2 sensors per controller •
            FR302 range is 100 km, 50 km per sensor, and 2 sensors per controller •
          </div>
        </div>

        {/* Header */}
        <header className="max-w-8xl mx-auto relative h-20 flex items-center px-3 xl:px-0">

          {/* Mobile Menu */}
          <MobileMenu />

          {/* Logo */}
          <div className="flex-1 flex items-center justify-start pl-12 xl:pl-0 xl:justify-start">
            <LocalizedClientLink href="/">
              <img src="/images/logo.png" className="logo" />
            </LocalizedClientLink>
          </div>

          {/* Search (Desktop Only) */}
          <div className="hidden xl:flex flex-col items-center flex-1 max-w-lg text-center">
            <SearchBar />
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center justify-end gap-x-4 xl:gap-x-6 flex-1">

            <div className="flex items-center gap-2">
              <RiUserLine />
              <LocalizedClientLink href="/account" className="text-sm">
                Hello <br /> Sign In
              </LocalizedClientLink>
            </div>

            {/* Cart */}
            <div className="flex items-center gap-2">
              <RiShoppingCartLine />
              <Suspense fallback={<LocalizedClientLink href="/cart">Cart (0)</LocalizedClientLink>}>
                <CartButton />
              </Suspense>
            </div>

            <LocalizedClientLink
              href="/become-a-sales-partner"
              className="btn-primary hidden xl:block"
            >
              Become a Sales Partner
            </LocalizedClientLink>
          </div>
        </header>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden xl:block site-menu sticky top-0 inset-x-0 z-40 text-sm">
        <ul className="max-w-8xl mx-auto flex justify-between py-3 px-3 xl:px-0 uppercase tracking-wide text-ui-fg-subtle">
          <li><LocalizedClientLink href="/">Home</LocalizedClientLink></li>
          <li><LocalizedClientLink href="/store">Our Products</LocalizedClientLink></li>
          <li><LocalizedClientLink href="#">Installations</LocalizedClientLink></li>
          <li><LocalizedClientLink href="#">Support</LocalizedClientLink></li>
          <li><LocalizedClientLink href="#">Resources</LocalizedClientLink></li>
          <li><LocalizedClientLink href="#">About Us</LocalizedClientLink></li>
          <li><LocalizedClientLink href="/contact-us">Contact Us</LocalizedClientLink></li>
        </ul>
      </nav>
    </>
  )
}
