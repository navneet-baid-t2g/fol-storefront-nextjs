"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import Accordion from "../../components/product-tabs/accordion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {

  const highlightsRaw = product?.metadata?.highlights

  let highlights: string[] = []

  if (typeof highlightsRaw === "string") {
    try {
      highlights = JSON.parse(highlightsRaw)
    } catch {
      highlights = highlightsRaw.split("\n")
    }
  } else if (Array.isArray(highlightsRaw)) {
    highlights = highlightsRaw
  }

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 mx-auto">

        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}

        <Accordion type="single" collapsible defaultValue="highlights">

          {/* Highlights */}
          {highlights.length > 0 && (
            <Accordion.Item
              title="Highlights"
              value="highlights"
              headingSize="large"
            >
              <ul className="list-disc pl-5 space-y-1 text-ui-fg-subtle">
                {highlights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Accordion.Item>
          )}

          {/* Description */}
          <Accordion.Item
            title="Description"
            value="description"
            headingSize="large"
          >
            <Text
              className="text-medium text-ui-fg-subtle whitespace-pre-line"
              data-testid="product-description"
            >
              {product.description}
            </Text>
          </Accordion.Item>

        </Accordion>

      </div>
    </div>
  )
}

export default ProductInfo