"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaChevronDown } from "react-icons/fa";
import { FAQ } from "types/faq";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/faqs?populate=*`
        );
        if (!res.ok) throw new Error("Failed to fetch FAQs");
        const data = await res.json();
        const formatted = data.data.map((item: any) => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
          slug: item.slug,
          title: item.title,
        }));
        setFaqs(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFAQs();
  }, []);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading FAQs...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <main>
      <div className="static-banner">
      <div className="static-banner-overlay"></div>
      <div className="static-banner-content">
        <h1>{faqs[0].title}</h1>

      </div>
    </div>


      <div className="max-w-4xl mx-auto px-6 py-12 space-y-5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.id}
              className="border rounded-xl shadow-md bg-white overflow-hidden transition-all duration-300"
            >
              {/* Question */}
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <FaChevronDown
                  className={`ml-2 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  } text-gray-600`}
                />
              </button>

              {/* Answer */}
              {isOpen && (
                <div className="px-6 pb-6 text-gray-700 space-y-3">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {faq.answer}
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
