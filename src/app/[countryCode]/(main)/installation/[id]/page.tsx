import { listCategories, getCategoryByHandle } from "@lib/data/categories";
import { listProductsByCategoryHandle } from "@lib/data/products";
import { getRegion } from "@lib/data/regions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { HttpTypes } from "@medusajs/types";
import { CategoryImage } from "types/global";
import ReactMarkdown from "react-markdown";


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

  const childProductsResults = await Promise.all(
    childrenWithImages.map(async (child) => {
      const result = await listProductsByCategoryHandle({
        categoryHandle: child.handle,
        countryCode,
        pageParam: 1,
        queryParams: { limit: 3 },
      });
      return { child, products: result.response.products || [] };
    })
  );

  const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

  return (
    <>
      {/* HEADER */}
      <div className="relative h-64 bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-5xl font-bold text-white -mt-4 mb-4">{activeCategory.name}</h1>
          <p className="text-l text-gray-200 max-w-8xl leading-relaxed">
            {activeCategory.description || "Discover our complete range of products for this application."}
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

          {/* Main Area */}
          <main className="lg:col-span-9 space-y-10">
            {childProductsResults.map(({ child, products }) => {
              // Only first product image
              const firstProductImage = products[0]?.images?.[0]?.url
                ? products[0].images[0].url.startsWith("http")
                  ? products[0].images[0].url
                  : `${BACKEND_URL}${products[0].images[0].url}`
                : null;

              // All category images
              const categoryImages: string[] = (child.product_category_image || []).map((img) =>
                img.url.startsWith("http") ? img.url : `${BACKEND_URL}${img.url}`
              );

              const firstProduct = products[0] || null;

              return (
                <section key={child.id} className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">{child.name}</h2>

                  <div className="flex flex-col items-center gap-6 mb-8">
                    <ProductCategoryCarousel
                      productImage={firstProductImage || undefined}
                      categoryImages={categoryImages}
                      altProduct={firstProduct?.title || "Product Image"}
                      altCategory={`${child.name} Category Image`}
                    />
                  </div>

                  
                  <div className="mb-10 px-4">
                    <div className="prose prose-lg max-w-2xl mx-auto text-gray-700
                                    prose-ul:list-disc prose-ul:pl-6
                                    prose-ol:list-decimal prose-li:marker:text-gray-500">
                      <ReactMarkdown>{child.description}</ReactMarkdown>
                    </div>
                  </div>

                  {firstProduct ? (
                    <Link
                      href={`/${countryCode}/products/${firstProduct.handle}`}
                      className="block w-full max-w-md mx-auto text-center px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg"
                    >
                      View {firstProduct.title}
                    </Link>
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