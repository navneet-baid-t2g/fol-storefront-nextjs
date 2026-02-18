"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Event } from "types/events";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/events?populate=*`
        );
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        const formatted = data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          date: item.date,
          location: item.location,
          description: item.description,
        }));
        setEvents(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading Events...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <main>
      <div className="static-banner">
      <div className="static-banner-overlay"></div>
      <div className="static-banner-content">
        <h1>Upcoming Events</h1>

      </div>
    </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        {events.map(event => (
          <div
            key={event.id}
            className="flex gap-4 border rounded-xl p-4 shadow-sm bg-white"
          >
            {/* Custom bullet */}
            <span className="flex-shrink-0 w-3 h-3 mt-2 bg-gray-600 rounded-full"></span>

            {/* Event Content */}
            <div>
              <h2 className="font-semibold text-xl mb-1">{event.title}</h2>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Date:</span>{" "}
                {new Date(event.date).toLocaleDateString()}
                {event.location && (
                  <> | <span className="font-medium">Location:</span> {event.location}</>
                )}
              </p>
              <div className="text-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {event.description}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
