"use client";

import { useEffect, useState } from "react";

interface AccordionItem {
  id: number;
  title: string;      // statement
  content: string[];  // converted from markdown/string
}

export default function WhyChooseUs() {
  const [items, setItems] = useState<AccordionItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/why-choose-uss`
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        const formatted = data.data.map((item: any) => ({
          id: item.id,
          title: item.statement,
          // Convert content (markdown/string) → array
          content: item.content
  ? item.content
      .split("\n")
      .map((line: string) =>
        line.replace(/^(\s*[-*•]\s*)/, "") // removes -, *, •
      )
      .filter((line: string) => line.trim() !== "")
  : [],
        }));

        setItems(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center p-6">Loading...</p>;
  }

  return (
    <div className="why-choose-us py-4 px-6 rounded-xl shadow-sm">
      <h2 className="text-center text-2xl mb-6">Why Choose Us?</h2>

      {items.map((item, index) => (
        <div key={item.id} className="border-b border-gray-300 py-4">
          
          {/* Header */}
          <button
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
            className="w-full flex items-center justify-between font-semibold text-lg"
          >
            <div className="flex items-center gap-2">
              <span className="bullet"></span>
              {item.title}
            </div>

            <span className="text-xl">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>

          {/* Content */}
          {openIndex === index && (
            <ul className="mt-3 list-disc ml-8 text-gray-700 animate-fadeIn">
              {item.content.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}