"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { StoreProductVideosProps } from "types/storeProductVideos"

export default function YoutubeVideos({
  videos = [],
  showHeading = true,
}: StoreProductVideosProps) {
  if (!videos.length) return null

  return (
    <section className="py-4">
      <div className="max-w-7xl mx-auto">

        {/* ✅ KEEP HEADING SAME */}
        {showHeading && (
          <div className="section-header mb-6">
            <h4 className="bordered">
              Explore Our Videos on Youtube
            </h4>
          </div>
        )}

        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={3}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2.5 },
            1280: { slidesPerView: 3 },
          }}
        >
          {videos.map((src: string, index: number) => (
            <SwiperSlide key={index}>
              {/* ✅ Styled Like AllProductVideosPage Cards */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border">
                <div className="aspect-video w-full">
                  <iframe
                    src={src}
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
