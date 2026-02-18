"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import {BANNER_SLIDES} from "constant";
import "swiper/css";
import "swiper/css/pagination";

export default function HeroBanner() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const slides = BANNER_SLIDES;  

  const handleToggleAutoplay = () => {
    if (!swiper || !swiper.autoplay) return;

    if (isPaused) {
      swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }

    setIsPaused(!isPaused);
  };

  return (
    <section className="hero-banner">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        slidesPerView={1}
        spaceBetween={0}
        onSwiper={setSwiper}
        className="hero-swiper"
        onClick={handleToggleAutoplay}
      >
        {slides.map((src, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={src}
              alt={`Slide-${idx}`}
              className="hero-image"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
