import { strapiFetch } from "@lib/starpi"

export async function getBlog(slug: string) {
  const data = await strapiFetch(
    `/blogs?filters[slug][$eq]=${slug}&populate=*`
  )

  if (!data?.data || data.data.length === 0) return null

  return data.data[0]
}