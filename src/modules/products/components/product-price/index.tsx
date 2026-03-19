import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import Cookies from "js-cookie"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })
  const email = Cookies.get("email")
  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
  return (
    <div className="text-sm text-gray-500">
      Fill the <b>"Request a Quote"</b> form on the top bar to get the pricing.
    </div>
  )
}

  return (
    <div className="flex flex-col text-ui-fg-base">
      <span
        className={clx("text-xl-semi", {
          "text-ui-fg-interactive": selectedPrice.price_type === "sale",
        })}
      >
        {!variant}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {email ? (
            selectedPrice.calculated_price
          ) : (
            <LocalizedClientLink
              href="/account"
              className="text-sm text-gray-500"
            >
              Sign in to view the price
            </LocalizedClientLink>
          )}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-ui-fg-interactive">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
