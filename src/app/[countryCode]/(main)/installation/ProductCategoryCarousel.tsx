"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";

type Props = {
  categoryImages?: string[];
  altCategory?: string;
};

export default function ProductCategoryCarousel({
  categoryImages = [],
  altCategory = "Category Image",
}: Props) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    if (!swiperRef.current) return;
    playing
      ? swiperRef.current.autoplay.stop()
      : swiperRef.current.autoplay.start();
    setPlaying(!playing);
  };

  // No images
  if (categoryImages.length === 0) {
    return (
      <div className="w-[420px] h-[320px] bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-gray-400">No Category Image</span>
      </div>
    );
  }

  // Single image (no dots)
  if (categoryImages.length === 1) {
    return (
      <div className="w-[420px] bg-gray-50 rounded-xl shadow-md">
        <Image
          src={categoryImages[0]}
          alt={altCategory}
          width={420}
          height={320}
          className="block w-full max-h-[320px] object-contain"
        />
      </div>
    );
  }

  // Multiple images → carousel
  return (
    <div className="w-[420px]" onClick={togglePlay}>
      <Swiper
        modules={[Pagination, Autoplay]}
        onSwiper={(s) => (swiperRef.current = s)}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="pb-4" // minimal space ONLY for dots
      >
        {categoryImages.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="bg-gray-50 rounded-xl shadow-md">
              <Image
                src={src}
                alt={altCategory}
                width={420}
                height={320}
                className="block w-full max-h-[320px] object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
