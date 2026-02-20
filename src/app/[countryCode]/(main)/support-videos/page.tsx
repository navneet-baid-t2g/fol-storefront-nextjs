"use client";

import React, { useEffect, useState } from "react";
import { SupportVideoData } from "types/supportVideo";

export default function SupportVideosPage() {
  const [supportData, setSupportData] = useState<SupportVideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = (
    process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL || "http://localhost:1337/api"
  ).replace("/api", "");

  useEffect(() => {
    async function fetchSupportVideos() {
      try {
        // Fetching with populate=* to ensure media fields are included
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/support-videos?populate=*`
        );

        if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
        const { data } = await res.json();

        console.log("Strapi support-videos response:", data);

        if (!data || data.length === 0) {
          setLoading(false);
          return;
        }

        const formatted = data.map((item: any) => {
          const t = item.attributes || item;

          // Find a candidate media key that may contain media in various shapes
          const mediaKey = Object.keys(t).find((key) => {
            const v = t[key];
            return (
              Array.isArray(v?.data) ||
              (v?.data && typeof v.data === "object" && !Array.isArray(v.data)) ||
              Array.isArray(v) ||
              (v && (v.url || v.formats || v.attributes?.url))
            );
          }) || "videos";

          const raw = t[mediaKey];
          let mediaArray: any[] = [];

          if (!raw) {
            mediaArray = [];
          } else if (Array.isArray(raw?.data)) {
            mediaArray = raw.data;
          } else if (raw?.data && !Array.isArray(raw.data)) {
            mediaArray = [raw.data];
          } else if (Array.isArray(raw)) {
            mediaArray = raw;
          } else if (raw?.url || raw?.attributes?.url) {
            mediaArray = [raw];
          }

          const urls = mediaArray.map((m: any) => {
            const md = m.attributes || m;
            const url = md.url || md?.formats?.small?.url || md?.formats?.thumbnail?.url || "";
            if (!url) return "";
            return url.startsWith("http") ? url : `${baseUrl}${url}`;
          }).filter(Boolean);

          return {
            id: item.id,
            title: t.title || "Support Guide",
            videoUrls: urls,
          };
        });

        setSupportData(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSupportVideos();
  }, [baseUrl]);

  // Use the title of the first entry for the Hero Banner
  const heroTitle = supportData.length > 0 ? supportData[0].title : "Support Videos";

  if (loading) return <div className="p-10 text-center">Loading Support Content...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <main>
      {/* Hero Banner using Strapi Title */}
      <div className="static-banner">
        <div className="static-banner-overlay"></div>
        <div className="static-banner-content">
          <h1>{heroTitle}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {supportData.length === 0 ? (
          <p className="text-center text-gray-400">No content found in Strapi.</p>
        ) : (
          <div className="space-y-16">
            {supportData.map((section) => (
              <div key={section.id}>
                {/* Grid for Video Files */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.videoUrls.map((url, index) => (
                    <div key={index} className="group relative rounded-2xl overflow-hidden bg-black shadow-2xl transition-transform hover:scale-[1.02]">
                      <video 
                        controls 
                        playsInline
                        className="w-full aspect-video"
                        src={url}
                      >
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
