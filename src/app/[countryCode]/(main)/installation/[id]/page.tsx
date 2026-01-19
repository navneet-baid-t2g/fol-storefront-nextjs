import { listCategories, listProductsByCategoryHandle } from "@lib/data/products"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"

type Props = {
  params: { id: string; countryCode: string }
  searchParams: { page?: string }
}

type CategoryMetadata = {
  description?: string
  children?: Array<{
    id: string
    name: string
    description?: string
    image?: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { response } = await listProductsByCategoryHandle({
    categoryHandle: params.id,
    countryCode: params.countryCode,
    pageParam: 1,
    queryParams: { limit: 1 },
  })

  if (!response.category) {
    return { title: "Category Not Found" }
  }

  const metadata = response.category.metadata as CategoryMetadata
  return {
    title: response.category.name,
    description:
      metadata?.description || `Browse our ${response.category.name} applications`,
  }
}

export default async function Installation({ params }: Props) {
  const { categories } = await listCategories()
  const { response } = await listProductsByCategoryHandle({
    categoryHandle: params.id,
    countryCode: params.countryCode,
    pageParam: 1,
    queryParams: { limit: 50 },
  })

  if (!response.category) notFound()

  const activeCategory = response.category
  const categoryMetadata = activeCategory.metadata as CategoryMetadata
  const children = categoryMetadata?.children || []

  return (
    <>
      {/* Hero Banner */}
      <div className="product-hero-banner relative h-64 bg-gradient-to-r from-gray-900 to-gray-700 overflow-hidden">
        <div className="product-banner-overlay absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="product-banner-content relative h-full flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">{activeCategory.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Applications</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
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

          {/* Main Content - Children */}
          <div className="lg:col-span-9 space-y-8">
            {children.length > 0 ? (
              children.map((child) => (
                <div key={child.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-2xl font-semibold text-gray-900">{child.name}</h3>
                  {child.description && <p className="mt-2 text-gray-700">{child.description}</p>}
                  {child.image && (
                    <img src={child.image} alt={child.name} className="mt-4 w-full rounded-lg shadow-md" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No applications found for this category.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
