import { listCategories, getCategoryByHandle } from "@lib/data/categories";
import { listProductsByCategoryHandle } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { HttpTypes } from "@medusajs/types";
import { CategoryImage } from "types/global";
import ReactMarkdown from "react-markdown";
import { BACKEND_URL } from "constant";

import ProductCategoryCarousel from "../ProductCategoryCarousel";

export type CategoryWithImages = HttpTypes.StoreProductCategory & {
  product_category_image?: CategoryImage[];
};

export type GetCategoryByHandleResponse = {
  product_categories: CategoryWithImages[];
};

type Props = {
  params: { id: string; countryCode: string };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const category = await getCategoryByHandle([id]);
  if (!category) return { title: "Category Not Found" };
  return { title: category.name };
}

export default async function Installation({ params }: Props) {
  const { id, countryCode } = params;
  const categories = await listCategories();
  const activeCategory = await getCategoryByHandle([id]);
  if (!activeCategory) notFound();

  const children = activeCategory.category_children || [];
  const childrenWithImages: CategoryWithImages[] = await Promise.all(
    children.map(async (child) => {
      const childWithImages = await getCategoryByHandle([child.handle]);
      return childWithImages ?? (child as CategoryWithImages);
    })
  );

  const region = await getRegion(countryCode);

  // Fetch products for each child category and sort products alphabetically
  let childProductsResults = await Promise.all(
    childrenWithImages.map(async (child) => {
      const result = await listProductsByCategoryHandle({
        categoryHandle: child.handle,
        countryCode,
        pageParam: 1,
        queryParams: { limit: 50 }, // fetch enough products
      });

      // Sort products alphabetically
      const sortedProducts = (result.response.products || []).sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      );

      return { child, products: sortedProducts };
    })
  );

  // Sort child categories alphabetically based on first product title
  childProductsResults.sort((a, b) => {
    const aTitle = a.products[0]?.title || "";
    const bTitle = b.products[0]?.title || "";
    return aTitle.localeCompare(bTitle, undefined, { sensitivity: "base" });
  });

  type CategoryWithRank = HttpTypes.StoreProductCategory & { rank: number };

const sortedCategories = (categories as CategoryWithRank[])
  .filter((cat) => !cat.parent_category)
  .sort((a, b) => a.rank - b.rank);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 self-start">
              <h2 className="text-xl font-bold mb-4">Applications</h2>
              <nav className="space-y-2">
                {sortedCategories.map((category) => (
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

          {/* Main Area */}
          <main className="lg:col-span-9 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-blue-600 mb-2 text-center">
                  General Details for {activeCategory.name} Perimeter Security
                </h1>
                <div className="max-w-4xl w-full mx-auto">
                  <p className="text-base text-gray-700 leading-relaxed text-left">
                    {activeCategory.description || "Discover our complete range of products for this application."}
                  </p>
                </div>
              </div>
            </div>

            {/* Child Categories */}
            {childProductsResults.map(({ child, products }) => {
              const firstProduct = products[0] || null;

              // First product image
              const firstProductImage = firstProduct?.images?.[0]?.url
                ? firstProduct.images[0].url.startsWith("http")
                  ? firstProduct.images[0].url
                  : `${BACKEND_URL}${firstProduct.images[0].url}`
                : null;

              // Category images
              const categoryImages: string[] = (child.product_category_image || []).map((img) =>
                img.url.startsWith("http") ? img.url : `${BACKEND_URL}${img.url}`
              );

              return (
                <section key={child.id} className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-blue-600 text-center mb-8">{child.name}</h2>

                  {/* IMAGE ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10 items-start">
                    {/* LEFT: Product Image */}
                    <div className="flex justify-center">
                      <div className="w-[420px] bg-gray-50 rounded-xl shadow-md">
                        {firstProductImage ? (
                          <img
                            src={firstProductImage}
                            alt={firstProduct?.title || "Product Image"}
                            className="block w-full max-h-[320px] object-contain"
                          />
                        ) : (
                          <div className="h-[320px] flex items-center justify-center text-gray-400">
                            No Product Image
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT: Category Image + Carousel */}
                    <div className="flex justify-center">
                      <ProductCategoryCarousel
                        categoryImages={categoryImages}
                        altCategory={`${child.name} Category Image`}
                      />
                    </div>
                  </div>

                  <div className="mb-10 px-4">
                    <div className="markdown">
                      <ReactMarkdown>{child.description}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Product Links */}
                  {products.length > 0 ? (
                    <div className="grid gap-4">
                      {products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/${countryCode}/products/${product.handle}`}
                          className="block w-full max-w-md mx-auto text-center px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg"
                        >
                          View {product.title}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg shadow-inner">
                      <p className="text-gray-500 text-lg">No products available for this application</p>
                    </div>
                  )}
                </section>
              );
            })}
          </main>
        </div>
      </div>
    </>
  );
}