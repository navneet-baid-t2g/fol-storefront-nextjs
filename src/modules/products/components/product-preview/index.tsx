import { Text } from "@medusajs/ui"
import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="
                product-card block cursor-pointer transition hover:shadow-lg"
    >
      {product.thumbnail && (
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-image"
        />
      )}
      <div className="product-information">
        <span className="product-model">Model: FOL-101</span>
        <h3 className="mt-4 mb-0 product-title">{product.title}</h3>
      </div>
    </LocalizedClientLink>
  )
}
