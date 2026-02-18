import Link from "next/link"
import { strapiFetch } from "@lib/starpi"

async function getBlogs() {
  const data = await strapiFetch("/blogs?populate=*")
  return data.data || []
}

export default async function BlogsPage() {
  const blogs = await getBlogs()

  // Base URL calculation (Removes /api from http://localhost:1337/api)
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL?.replace("/api", "")

  return (
    <>
      {/* BLOGS HERO BANNER */}
      <div className="static-banner">
      <div className="static-banner-overlay"></div>
      <div className="static-banner-content">
        <h1>{blogs[0].pageTitle}</h1>

      </div>
    </div>

      {/* BLOGS GRID */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog: any) => {
            const attrs = blog.attributes || blog
            const imageUrl =
              attrs.cover_image?.data?.attributes?.url || attrs.cover_image?.url
            const fullImageUrl = imageUrl ? `${baseUrl}${imageUrl}` : null

            return (
              <div
                key={blog.id}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {fullImageUrl && (
                  <img
                    src={fullImageUrl}
                    alt={attrs.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{attrs.title}</h2>
                  <p className="text-gray-600 mb-4">{attrs.excerpt}</p>
                  <Link
                    href={`/blogs/${attrs.slug}`}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
