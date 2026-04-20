

import { Metadata } from "next"
import WhyChooseUs from "@modules/home/components/why-choose-us";
import YoutubeVideos from "@modules/home/components/youtube-videos";
import "./homepage.css"
import ExploreMarkets from "@modules/home/components/explore-markets";
import HeroBanner from "@modules/home/components/hero-banner";
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import LatestProducts from "@modules/home/components/latest-products";
import InstalledSites from "@modules/home/components/installed-sites";
import OurInstallations from "@modules/home/components/our-installations";
import AnnouncementSlider from "@modules/home/components/announcement-slider";


export const metadata: Metadata = {
  title: "Fiber Optics Labs",
  description:
    "Site Developed by Tech2globe",
}

export default async function Home({
  params,
}: {
  params: { countryCode: string }
}) {
  
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

      <section className="px-3 xl:px-0 py-10">
      <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8">
        
        <div className="section-header">
            <h2 className="bordered">Announcement</h2>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          
          {/* Left Slider */}
          <AnnouncementSlider
            images={[
              "/images/ISC-West.webp",
              "/images/Award-2.webp",
              "/images/Award-3.webp",
            ]}
          />

          {/* Right Content */}
          <div className="text-gray-700 leading-relaxed">
            <p className="mb-4">
              FiberRanger has been recognized at the <strong>2026 ISC West Security Conference</strong> in Las Vegas, USA, for the 
              <strong> New Products and Solutions (NPS) Award</strong> in the category 
              <strong> "Intrusion Detection and Prevention Solutions (Physical) — Wired or Wireless"</strong> 
              for their <strong>FR300 System</strong>.
            </p>

            <p className="font-semibold mb-2">Key details regarding this award:</p>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Award Winning Technology:</strong> The FR301-Redundant system (part of the FR300 series) protects up to 
                100 km of perimeter (50 km per sensor) with an accuracy of +/- 5m.
              </li>

              <li>
                <strong>Significance:</strong> The system features a 100% intelligent redundant controller that eliminates 
                single points of failure by automatically switching to a backup system.
              </li>

              <li>
                <strong>Application:</strong> FiberRanger products are used for high-security fencing, buried perimeters, 
                pipeline protection, and data network security using AI and pattern recognition.
              </li>

              <li>
                <strong>Showcase:</strong> The award was announced at the ISC West 2026 conference.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>

      <section className="px-3 xl:px-0">
        <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <h2 className="bordered">Innovating Security</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10">
            <div className="bg-gray p-8 rounded-xl shadow-sm">
              <p>
                FIBER OPTICS LABS offers the most advanced products for smart fence and buried perimeter security, pipeline TPI, train monitoring, and data network cable security based on the probability of detection/classification and nuisance alarm rate, even in a severe weather. FIBER OPTICS LABS sensors use a highly sensitive technology based on artificial intelligence and pattern recognition to detect and classify every footstep signal from humans or large animals, manual digging, machine digging, pipeline leaks, underground tunneling, fence climbs and cuts, wall top climbs, trains, and vehicles, while rejecting nearby nuisance sources such as traffic and weather elements. The products are easy to operate and maintain, and based on fiber optic sensors.
              </p>
              <p>
                For installations requiring maximum security, pinpoint location accuracy of a few meters, cut immunity, and long range, one can use our DAS products: FR201, FR301, or FR302 models. These products can protect a perimeter from a few meters to up to 100 km per controller and location detection accuracy of a few meters for an intrusion. These can also be installed in 100% intelligent redundant configuration for the complete hardware redundancy and the ease of maintenance and tuning, which we have pioneered for the first time and the only company to offer this technology. The redundant system uses automatic data synchronization technology, hot swappable architecture, automatic health check, automatic turn on and off of the secondary, and is the world's first true 100% redundant system. In addition, the entire redundant system occupies only 2U rack space, making it easy to install, maintain, and operate.
              </p>
              <p>
                For smaller sites less than 4 km and needing location accuracy within the zone, FIBER OPTICS LABS offers models FOL-101 and FOL-101i for fence and buried perimeter intrusion detection systems (PIDS) with up to 8 zones per controller. For more zones, multiple controllers can be installed.  These are easy to install, maintain, operate and has a high probability of detection and low nuisance alarms, while cost effective.
              </p>
              <p>
                Applications include fence perimeter security, buried perimeter security, VIP residences, oil and gas pipeline security and pipeline leak detection, wall-top perimeter security, and data cable network physical security. Some of the market segments are perimeter security for electric utilities, correctional facilities, chemical plants, nuclear power plants, high-valued infrastructures, airports, oil and gas pipelines, data centers, and physical security of data network links.
              </p>
              <p>
                FIBER OPTICS LABS is based at Noida, UP, India, and has partnered with FiberRanger, a US based company.
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
