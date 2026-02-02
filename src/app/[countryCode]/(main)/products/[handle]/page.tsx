import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

/**
 * Generate all static paths for product pages
 */
export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes?.length) return []

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

/**
 * Helper to filter images for a selected variant
 */
function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) return product?.images

  const variant = product.variants.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images.length) return product.images

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return product.images.filter((i) => imageIdsMap.has(i.id))
}

/**
 * Generate metadata for SEO / OpenGraph
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle, countryCode } = params

  const region = await getRegion(countryCode)
  if (!region) {
    notFound()
    return {} // stops execution safely
  }

  const product = await listProducts({
    countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
    return {} // stops execution safely
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

/**
 * Main product page component
 */
export default async function ProductPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { handle, countryCode } = params
  const selectedVariantId = searchParams.v_id

  // Fetch both region and product at the same time
  const [region, product] = await Promise.all([
    getRegion(countryCode),
    listProducts({
      countryCode,
      queryParams: { handle },
    }).then(({ response }) => response.products[0]),
  ])

  // Validate only once
  if (!region || !product) {
    notFound()
    return null // safe exit
  }

  const images = getImagesForVariant(product, selectedVariantId)

  return (
    <ProductTemplate
      product={product}
      region={region}
      countryCode={countryCode}
      images={images}
    />
  )
}
