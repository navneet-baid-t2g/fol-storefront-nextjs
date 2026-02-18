"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Warranty } from "types/warranty";

export default function WarrantySupportPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWarranty() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/warranty-supports?populate=*`
        );

        if (!res.ok) throw new Error("Failed to fetch warranty content");

        const data = await res.json();

        const formatted = data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
        }));

        setWarranties(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWarranty();
  }, []);

  if (loading)
    return <p className="p-6 text-center text-gray-500"></p>;

  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <main>
      {/* Hero */}
      <div className="static-banner">
      <div className="static-banner-overlay"></div>
      <div className="static-banner-content">
        <h1>{warranties[0]?.title}</h1>

      </div>
    </div>

      {/* Warranty Sections */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {warranties.map((warranty) => (
          <div
            key={warranty.id}
            className="border rounded-xl p-6 shadow-sm bg-white"
          >
            <div className="text-gray-700 prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {warranty.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
