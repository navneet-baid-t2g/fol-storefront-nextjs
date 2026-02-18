"use client"
import React, { useEffect, useState } from "react"
import { sdk } from "@lib/config" // Adjust to your SDK initialization path
import { HttpTypes } from "@medusajs/types"
import { ProductMetadata, DatasheetItem } from "types/datasheet"

const Resources: React.FC = () => {
  const [datasheets, setDatasheets] = useState<DatasheetItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProductDatasheets = async () => {
      try {
        // Fetch products and explicitly request the metadata field
        const response = await sdk.store.product.list({
          fields: "+metadata" 
        })

        // Map and filter products that contain the datasheet_pdf key
        const dynamicDatasheets: DatasheetItem[] = response.products
          .filter((p: HttpTypes.StoreProduct) => {
            const metadata = p.metadata as ProductMetadata | null
            return metadata?.datasheet_pdf
          })
          .map((p: HttpTypes.StoreProduct) => ({
            name: p.title,
            link: (p.metadata as ProductMetadata).datasheet_pdf!
          }))

        setDatasheets(dynamicDatasheets)
      } catch (error) {
        console.error("Error fetching datasheets:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductDatasheets()
  }, [])

  if (isLoading) {
    return <div className="text-center py-10">Loading datasheets...</div>
  }

  return (
    <>
      <div className="static-banner">
        <div className="static-banner-overlay"></div>
        <div className="static-banner-content">
          <h1>Datasheet</h1>
        </div>
      </div>

      <div className="flex flex-col small:flex-row small:items-start py-6 content-container mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="w-full flex justify-between items-center border-b py-4">
            <h2 className="text-lg font-semibold">Product Name</h2>
            <h2 className="text-lg font-semibold">Download Datasheet</h2>
          </div>

          {datasheets.length > 0 ? (
            datasheets.map((item, index) => (
              <div key={index} className="w-full flex justify-between items-center border-b py-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Download
                </a>
              </div>
            ))
          ) : (
            <p className="py-4 text-gray-500 text-center">No datasheets found.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default Resources
