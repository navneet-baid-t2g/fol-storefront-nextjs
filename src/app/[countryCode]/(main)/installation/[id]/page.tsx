import { listCategories, getCategoryByHandle } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"

type Props = {
  params: { id: string; countryCode: string }
}
export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryByHandle([params.id])
  if (!category) return { title: "Category Not Found" }
  return {
    title: category.name,
    description: category.description || `Browse ${category.name} applications`,
  }
}

export default async function Installation({ params }: Props) {
  const categories = await listCategories()
  const activeCategory = await getCategoryByHandle([params.id])
  if (!activeCategory) notFound()

  const children = activeCategory.category_children || []

  // ✅ Get ALL parent products once (efficient)
  const parentProducts = await listProducts({
    category_id: [activeCategory.id],
    limit: children.length || 5,  // Match number of children
    countryCode: params.countryCode,
  })
  
  const allProducts = parentProducts?.response?.products || []

  return (
    <>
      {/* Hero */}
      <div className="relative h-64 bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">{activeCategory.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sidebar - SAME */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Applications</h2>
              <nav className="space-y-2">
                {categories
                  .filter((cat) => !cat.parent_category)
                  .map((category) => (
                    <Link
                      key={category.id}
                      href={`/${params.countryCode}/installation/${category.handle}`}
                      className={`block px-4 py-3 rounded text-sm font-medium ${
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
          </aside>

          {/* Main Content - FIXED */}
          <main className="lg:col-span-9 space-y-10">
            {children.length > 0 ? (
              children.map((child, index) => {
                // ✅ Assign product by child index/rank (UNIQUE!)
                const productIndex = child.rank || index
                const product = allProducts[productIndex] || allProducts[0]

                return (
                  <section key={child.id} className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6">{child.name}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <img
                        src={product?.thumbnail || "/images/product-placeholder.webp"}
                        alt={`${child.name} - ${product?.title || 'Featured Product'}`}
                        className="w-full h-64 rounded-lg object-cover bg-gray-200"
                      />
                      <p className="text-gray-700 leading-relaxed">
                          {child.description}
                        </p>
                    </div>

                    {product ? (
                      <Link
                        href={`/${params.countryCode}/products/${product.handle}`}
                        className="block w-full text-center px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                      >
                        View {product.title} →
                      </Link>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No products available.</p>
                    )}
                  </section>
                )
              })
            ) : (
              <p className="text-gray-500">No applications found under this category.</p>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
