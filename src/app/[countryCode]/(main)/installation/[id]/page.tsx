import {
    listCategories,
    listProductsByCategoryHandle,
  } from "@lib/data/products"
  import { notFound } from "next/navigation"
  import Link from "next/link"
  import { Metadata } from "next"
  
  type Props = {
    params: { id: string; countryCode: string }
    searchParams: { page?: string }
  }
  
  // Type for category metadata
  type CategoryMetadata = {
    description?: string
    highlights?: Array<{ title: string; description: string }> | string
  }
  
  // Type for product metadata
  type ProductMetadata = {
    specifications?: string
  }
  
  // Helper function to truncate text by word count
  function truncateText(
    text: string,
    wordLimit: number
  ): { truncated: string; isTruncated: boolean } {
    const words = text.split(/\s+/)
    if (words.length <= wordLimit) {
      return { truncated: text, isTruncated: false }
    }
    return {
      truncated: words.slice(0, wordLimit).join(" ") + "...",
      isTruncated: true,
    }
  }
  
  export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { response } = await listProductsByCategoryHandle({
      categoryHandle: params.id,
      countryCode: params.countryCode,
      pageParam: 1,
      queryParams: { limit: 1 },
    })
  
    if (!response.category) {
      return {
        title: "Category Not Found",
      }
    }
  
    const metadata = response.category.metadata as CategoryMetadata
  
    return {
      title: response.category.name,
      description:
        (typeof metadata?.description === "string"
          ? metadata.description
          : undefined) || `Browse our ${response.category.name} products`,
    }
  }
  
  export default async function Installation({ params, searchParams }: Props) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1
  
    // Fetch all categories for the sidebar
    const { categories } = await listCategories()
  
    // Fetch products for the active category
    const { response, nextPage } = await listProductsByCategoryHandle({
      categoryHandle: params.id,
      countryCode: params.countryCode,
      pageParam: page,
      queryParams: {
        limit: 12,
      },
    })
  
    if (!response.category) {
      notFound()
    }
  
    const activeCategory = response.category
    const categoryMetadata = activeCategory.metadata as CategoryMetadata
  
  
    // Parse highlights if it's a string
    let highlights: Array<{ title: string; description: string }> = []
  
    if (categoryMetadata?.highlights) {
      if (typeof categoryMetadata.highlights === "string") {
        try {
          highlights = JSON.parse(categoryMetadata.highlights)
        } catch (e) {
          console.error("Failed to parse highlights:", e)
        }
      } else {
        highlights = categoryMetadata.highlights
      }
    }
  
    return (
      <>
        {/* Hero Banner */}
        <div className="product-hero-banner relative h-64 bg-gradient-to-r from-gray-900 to-gray-700 overflow-hidden">
          <div className="product-banner-overlay absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="product-banner-content relative h-full flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white">Installation</h1>
          </div>
        </div>
  
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Applications (Categories) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  Applications
                </h2>
                <nav className="space-y-2">
                  {categories
                    .map((category) => (
                      <Link
                        key={category.id}
                        href={`/${params.countryCode}/installation/${category.handle}`}
                        className={`block w-full text-left px-4 py-3 rounded transition text-sm font-medium ${
                          activeCategory.id === category.id
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {category.name}
                      </Link>
                    ))}
                </nav>
              </div>
            </div>
  
            {/* Middle Section - Main Content */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">
                  {activeCategory.name}
                </h2>
  
                {/* Description */}
                {activeCategory?.description && (
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {typeof activeCategory.description === "string"
                      ? activeCategory.description
                      : ""}
                  </p>
                )}
  
                {/* Highlights */}
                {highlights && highlights.length > 0 && (
                  <>
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">
                      Highlights
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {highlights.map((highlight, index) => (
                        <div key={index}>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            {highlight.title}
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {highlight.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
  
            {/* Right Sidebar - Products */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  Products
                </h2>
  
                <div className="space-y-6">
                  {response.products.length > 0 ? (
                    response.products.map((product) => {
                      const productMetadata = product.metadata as ProductMetadata
                      const { truncated, isTruncated } = truncateText(
                        product.description || "",
                        80
                      )
  
                      return (
                        <div
                          key={product.id}
                          className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                        >
                          <h3 className="text-lg font-bold text-blue-600 mb-2">
                            <Link
                              href={`/${params.countryCode}/products/${product.handle}`}
                              className="hover:underline"
                            >
                              {product.title}
                            </Link>
                          </h3>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">
                            {truncated}
                          </p>
  
                          {/* Show "Read more" link if text was truncated */}
                          {isTruncated && (
                            <Link
                              href={`/${params.countryCode}/products/${product.handle}`}
                              className="text-blue-600 text-sm font-medium hover:underline inline-flex items-center"
                            >
                              Read more
                              <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </Link>
                          )}
  
                          {/* Optional: Show product specifications */}
                          {productMetadata?.specifications && (
                            <p className="text-gray-600 text-xs mt-2 pt-2 border-t border-gray-100">
                              {productMetadata.specifications}
                            </p>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No products available in this category.
                    </p>
                  )}
                </div>
  
                {/* Pagination for products in sidebar */}
                {(nextPage || page > 1) && (
                  <div className="flex gap-2 mt-6">
                    {page > 1 && (
                      <Link
                        href={`?page=${page - 1}`}
                        className="flex-1 text-center px-3 py-2 text-sm border rounded hover:bg-gray-50"
                      >
                        Prev
                      </Link>
                    )}
                    {nextPage && (
                      <Link
                        href={`?page=${page + 1}`}
                        className="flex-1 text-center px-3 py-2 text-sm border rounded hover:bg-gray-50"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  