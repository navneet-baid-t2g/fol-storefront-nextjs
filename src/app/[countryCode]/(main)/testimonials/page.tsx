"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Testimonial } from "types/testimonial";

export default function TestimonialPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = (
    process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL || "http://localhost:1337/api"
  ).replace("/api", "");

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/testimonials?populate=*`
        );

        if (!res.ok) throw new Error("Failed to fetch testimonials");

        const data = await res.json();

        const formatted = data.data.map((item: any) => {
          const t = item.attributes || item; // fallback if no attributes

          // Unified image fetching logic (like blogs)
          let imageUrl: string | null = null;
          if (Array.isArray(t.photo?.data) && t.photo.data.length > 0) {
            imageUrl = t.photo.data[0]?.attributes?.url || t.photo.data[0]?.url || null;
          } else if (t.photo?.data?.attributes?.url) {
            imageUrl = t.photo.data.attributes.url;
          } else if (t.photo?.url) {
            imageUrl = t.photo.url;
          }

          const fullImageUrl = imageUrl ? `${baseUrl}${imageUrl}` : null;

          return {
            id: item.id,
            name: t.name,
            designation: t.designation,
            company: t.company,
            message: t.message,
            photo: fullImageUrl,
            rating: t.rating,
          };
        });

        setTestimonials(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, [baseUrl]);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading Testimonials...</p>;

  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <main>
      {/* Hero Section */}
      <div className="static-banner">
        <div className="static-banner-overlay"></div>
        <div className="static-banner-content">
          <h1>Testimonials</h1>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="border rounded-xl p-6 shadow-sm bg-white flex flex-col md:flex-row items-center gap-6"
          >
            {t.photo && (
              <img
                src={t.photo}
                alt={t.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}

            <div className="flex-1">
              <h3 className="text-xl font-semibold">{t.name}</h3>
              {t.designation && (
                <p className="text-gray-500 text-sm">
                  {t.designation} {t.company && `at ${t.company}`}
                </p>
              )}
              <div className="mt-2 text-gray-700 prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {t.message}
                </ReactMarkdown>
              </div>
              {t.rating && (
                <p className="mt-2 text-yellow-500">
                  {"★".repeat(t.rating)}{" "}
                  {"☆".repeat(5 - t.rating)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}