import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    throw new Error("MEDUSA_BACKEND_URL is not set")
  }

  if (
    !regionMap.size ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    const res = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      cache: "force-cache",
      next: {
        revalidate: 3600,
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch regions")
    }

    const { regions } = await res.json()

    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        if (c.iso_2) {
          regionMap.set(c.iso_2, region)
        }
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMap
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion>
) {
  const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

  if (urlCountryCode && regionMap.has(urlCountryCode)) {
    return urlCountryCode
  }

  if (regionMap.has(DEFAULT_REGION)) {
    return DEFAULT_REGION
  }

  return regionMap.keys().next().value
}

export async function middleware(request: NextRequest) {
  // ✅ Always allow static assets
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  const cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const regionMap = await getRegionMap(cacheId)
  const countryCode = await getCountryCode(request, regionMap)

  if (!countryCode) {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname
  const hasCountryCode = pathname.split("/")[1] === countryCode

  // ✅ Already correct → just continue
  if (hasCountryCode) {
    const res = NextResponse.next()
    if (!cacheIdCookie) {
      res.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
    }
    return res
  }

  // ✅ Only now we create redirect response
  const redirectUrl = new URL(
    `/${countryCode}${pathname === "/" ? "" : pathname}${request.nextUrl.search}`,
    request.nextUrl.origin
  )

  const res = NextResponse.redirect(redirectUrl, 307)
  res.cookies.set("_medusa_cache_id", cacheId, {
    maxAge: 60 * 60 * 24,
  })

  return res
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
