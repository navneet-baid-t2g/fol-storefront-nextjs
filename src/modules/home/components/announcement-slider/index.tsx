"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"

type AnnouncementSliderProps = {
  images: string[]
}

export default function AnnouncementSlider({ images }: AnnouncementSliderProps) {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        loop={true}
        className="rounded-2xl overflow-hidden "
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={`Announcement ${index + 1}`}
              className="w-full  object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}