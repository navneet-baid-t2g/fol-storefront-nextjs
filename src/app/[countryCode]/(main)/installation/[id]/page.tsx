import { listCategories, getCategoryByHandle } from "@lib/data/categories"
import { listProductsByCategoryHandle } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { HttpTypes } from "@medusajs/types"
import { CategoryImage } from "types/global"

export type CategoryWithImages = HttpTypes.StoreProductCategory & {
  product_category_image?: CategoryImage[]
}
export type GetCategoryByHandleResponse = {
  product_categories: CategoryWithImages[]
}

type Props = {
  params: Promise<{ id: string; countryCode: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const category = await getCategoryByHandle([id])
  if (!category) return { title: "Category Not Found" }
  return { title: category.name }
}

export default async function Installation({ params }: Props) {
  const { id, countryCode } = await params
  const categories = await listCategories()
  const activeCategory = await getCategoryByHandle([id])
  if (!activeCategory) notFound()

  const children = activeCategory.category_children || [];
  const childrenWithImages: CategoryWithImages[] = await Promise.all(
  children.map(async (child) => {
    const childWithImages = await getCategoryByHandle([child.handle])
    return childWithImages ?? (child as CategoryWithImages)
  })
)




  const region = await getRegion(countryCode)

  // ✅ FETCH PRODUCTS FOR EACH CHILD CATEGORY (like your old code)
  const childProductsPromises = childrenWithImages.map(async (child) => {
  const result = await listProductsByCategoryHandle({
    categoryHandle: child.handle,
    countryCode,
    pageParam: 1,
    queryParams: { limit: 3 }
  })
  return { child, products: result.response.products || [] }
})


  const childProductsResults = await Promise.all(childProductsPromises)
  
  console.log("✅ Child Products:", childProductsResults.map(r => 
    `${r.child.name}: ${r.products.length} products`
  ))

  const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

  return (
    <>
      <div className="relative h-64 bg-gradient-to-r from-gray-900 to-gray-700">
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold text-white -mt-4 mb-4">
          {activeCategory.name}
        </h1>

        <p className="text-xl text-gray-200 max-w-8xl leading-relaxed">
          {activeCategory.description ||
            "Discover our complete range of products for this application."}
        </p>
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
                  .filter((cat) => !cat.parent_category)
                  .map((category) => (
                    <Link
                      key={category.id}
                      href={`/${countryCode}/installation/${category.handle}`}
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

          {/* Main Content - EACH CHILD GETS ITS OWN PRODUCTS */}
          <main className="lg:col-span-9 space-y-10">
            {childProductsResults.map(({ child, products }, index) => {
              const product = products[0] || null

              const imageUrl = product?.thumbnail ||
                (product?.images?.[0]?.url?.startsWith("http")
                  ? product.images[0].url
                  : product?.images?.[0]?.url
                  ? `${BACKEND_URL}${product.images[0].url}`
                  : null)

              const categoryImage =
  child.product_category_image?.find((img) => img.type === "image") ||
  child.product_category_image?.find((img) => img.type === "thumbnail")

const categoryImageUrl = categoryImage?.url
  ? categoryImage.url.startsWith("http")
    ? categoryImage.url
    : `${BACKEND_URL}${categoryImage.url}`
  : null

console.log("✅ categoryImageUrl:", categoryImageUrl)



              return (
                <section key={child.id} className="bg-white rounded-lg shadow-md p-8">
                  {/* 1. TITLE - FIRST */}
                  <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">{child.name}</h2>
                  
                  {/* 2. IMAGE - SECOND (Centered, Natural Size) */}
                  <div className="flex flex-col items-center gap-6 mb-8">
  {/* Product Image */}
  {imageUrl && (
    <Image
      src={imageUrl}
      alt={`${child.name} - ${product?.title}`}
      width={400}
      height={400}
      className="w-full max-w-md h-auto object-contain rounded-lg shadow-lg bg-gray-50 p-4"
    />
  )}

  {/* Category Image */}
  {categoryImageUrl && (
    <Image
      src={categoryImageUrl}
      alt={`${child.name} category image`}
      width={400}
      height={400}
      className="w-full max-w-md h-auto object-contain rounded-lg shadow-md bg-white p-3"
    />
  )}

  {/* Fallback */}
  {!imageUrl && !categoryImageUrl && (
    <div className="w-64 h-64 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg">
      <span className="text-gray-500 text-lg text-center px-4">
        No Image Available
      </span>
    </div>
  )}
</div>


                  {/* 3. DESCRIPTION - THIRD */}
                  <div className="mb-10 px-4">
                    <p className="text-gray-700 leading-relaxed text-lg text-center max-w-2xl mx-auto">
                      {child.description}
                    </p>
                  </div>

                  {/* 4. LINK/BUTTON - LAST */}
                  {product ? (
                    <Link
                      href={`/${countryCode}/products/${product.handle}`}
                      className="block w-full max-w-md mx-auto text-center px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg"
                    >
                      View {product.title}
                    </Link>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg shadow-inner">
                      <p className="text-gray-500 text-lg">No products available for this application</p>
                    </div>
                  )}
                </section>
              )
            })}

          </main>
        </div>
      </div>
    </>
  )
}
