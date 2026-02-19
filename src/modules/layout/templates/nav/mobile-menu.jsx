"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  RiMenuLine,
  RiCloseLine,
  RiUserLine,
  RiShoppingCartLine,
  RiArrowDownSLine,
} from "@remixicon/react"
import GetQuoteButton from "@modules/common/components/get-quote"

/**
 * @param {{
 *   products: any[],
 *   installationCategories: any[]
 * }} props
 */
export default function MobileMenu({
  products = [],
  installationCategories = [],
}) {

  const [open, setOpen] = useState(false)
  const [openSection, setOpenSection] = useState(null)

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="xl:hidden absolute left-3 top-8 px-2 text-2xl"
      >
        <RiMenuLine />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 xl:hidden transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white w-72 h-full py-6 px-5 transition-transform ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close */}
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

          {/* Menu */}
          <ul className="space-y-4 uppercase text-gray-700">

            <li>
              <LocalizedClientLink href="/" onClick={() => setOpen(false)}>
                Home
              </LocalizedClientLink>
            </li>

            {/* PRODUCTS */}
            {/* PRODUCTS */}
            <li>
              <div className="flex justify-between items-center w-full">
                
                {/* Click on text → Go to Store */}
                <LocalizedClientLink
                  href="/store"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Products
                </LocalizedClientLink>

                {/* Click on arrow → Open dropdown */}
                <button
                  onClick={() => toggleSection("products")}
                  className="p-1"
                >
                  <RiArrowDownSLine
                    className={`transition-transform ${
                      openSection === "products" ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {openSection === "products" && (
                <ul className="mt-2 ml-3 space-y-2 text-sm normal-case">
                  {products.map((product) => (
                    <li key={product.id}>
                      <LocalizedClientLink
                        href={`/products/${product.handle}`}
                        onClick={() => setOpen(false)}
                      >
                        {product.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>


            {/* INSTALLATIONS */}
            {/* INSTALLATIONS */}
            <li>
              <div className="flex justify-between items-center w-full">
                
                {/* Styled like other links but does nothing */}
                <LocalizedClientLink
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex-1"
                >
                  Installations
                </LocalizedClientLink>

                {/* Arrow → toggles dropdown */}
                <button
                  onClick={() => toggleSection("installations")}
                  className="p-1"
                >
                  <RiArrowDownSLine
                    className={`transition-transform ${
                      openSection === "installations" ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {openSection === "installations" && (
                <ul className="mt-2 ml-3 space-y-2 text-sm normal-case">
                  {installationCategories
                    .filter((c) => !c.parent_category_id)
                    .map((category) => (
                      <li key={category.id}>
                        <LocalizedClientLink
                          href={`/installation/${category.handle}`}
                          onClick={() => setOpen(false)}
                        >
                          {category.name}
                        </LocalizedClientLink>
                      </li>
                    ))}
                </ul>
              )}
            </li>

            {/* SUPPORT */}
            <li>
              <div className="flex justify-between items-center w-full">
                <LocalizedClientLink
                  href="/support"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Support
                </LocalizedClientLink>

                <button
                  onClick={() => toggleSection("support")}
                  className="p-1"
                >
                  <RiArrowDownSLine
                    className={`transition-transform ${
                      openSection === "support" ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {openSection === "support" && (
                <ul className="mt-2 ml-3 space-y-2 text-sm normal-case">
                  <li>
                    <LocalizedClientLink
                      href="/rma"
                      onClick={() => setOpen(false)}
                    >
                      RMA
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink href="/warranty-support" onClick={() => setOpen(false)}>
                      Warranty Support
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink href="/our-commitment-to-support" onClick={() => setOpen(false)}>
                      Our Commitment to Support
                    </LocalizedClientLink>
                  </li>

                </ul>
              )}
            </li>


            {/* RESOURCES */}
            <li>
              <div className="flex justify-between items-center w-full">
                <LocalizedClientLink
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex-1"
                >
                  Resources
                </LocalizedClientLink>

                <button
                  onClick={() => toggleSection("resources")}
                  className="p-1"
                >
                  <RiArrowDownSLine
                    className={`transition-transform ${
                      openSection === "resources" ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {openSection === "resources" && (
                <ul className="mt-2 ml-3 space-y-2 text-sm normal-case">
                  <li>
                    <LocalizedClientLink href="/datasheet" onClick={() => setOpen(false)}>
                      Datasheets
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink href="/product-videos" onClick={() => setOpen(false)}>
                      Product Videos
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink href="/training" onClick={() => setOpen(false)}>
                      Training
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink href="/blogs" onClick={() => setOpen(false)}>
                      Blogs
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink href="/faqs" onClick={() => setOpen(false)}>
                      FAQs
                    </LocalizedClientLink>
                  </li>
                </ul>
              )}
            </li>


            {/* ABOUT US */}
            <li>
              <div className="flex justify-between items-center w-full">
                <LocalizedClientLink
                  href="/about-us"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  About Us
                </LocalizedClientLink>

                <button
                  onClick={() => toggleSection("about")}
                  className="p-1"
                >
                  <RiArrowDownSLine
                    className={`transition-transform ${
                      openSection === "about" ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {openSection === "about" && (
                <ul className="mt-2 ml-3 space-y-2 text-sm normal-case">
                  <li>
                    <LocalizedClientLink href="/careers" onClick={() => setOpen(false)}>
                      Careers
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink href="/events" onClick={() => setOpen(false)}>
                      Events
                    </LocalizedClientLink>
                  </li>
                  <li>
                    <LocalizedClientLink href="/our-values" onClick={() => setOpen(false)}>
                      Our Values
                    </LocalizedClientLink>
                  </li>
                  
                  <li>
                    <LocalizedClientLink href="/why-choose-us" onClick={() => setOpen(false)}>
                      Why Choose Us
                    </LocalizedClientLink>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <LocalizedClientLink href="/contact-us">
                Contact Us
              </LocalizedClientLink>
            </li>
          </ul>

          {/* Account */}
          <div className="mt-8 space-y-3">
            <div className="flex gap-2 items-center">
              <RiUserLine />
              <LocalizedClientLink href="/account">Sign In</LocalizedClientLink>
            </div>

            <div className="flex gap-2 items-center">
              <RiShoppingCartLine />
              <LocalizedClientLink href="/cart">Cart</LocalizedClientLink>
            </div>
          </div>

          <div className="mt-8">
            <GetQuoteButton />
          </div>

          <div className="mt-6">
            <LocalizedClientLink
              href="/become-a-sales-partner"
              className="btn-primary w-full block text-center"
            >
              Become a Sales Partner
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </>
  )
}
