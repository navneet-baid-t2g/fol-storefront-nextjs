"use client";

import { useRef, useState, useEffect } from "react";
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // ✅ FIX IMAGE URLS
  const images: string[] = (categoryImages ?? []).map((img) =>
  img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}${img}`
);
console.log("carousel images", images);
  const togglePlay = () => {
    if (!swiperRef.current) return;
    playing
      ? swiperRef.current.autoplay.stop()
      : swiperRef.current.autoplay.start();
    setPlaying(!playing);
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  // Keyboard support (ESC + arrows)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight")
        setLightboxIndex((lightboxIndex + 1) % images.length);
      if (e.key === "ArrowLeft")
        setLightboxIndex(
          lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1
        );
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, images.length]);

  // No images
  if (images.length === 0) {
    return (
      <div className="w-[420px] h-[320px] bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-gray-400">No Category Image</span>
      </div>
    );
  }

  // Single image
  if (images.length === 1) {
    return (
      <>
        <div
          className="w-[420px] bg-gray-50 rounded-xl shadow-md cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0]!}
            alt={altCategory}
            width={420}
            height={320}
            className="block w-full max-h-[320px] object-contain"
          />
        </div>

        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade"
            onClick={closeLightbox}
          >
            <div
              className="relative w-[90%] max-w-4xl h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[lightboxIndex!]}
                alt={altCategory}
                className="w-full h-full object-contain"
              />

              {/* CLOSE */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white text-4xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Multiple images → carousel
  return (
    <>
      <div className="w-[420px]">
        <Swiper
          modules={[Pagination, Autoplay]}
          onSwiper={(s) => (swiperRef.current = s)}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="pb-4"
        >
          {images.map((src, i) => (
            <SwiperSlide key={i}>
              <div
                className="bg-gray-50 rounded-xl shadow-md cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(i);
                }}
              >
                <Image
                  src={src!}
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

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade"
          onClick={closeLightbox}
        >
          <div
            className="relative w-[90%] max-w-4xl h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Use raw <img> for zoom to avoid Next.js 404 */}
            <img
              src={images[lightboxIndex!]}
              alt={altCategory}
              className="w-full h-full object-contain"
            />

            {/* NEXT */}
            <button
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % images.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-4xl"
            >
              ❯
            </button>

            {/* PREV */}
            <button
              onClick={() =>
                setLightboxIndex(
                  lightboxIndex === 0
                    ? images.length - 1
                    : lightboxIndex - 1
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-4xl"
            >
              ❮
            </button>

            {/* CLOSE */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-4xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}