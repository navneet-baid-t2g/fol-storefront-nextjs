import { STRAPI_BASE_URL } from "constant"

export async function strapiFetch(endpoint: string) {
  // Ensure we don't double up on slashes
  const url = `${STRAPI_BASE_URL}${endpoint}`
  
  const res = await fetch(url, {
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Strapi error: ${res.status} - ${error}`)
  }

  return res.json()
}
