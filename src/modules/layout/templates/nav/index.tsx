import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { RiSearchLine, RiShoppingCartLine, RiUserLine } from "@remixicon/react"
import SearchBar from "./search-bar"
import TopBar from "./topbar-ticker"
import { cookies as nextCookies } from "next/headers"
import MobileMenu from "./mobile-menu"
export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const cookies = await nextCookies()
  const email = cookies.get("email")?.value
  const name = email?.split("@")[0]

  return (
    <>
      <div className="bg-white shadow-sm">
        {/* Top Notification Bar */}
        <TopBar />

        {/* Header */}
        <header className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8  relative h-20 flex items-center">
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
              {name ? (
                <LocalizedClientLink href="/account" className="text-sm">
                  {name}
                </LocalizedClientLink>
              ) : (
                <LocalizedClientLink href="/account" className="text-sm">
                  Sign In
                </LocalizedClientLink>
              )}
            </div>

            {/* Cart */}
            <div className="flex items-center gap-2">
              <RiShoppingCartLine />
              <Suspense
                fallback={
                  <LocalizedClientLink href="/cart">
                    Cart (0)
                  </LocalizedClientLink>
                }
              >
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
        <ul className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8   flex justify-between py-3 uppercase tracking-wide text-ui-fg-subtle">
          <li>
            <LocalizedClientLink href="/">Home</LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/store">
              Our Products
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="#">Installations</LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="#">Support</LocalizedClientLink>
          </li>
          <li className="relative group">
            <LocalizedClientLink href="#">Resources</LocalizedClientLink>

            <div
              className="
      absolute left-0 top-full 
      hidden group-hover:block 
      bg-white shadow-lg rounded-md w-60 py-3 z-50 
      transition-all duration-200 
      group-hover:mt-1
    "
            >
              <ul className="flex flex-col gap-2 px-4 text-sm text-black">
                <li>
                  <LocalizedClientLink href="#">
                    <span className="text-gray-400 cursor-not-allowed">
                      Register your Products
                    </span>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/datasheet">
                    Datasheets
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="#">
                    <span className="text-gray-400 cursor-not-allowed">
                      Product Videos
                    </span>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="#">
                    <span className="text-gray-400 cursor-not-allowed">
                      Training
                    </span>
                    
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="#">
                    <span className="text-gray-400 cursor-not-allowed">
                      Blogs
                    </span>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="#">
                    <span className="text-gray-400 cursor-not-allowed">
                      FAQ
                    </span>
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <LocalizedClientLink href="#">About Us</LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact-us">
              Contact Us
            </LocalizedClientLink>
          </li>
        </ul>
      </nav>
    </>
  )
}
