"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

type CarouselProps = {
  productImage?: string;
  categoryImages?: string[];
  altProduct?: string;
  altCategory?: string;
};

export default function ProductCategoryCarousel({
  productImage,
  categoryImages = [],
  altProduct = "Product Image",
  altCategory = "Category Image",
}: CarouselProps) {
  const slides = [];

  if (productImage) slides.push({ src: productImage, alt: altProduct });
  slides.push(...categoryImages.map((src) => ({ src, alt: altCategory })));

  if (slides.length === 0) {
    return (
      <div className="w-64 h-64 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg">
        <span className="text-gray-500 text-lg text-center px-4">
          No Image Available
        </span>
      </div>
    );
  }

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000 }}
      loop={slides.length > 1}
      spaceBetween={10}
      slidesPerView={1}
      className="max-w-md w-full mx-auto"
    >
      {slides.map((slide, idx) => (
        <SwiperSlide key={idx}>
          <div className="flex justify-center">
            <Image
              src={slide.src}
              alt={slide.alt}
              width={400}
              height={400}
              className="w-full max-w-md h-auto object-contain rounded-lg shadow-lg bg-gray-50 p-4"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}