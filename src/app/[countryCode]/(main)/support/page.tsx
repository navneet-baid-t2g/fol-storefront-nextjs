"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Support } from "types/support";

export default function SupportPage() {
  const [supports, setSupports] = useState<Support[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSupport() {
      try {
        const res = await fetch(
  `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/support-pages?populate=*`
);


        if (!res.ok) throw new Error("Failed to fetch support content");

        const data = await res.json();

        const formatted = data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
        }));

        setSupports(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSupport();
  }, []);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading Support...</p>;

  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
  <main>
    {/* Hero */}
    <div className="static-banner">
    <div className="static-banner-overlay"></div>
    <div className="static-banner-content">
      <h1>{supports[0].title}</h1>

    </div>
  </div>


    {/* Support Sections */}
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      {supports.map((support, index) => (
        <div
          key={support.id}
          className="border rounded-xl p-6 shadow-sm bg-white"
        >
          {/* Only show title again if you have multiple sections */}
          {supports.length > 1 && (
            <h2 className="text-2xl font-semibold mb-4">
              {support.title}
            </h2>
          )}

          <div className="text-gray-700 prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {support.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  </main>
);

}
