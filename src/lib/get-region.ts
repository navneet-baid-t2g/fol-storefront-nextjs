const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL!
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!

export async function getRegionId(countryCode: string) {
  const res = await fetch(`${BACKEND_URL}/store/regions`, {
    headers: {
      "x-publishable-api-key": PUBLISHABLE_KEY,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch regions")
  }

  const data = await res.json()

  const region = data.regions?.find((r: any) =>
    r.countries?.some((c: any) => c.iso_2 === countryCode)
  )

  if (!region) {
    throw new Error(`No region found for country: ${countryCode}`)
  }

  return region.id
}
