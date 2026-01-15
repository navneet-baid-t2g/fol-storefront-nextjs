

import { Metadata } from "next"
import WhyChooseUs from "@modules/home/components/why-choose-us";
import YoutubeVideos from "@modules/home/components/youtube-videos";
import "./homepage.css"
import ExploreMarkets from "@modules/home/components/explore-markets";
import HeroBanner from "@modules/home/components/hero-banner";
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import LatestProducts from "@modules/home/components/latest-products";
import OurInstallations from "@modules/home/components/our-installations";
import InstalledSites from "@modules/home/components/installed-sites";

export const metadata: Metadata = {
  title: "Fiber Optics Labs",
  description:
    "Site Developed by Tech2globe",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })
  console.log("Collections:", collections)
  if (!collections || !region) {
    return null
  }
  return (
    <>
      <HeroBanner />
      <section className="px-3 xl:px-0">
        <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <h2 className="bordered">Innovating Security</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-gray p-8 rounded-xl shadow-sm">
              <p>
                Fiber Optics Labs offers numerous products and components in the field of fiber optic sensing. FOL-101 (up to 8 zones) and FOL-102 (up to 32 zones) models are perimeter intrusion detection systems (PIDS) that protect fence and buried perimeters up to 10 km and supports up to 32 zones. These are easy to install, maintain, operate and has a high probability of detection and low nuisance alarms. Some of the market segments are perimeter security for electric utilities, correctional acilities, VIP residences, chemical plants, nuclear power plants, high-valued infrastructures, airports, oil and gas pipelines, data centers, and physical security of data network links.
              </p>
              <p>
                FIBER OPTICS LABS has also partnered with FiberRanger, a US based company, to offer FR302-Classification model. The FR302 model is the most advanced classification products for perimeter security, pipeline TPI, and data network cable security based on the probability of detection/classification and nuisance alarm rate, even in a severe weather. FiberRanger sensors use a highly sensitive technology based on artificial intelligence and pattern recognition to detect and classify every footstep signal from humans or large animals, manual digging, machine digging, pipeline leaks, underground tunneling, fence climbs and cuts, wall top climbs, trains, and vehicles, while rejecting nearby nuisance sources such as traffic and weather elements.
              </p>
            </div>
            <WhyChooseUs />
          </div>
        </div>
      </section>
      <OurInstallations/>
      <InstalledSites/>
      <YoutubeVideos />
      <LatestProducts />                                                                                              
      <ExploreMarkets />
    </>
  )
}
