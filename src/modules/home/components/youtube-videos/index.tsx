"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import {HOMEPAGE_VIDEOS} from "constant"

export default function YoutubeVideos() {
  return (
    <section className="px-3 xl:px-0">
      <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="section-header mb-8">
          <h2 className="bordered">Explore Our Videos on Youtube</h2>
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={3}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2.8 },
            1280: { slidesPerView: 3 },
          }}
          className="youtube-swiper"
        >
          {HOMEPAGE_VIDEOS.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="video-wrapper">
                <iframe
                  src={src}
                  allowFullScreen
                  className="video-iframe"
                ></iframe>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
