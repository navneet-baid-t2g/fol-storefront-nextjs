"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import Link from "next/link"

export default function LatestProducts() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])

  useEffect(() => {
    if (!loading) return

    sdk.store.product
      .list({
        limit: 4,
        order: "-created_at", // latest first
      })
      .then(({ products: fetched }) => {
        setProducts(fetched || [])
        setLoading(false)
      })
  }, [loading])
console.log("product",products)
  return (
    <section className="products-section px-3 xl:px-0">
      <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="section-header mb-10">
          <h2 className="bordered">Explore Our Products</h2>
        </div>
        {loading && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="product-card block cursor-pointer animate-pulse"
            >
              <div className="product-image bg-gray-200 rounded-md w-full h-64"></div>

              <div className="product-information mt-6">
                <span className="product-model bg-gray-300 h-4 w-32 block rounded"></span>
                <h3 className="mt-4 mb-0 product-title bg-gray-300 h-5 w-40 block rounded"></h3>
              </div>
            </div>
          ))}
        </div>
        }

        {!loading && products.length === 0 && (
          <p className="text-center">No products found.</p>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className="product-card block cursor-pointer transition hover:shadow-lg"
              >
                {product.thumbnail && (
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="product-image"
                  />
                )}
                <div className="product-information">
                  {/* <span className="product-model">Model: FOL-101</span> */}
                  <h3 className="mt-4 mb-0 product-title">{product.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
