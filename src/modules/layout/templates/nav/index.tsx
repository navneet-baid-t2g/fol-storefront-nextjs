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
import { listCategories, listProducts } from "@lib/data/products"
import GetQuoteButton from "@modules/common/components/get-quote"
import { LOGO_URL } from "constant"


export default async function Nav() {
  const regions = await listRegions()
  const cookies = await nextCookies()
  const email = cookies.get("email")?.value
  const name = email?.split("@")[0]

  const { categories: installationCategories } = await listCategories({
  queryParams: {
    limit: 500,
  },
})

  // Fetch products - using the first region's ID
  const { response: productsResponse } = await listProducts({
    regionId: regions[0]?.id,
    queryParams: { limit: 50 },
  })

  // Sort parent installations
  const parentInstallations = installationCategories
    .filter((category: any) => !category.parent_category_id)
    .sort((a: any, b: any) => a.rank - b.rank)

  // Deterministic first installation href
  const firstInstallationHref = parentInstallations[0]
    ? `/installation/${parentInstallations[0].handle}`
    : "/installation/default"

  return (
    <>
      <div className="bg-white shadow-sm">
        <TopBar />

        <header className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8 relative h-20 flex items-center">
          <MobileMenu
            products={productsResponse.products}
            installationCategories={installationCategories}
            firstInstallationHref={firstInstallationHref}
          />

          {/* Logo */}
          <div className="flex-1 flex items-center justify-start pl-12 xl:pl-0 xl:justify-start">
            <LocalizedClientLink href="/">
              <img src={LOGO_URL} className="logo" alt="Logo" />
            </LocalizedClientLink>
          </div>

          {/* Search */}
          <div className="hidden xl:flex items-center w-[420px] ml-6">
            <SearchBar />
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center justify-end gap-x-3 xl:gap-x-4 flex-[1.1] whitespace-nowrap">
            

            <GetQuoteButton />

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

          </div>
        </header>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden xl:block site-menu sticky top-0 inset-x-0 z-40 text-sm border-b border-gray-200 bg-white">
        <ul className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8 flex justify-between py-2 uppercase tracking-wide text-ui-fg-subtle">
          <li>
            <LocalizedClientLink href="/">Home</LocalizedClientLink>
          </li>
          <li className="relative group">
            <LocalizedClientLink href="/store">Products</LocalizedClientLink>

            {/* Products Dropdown */}
            <div className="absolute left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white shadow-lg rounded-md w-60 py-3 z-50 before:content-[''] before:absolute before:top-[-8px] before:left-0 before:w-full before:h-[8px]">
              <ul className="flex flex-col gap-1 px-4 text-sm text-black normal-case">
                {productsResponse.products
                  .sort((a: any, b: any) =>
                    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
                  )
                  .map((product: any) => (
                    <li key={product.id}>
                      <LocalizedClientLink
                        href={`/products/${product.handle}`}
                        className="block py-1 hover:text-blue-600 transition-colors"
                      >
                        {product.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
              </ul>
            </div>
          </li>

          {/* Installations */}
          <li className="relative group">
            <LocalizedClientLink href={firstInstallationHref}>Installations</LocalizedClientLink>
            <div className="absolute left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white shadow-lg rounded-md w-60 py-3 z-50 before:content-[''] before:absolute before:top-[-8px] before:left-0 before:w-full before:h-[8px]">
              <ul className="flex flex-col gap-1 px-4 text-sm text-black max-h-[70vh] overflow-y-auto">
                {installationCategories
                  .filter((category: any) => !category.parent_category)
                  .sort((a: any, b: any) => (a.rank ?? 999) - (b.rank ?? 999))
                  .map((category: any) => (
                    <li key={category.id}>
                      <LocalizedClientLink
                        href={`/installation/${category.handle}`}
                        className="block py-1 leading-5 hover:text-blue-600 transition-colors"
                      >
                        {category.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
              </ul>
            </div>
          </li>

          <li className="relative group">
            <LocalizedClientLink href="/support">Support</LocalizedClientLink>
            <div className="absolute left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white shadow-lg rounded-md w-60 py-3 z-50 before:content-[''] before:absolute before:top-[-8px] before:left-0 before:w-full before:h-[8px]">
              <ul className="flex flex-col gap-2 px-4 text-sm text-black">
                <li>
                  <LocalizedClientLink href="/rma">RMA</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/warranty-support">Warranty Support</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/our-commitment-to-support">Our Commitment to Support</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/support-videos">Support Videos</LocalizedClientLink>
                </li>
              </ul>
            </div>
          </li>

          <li className="relative group">
            <LocalizedClientLink href="/datasheet">Resources</LocalizedClientLink>
            <div className="absolute left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white shadow-lg rounded-md w-60 py-3 z-50 before:content-[''] before:absolute before:top-[-8px] before:left-0 before:w-full before:h-[8px]">
              <ul className="flex flex-col gap-2 px-4 text-sm text-black">
                <li>
                  <LocalizedClientLink href="/datasheet">Datasheets</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/certifications">Certifications</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/product-videos">Product Videos</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/training">Training</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/blogs">Blogs</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/faqs">FAQs</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/become-a-sales-partner">Become A Sales Partner</LocalizedClientLink>
                </li>
              </ul>
            </div>
          </li>

          <li className="relative group">
            <LocalizedClientLink href="/about-us">About Us</LocalizedClientLink>
            <div className="absolute left-0 top-full mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white shadow-lg rounded-md w-60 py-3 z-50 before:content-[''] before:absolute before:top-[-8px] before:left-0 before:w-full before:h-[8px]">
              <ul className="flex flex-col gap-2 px-4 text-sm text-black">
                <li>
                  <LocalizedClientLink href="/careers">Careers</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/events">Upcoming Events</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/our-values">Our Values</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/why-choose-us">Why Choose Us</LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/testimonials">Testimonials</LocalizedClientLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <LocalizedClientLink href="/contact-us">Contact Us</LocalizedClientLink>
          </li>
        </ul>
      </nav>
    </>
  )
}