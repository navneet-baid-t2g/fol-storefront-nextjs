"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


export default function ExploreMarkets() {
  const markets = [
    {
      title: "Airport Perimeter Security",
      img: "/images/AirportPerimeter.webp",
    },
    {
      title: "Chemical Plant Perimeter Security",
      img: "/images/ChemicalPlant.webp",
    },
    {
      title: "Correctional Facility Perimeter Security",
      img: "/images/CorrectionalFacility.webp",
    },
    {
      title: "Data Center Physical Security",
      img: "/images/DataCenters.webp",
    },
    {
      title: "Data Network Physical security",
      img: "/images/DataNetwork.webp",
    },
    {
      title: "Electric Utility Perimeter Security",
      img: "/images/ElectricUtility.webp",
    },
    {
      title: "Nuclear Power Plant Perimeter Security",
      img: "/images/NuclearPowerPlant.webp",
    },
    {
      title: "Oil Depot Perimeter Security",
      img: "/images/OilDepot.webp",
    },
    {
      title: "Pipeline Security and TPI Monitoring",
      img: "/images/Pipelines.webp",
    },
  ];

  return (
    <section className="markets-section px-3 xl:px-0">
      <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="section-header mb-10">
          <h2 className="bordered text-white">Explore Our Markets</h2>
        </div>

        <Swiper
          spaceBetween={30}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          breakpoints={{
            320: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 2.8 },
            1280: { slidesPerView: 4 },
          }}
        >
          {markets.map((m, i) => (
            <SwiperSlide key={i}>
              <div className="market-card">
                <div className="market-img">
                  <img src={m.img} alt={m.title} />
                </div>

                <div className="market-content">
                  <span className="h-line"></span>
                  <h4>{m.title}</h4>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
