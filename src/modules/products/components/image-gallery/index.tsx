"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  // Keyboard ESC support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight" && lightboxIndex !== null)
        setLightboxIndex((prev) => (prev! + 1) % images.length)
      if (e.key === "ArrowLeft" && lightboxIndex !== null)
        setLightboxIndex((prev) =>
          prev! === 0 ? images.length - 1 : prev! - 1
        )
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [lightboxIndex])

  return (
    <div className="relative w-full px-10">

      {/* MOBILE & TABLET — SWIPER SLIDER */}
      <div className="block large:hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          navigation
          pagination={{ clickable: true }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id}>
              <Container
                onClick={() => openLightbox(index)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-ui-bg-subtle cursor-pointer"
              >
                {image.url && (
                  <Image
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-contain rounded-rounded"
                  />
                )}
              </Container>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* DESKTOP — 2×2 GRID */}
      <div className="hidden large:grid large:grid-cols-2 large:gap-4 w-full">
        {images.slice(0, 4).map((image, index) => (
          <Container
            key={image.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-square overflow-hidden bg-ui-bg-subtle cursor-pointer"
          >
            {image.url && (
              <Image
                src={image.url}
                fill
                alt={`Product image ${index + 1}`}
                className="object-contain rounded-rounded"
              />
            )}
          </Container>
        ))}
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
            <Image
              src={images[lightboxIndex].url}
              alt="Lightbox Image"
              fill
              className="object-contain"
            />

            {/* NEXT */}
            <button
              onClick={() =>
                setLightboxIndex((prev) => (prev! + 1) % images.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-4xl"
            >
              ❯
            </button>

            {/* PREV */}
            <button
              onClick={() =>
                setLightboxIndex((prev) =>
                  prev! === 0 ? images.length - 1 : prev! - 1
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
    </div>
  )
}

export default ImageGallery
