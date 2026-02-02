"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroBanner() {
  const slides = [
    "/images/banner-1.png",
    "/images/banner-2.png",
    "/images/banner-3.jpg",
    "/images/banner-4.jpg",
    "/images/banner-5.jpg",
    "/images/banner-6.jpg",
    "/images/banner-7.jpg",
    "/images/banner-8.jpg",
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
