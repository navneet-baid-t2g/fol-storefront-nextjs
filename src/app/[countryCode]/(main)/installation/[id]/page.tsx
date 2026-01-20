import { listCategories, getCategoryByHandle } from "@lib/data/categories"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"

type Props = {
  params: Promise<{
    id: string
    countryCode: string
  }>
}

/* ---------------- METADATA ---------------- */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params   // ✅ REQUIRED

  const category = await getCategoryByHandle([id])

  if (!category) {
    return { title: "Category Not Found" }
  }

  return {
    title: category.name,
    description:
      category.description || `Browse ${category.name} applications`,
  }
}

/* ---------------- PAGE ---------------- */

export default async function Installation({ params }: Props) {
  const { id, countryCode } = await params   // ✅ REQUIRED

  // Sidebar categories
  const categories = await listCategories()

  // Active category
  const activeCategory = await getCategoryByHandle([id])
  if (!activeCategory) notFound()

  const children = activeCategory.category_children || []

  return (
    <>
      {/* Hero */}
      <div className="relative h-64 bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">
            {activeCategory.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Applications</h2>

              <nav className="space-y-2">
                {categories
                  .filter(cat => !cat.parent_category)
                  .map(category => {
                    const isActive = category.id === activeCategory.id

                    return (
                      <Link
                        key={category.id}
                        href={`/${countryCode}/installation/${category.handle}`}
                        className={`block px-4 py-3 rounded text-sm font-medium
                          ${isActive
                            ? "bg-blue-600 text-white"
                            : "bg-gray-50 text-gray-700"
                          }`}
                      >
                        {category.name}
                      </Link>
                    )
                  })}
              </nav>
            </div>
          </aside>

          {/* Main */}
          <main className="lg:col-span-9 space-y-8">
            {children.length > 0 ? (
              children.map(child => (
                <section
                  key={child.id}
                  className="bg-white rounded-lg shadow-md p-8"
                >
                  {/* Child title */}
                  <h2 className="text-2xl font-bold text-blue-600 mb-6">
                    {child.name}
                  </h2>

                  {/* Image + description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <img
                      src={
                        child.metadata?.image ||
                        "/images/category-placeholder.webp"
                      }
                      alt={child.name}
                      className="w-full rounded-lg object-cover"
                    />

                    <p className="text-gray-700 leading-relaxed">
                      {child.description}
                    </p>
                  </div>

                  {/* Full-width product link */}
                  <Link
                    href={`/${countryCode}/installation/${child.handle}`}
                    className="block w-full text-center px-6 py-3 rounded-md
                               bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  >
                    View Products →
                  </Link>
                </section>
              ))
            ) : (
              <p className="text-gray-500">
                No applications found under this category.
              </p>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
