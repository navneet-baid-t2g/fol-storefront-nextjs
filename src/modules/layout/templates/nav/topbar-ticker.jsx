"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function TobBar() {
  const messages = [
    "FR302 range is 100 km, 50 km per sensor, and 2 sensors per controller",
    "FR302 range is 100 km, 50 km per sensor, and 2 sensors per controller",
    "FR302 range is 100 km, 50 km per sensor, and 2 sensors per controller",
  ];

  return (
    <div className="topbar overflow-hidden bg-gray-100 py-2">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="w-full"
      >
        {messages.map((msg, i) => (
          <SwiperSlide key={i}>
            <div className="text-center text-sm px-4">
              {msg}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
