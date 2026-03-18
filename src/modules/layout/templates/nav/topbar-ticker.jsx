"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function TobBar() {
  const messages = [
    "Protect the fence or buried perimeters of your VIP house or small site (< 4km) using FOL-101 models at a cost-effective price",
    "Our DAS products locate an intrusion within a few meters, offer cut immunity, and protects fence or buried perimeters up to 80 km",
    "Protect your oil and gas pipeline from TPI with FR302 model with complete classifications based on AI for up to 100 km",
    "For your high security sites, use our 100% intelligent redundant systems so that the protection never goes down",
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
