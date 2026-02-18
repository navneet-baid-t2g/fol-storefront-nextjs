import { strapiFetch } from "@lib/starpi"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getBlog } from "helpers/blog"

export default async function BlogDetail({
  params,
}: {
  // Fix 1: params must be a Promise in Next.js 15
  params: Promise<{ slug: string; countryCode: string }>
}) {
  // Fix 2: Await params to clear the Server Error
  const { slug } = await params
  
  const blog = await getBlog(slug)
  if (!blog) return notFound()

  const attrs = blog.attributes || blog

const imageUrl =
  Array.isArray(attrs.cover_image) && attrs.cover_image.length > 0
    ? attrs.cover_image[0].url
    : null

const baseUrl = (process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL || "http://localhost:1337/api").replace("/api", "")
const fullImageUrl = imageUrl ? `${baseUrl}${imageUrl}` : null


  // Debugging logs in your terminal
  console.log("Raw Blog Object Keys:", Object.keys(blog))
  console.log("Resolved Image Path:", imageUrl)
  console.log("Final Full Image URL:", fullImageUrl)

  return (
  <div className="max-w-6xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold mb-8">{attrs.title}</h1>

    {fullImageUrl && (
      <img
        src={fullImageUrl}
        alt={attrs.title || "Blog cover"}
        className="float-left w-full md:w-[420px] mr-0 md:mr-8 mb-4 rounded-2xl shadow-md object-cover"
      />
    )}

    <article className="prose prose-lg max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {attrs.content || ""}
      </ReactMarkdown>
    </article>

    {/* This forces content after image to take full width */}
    <div className="clear-both"></div>
  </div>
)

}
