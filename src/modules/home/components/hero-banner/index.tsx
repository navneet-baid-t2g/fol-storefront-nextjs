"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroBanner() {
  const slides = [
    "/images/banner-1.png",
    "/images/banner-2.png",
    "/images/banner-3.jpeg",
    "/images/banner-4.jpeg",
    "/images/banner-5.jpeg",
    "/images/banner-6.jpeg",
    "/images/banner-7.jpeg",
    "/images/banner-8.jpeg",
  ];

  return (
    <section className="hero-banner">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500 }}
        loop={true}
        spaceBetween={0}
        slidesPerView={1}
        className="hero-swiper"
      >
        {slides.map((src, idx) => (
          <SwiperSlide key={idx}>
            <img src={src} alt={`Slide-${idx}`} className="hero-image" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
