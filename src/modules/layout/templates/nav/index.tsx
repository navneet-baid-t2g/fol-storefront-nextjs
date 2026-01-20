import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { RiUserLine, RiShoppingCartLine } from "@remixicon/react"
import SearchBar from "./search-bar"
import TopBar from "./topbar-ticker"
import { cookies as nextCookies } from "next/headers"
import MobileMenu from "./mobile-menu"
import { listCategories } from "@lib/data/products"
import GetQuoteButton from "@modules/common/components/get-quote"

export default async function Nav() {
  const regions = await listRegions()
  const cookies = await nextCookies()
  const email = cookies.get("email")?.value
  const name = email?.split("@")[0]

  const { categories: installationCategories } = await listCategories()

  return (
    <>
      <div className="bg-white shadow-sm">
        <TopBar />

        <header className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8 relative h-20 flex items-center">
          <MobileMenu />

          {/* Logo */}
          <div className="flex-1 flex items-center justify-start pl-12 xl:pl-0 xl:justify-start">
            <LocalizedClientLink href="/">
              <img src="/images/logo.png" className="logo" alt="Logo" />
            </LocalizedClientLink>
          </div>

          {/* Search */}
          <div className="hidden xl:flex items-center w-[420px] ml-6">
            <SearchBar />
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center justify-end gap-x-3 xl:gap-x-4 flex-[1.1] whitespace-nowrap">
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

            <div className="flex items-center gap-2">
              <RiShoppingCartLine />
              <Suspense
                fallback={
                  <LocalizedClientLink href="/cart">Cart (0)</LocalizedClientLink>
                }
              >
                <CartButton />
              </Suspense>
            </div>

            <GetQuoteButton />

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
        <ul className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8 flex justify-between py-3 uppercase tracking-wide text-ui-fg-subtle">
          <li>
            <LocalizedClientLink href="/">Home</LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/store">Our Products</LocalizedClientLink>
          </li>

          {/* Installations */}
          <li className="relative group">
            <LocalizedClientLink href="/installation">Installations</LocalizedClientLink>

            <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md w-64 py-3 z-50">
              <ul className="flex flex-col gap-2 px-4 text-sm text-black">
                {installationCategories
                .filter((category: any) => !category.parent_category_id)  // ✅ ONLY PARENTS
                .map((category: any) => (
                  <li key={category.id}>
                    <LocalizedClientLink
                      href={`/installation/${category.handle}`}
                      className="block py-2 hover:text-blue-600 transition-colors"
                    >
                      {category.name}
                    </LocalizedClientLink>
                  </li>
                ))}

              </ul>
            </div>
          </li>

          <li>
            <LocalizedClientLink href="#">Support</LocalizedClientLink>
          </li>
          <li className="relative group">
            <LocalizedClientLink href="#">Resources</LocalizedClientLink>
            <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md w-60 py-3 z-50 transition-all duration-200 group-hover:mt-1">
              <ul className="flex flex-col gap-2 px-4 text-sm text-black">
                <li>
                  <LocalizedClientLink href="#">
                    <span className="text-gray-400 cursor-not-allowed">Register your Products</span>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/datasheet">Datasheets</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="#">
                    <span className="text-gray-400 cursor-not-allowed">Product Videos</span>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="#">
                    <span className="text-gray-400 cursor-not-allowed">Training</span>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="#">
                    <span className="text-gray-400 cursor-not-allowed">Blogs</span>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="#">
                    <span className="text-gray-400 cursor-not-allowed">FAQ</span>
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <LocalizedClientLink href="#">About Us</LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact-us">Contact Us</LocalizedClientLink>
          </li>
        </ul>
      </nav>
    </>
  )
}
