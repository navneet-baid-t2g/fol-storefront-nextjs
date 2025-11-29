"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function YoutubeVideos() {
  const videos = [
    "https://www.youtube.com/embed/tgbNymZ7vqY",
    "https://www.youtube.com/embed/tgbNymZ7vqY",
    "https://www.youtube.com/embed/tgbNymZ7vqY",
    "https://www.youtube.com/embed/tgbNymZ7vqY",
  ];

  return (
    <section className="px-3 xl:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="section-header mb-8">
          <h2 className="bordered">Explore Our Videos on Youtube</h2>
        </div>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={3}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2.8 },
            1280: { slidesPerView: 3 },
          }}
          className="youtube-swiper"
        >
          {videos.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="video-wrapper">
                <iframe
                  src={src}
                  allowFullScreen
                  className="video-iframe"
                ></iframe>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
