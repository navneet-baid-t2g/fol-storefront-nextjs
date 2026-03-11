"use client";

import { useState, useEffect } from "react";

type Props = {
  src?: string | null;
  alt: string;
};

export default function ProductImageWithZoom({ src, alt }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);

  // Keyboard ESC support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!src) {
    return (
      <div className="w-[420px] h-[320px] bg-gray-50 rounded-xl shadow-md flex items-center justify-center text-gray-400">
        No Product Image
      </div>
    );
  }

  return (
    <>
      <div className="w-[420px] bg-gray-50 rounded-xl shadow-md cursor-pointer" onClick={openLightbox}>
        <img
          src={src}
          alt={alt}
          className="block w-full max-h-[320px] object-contain"
        />
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade"
          onClick={closeLightbox}
        >
          <div
            className="relative w-[90%] max-w-4xl h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
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