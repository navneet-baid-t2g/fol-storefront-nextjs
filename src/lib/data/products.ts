"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}



// ... your existing code ...

/**
 * Fetch all collections
 */
export const listCollections = async ({
  queryParams,
}: {
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreCollectionListParams
} = {}): Promise<{
  collections: HttpTypes.StoreCollection[]
  count: number
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
      `/store/collections`,
      {
        method: "GET",
        query: {
          fields: "*products,+handle,+metadata", // Added +metadata here
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ collections, count }) => {
      return {
        collections,
        count,
      }
    })
}

/**
 * Get a single collection by handle
 */
export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[] }>(
      `/store/collections`,
      {
        method: "GET",
        query: {
          handle: [handle],
          fields: "*products,+metadata", // Added +metadata here
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ collections }) => {
      return collections[0] || null
    })
}

/**
 * List products filtered by collection
 */
export const listProductsByCollection = async ({
  pageParam = 1,
  collectionId,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  collectionId: string
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          collection_id: [collectionId], // Filter by collection
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,+collection",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * List products by collection handle (more user-friendly)
 */
export const listProductsByCollectionHandle = async ({
  pageParam = 1,
  collectionHandle,
  queryParams,
  countryCode,
  sortBy = "created_at",
}: {
  pageParam?: number
  collectionHandle: string
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode: string
  sortBy?: SortOptions
}): Promise<{
  response: { 
    products: HttpTypes.StoreProduct[]
    count: number
    collection: HttpTypes.StoreCollection | null
  }
  nextPage: number | null
}> => {
  // First get the collection (now with metadata)
  const collection = await getCollectionByHandle(collectionHandle)
  
  if (!collection) {
    return {
      response: { products: [], count: 0, collection: null },
      nextPage: null,
    }
  }

  // Then get products for that collection
  const { response, nextPage } = await listProductsByCollection({
    pageParam,
    collectionId: collection.id,
    queryParams,
    countryCode,
  })

  // Sort if needed
  const sortedProducts = sortProducts(response.products, sortBy)

  return {
    response: {
      products: sortedProducts,
      count: response.count,
      collection, // This now includes metadata
    },
    nextPage,
  }
}



/**
 * List all categories
 */
export const listCategories = async ({
  queryParams,
}: {
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductCategoryListParams
} = {}): Promise<{
  categories: HttpTypes.StoreProductCategory[]
  count: number
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[]; count: number }>(
      `/store/product-categories`,
      {
        method: "GET",
        query: {
          fields: "+handle,+metadata,+parent_category,+category_children",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories, count }) => {
      return {
        categories: product_categories,
        count,
      }
    })
}

/**
 * Get a single category by handle
 */
export const getCategoryByHandle = async (
  handle: string
): Promise<HttpTypes.StoreProductCategory | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      `/store/product-categories`,
      {
        method: "GET",
        query: {
          handle: [handle],
          fields: "+handle,+metadata,+parent_category,+category_children",
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => {
      return product_categories[0] || null
    })
}

/**
 * List products filtered by category
 */
export const listProductsByCategory = async ({
  pageParam = 1,
  categoryId,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  categoryId: string
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null
  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          category_id: [categoryId], // Filter by category
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,+categories",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null
      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}
/**
 * List products by category handle (more user-friendly)
 */
export const listProductsByCategoryHandle = async ({
  pageParam = 1,
  categoryHandle,
  queryParams,
  countryCode,
  sortBy = "created_at",
}: {
  pageParam?: number
  categoryHandle: string
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode: string
  sortBy?: SortOptions
}): Promise<{
  response: { 
    products: HttpTypes.StoreProduct[]
    count: number
    category: HttpTypes.StoreProductCategory | null
  }
  nextPage: number | null
}> => {
  // First get the category
  const category = await getCategoryByHandle(categoryHandle)
  
  if (!category) {
    return {
      response: { products: [], count: 0, category: null },
      nextPage: null,
    }
  }

  // Then get products for that category
  const { response, nextPage } = await listProductsByCategory({
    pageParam,
    categoryId: category.id,
    queryParams,
    countryCode,
  })

  // Sort if needed
  const sortedProducts = sortProducts(response.products, sortBy)

  return {
    response: {
      products: sortedProducts,
      count: response.count,
      category, // This includes metadata
    },
    nextPage,
  }
}