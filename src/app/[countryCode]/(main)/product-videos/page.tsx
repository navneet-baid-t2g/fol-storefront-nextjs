import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { notFound } from "next/navigation"
import {ProductVideosProps} from "types/productVideos"

export default async function AllProductVideosPage({ params }: ProductVideosProps) {
  const region = await getRegion(params.countryCode)

  if (!region) {
    return notFound()
  }

  const { response } = await listProducts({
    countryCode: params.countryCode,
    queryParams: { limit: 100 },
  })

  const products = response?.products || []

  const allVideos = products.flatMap((product) => {
    const metadata = product.metadata as
      | { media_links?: string[] }
      | undefined

    return Array.isArray(metadata?.media_links)
      ? metadata.media_links
      : []
  })

  return (
    <div>
      {/* Hero Banner (UNCHANGED) */}
      <div className="static-banner">
        <div className="static-banner-overlay"></div>
        <div className="static-banner-content">
          <h1>All Product Videos</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">

          {allVideos.length === 0 ? (
            <div className="flex items-center justify-center min-h-[300px] text-center bg-white rounded-lg shadow-sm border">
              <p className="text-gray-500 text-lg">
                No product videos available.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {allVideos.map((video, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border"
                >
                  <div className="aspect-video w-full">
                    <iframe
                      src={video}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
