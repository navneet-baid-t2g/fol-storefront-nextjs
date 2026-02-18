"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaChevronDown } from "react-icons/fa";
import { WhyChooseUs } from "types/whyChooseUs";

export default function WhyChooseUsPage() {
  const [items, setItems] = useState<WhyChooseUs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/why-choose-uss?populate=*`
        );

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();

        const formatted = data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          statement: item.statement,
        }));

        setItems(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading...</p>;

  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <main>
      {/* Hero */}
      <div className="static-banner">
      <div className="static-banner-overlay"></div>
      <div className="static-banner-content">
        <h1>{items[0]?.title}</h1>

      </div>
    </div>

      {/* Accordion Section */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-5">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={item.id}
              className="border rounded-xl shadow-md bg-white overflow-hidden transition-all duration-300"
            >
              {/* Title */}
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <span className="font-semibold text-lg">
                  {item.statement}
                </span>

                <FaChevronDown
                  className={`ml-2 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  } text-gray-600`}
                />
              </button>

              {/* Content */}
              {isOpen && (
                <div className="px-6 pb-6 text-gray-700 prose prose-lg max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {item.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
