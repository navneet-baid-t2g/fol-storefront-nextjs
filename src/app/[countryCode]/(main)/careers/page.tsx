"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaChevronDown } from "react-icons/fa";
import { JobsType } from "types/career";

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/careers?populate=*`
        );
        if (!data.ok) throw new Error("Failed to fetch careers");
        const json = await data.json();
        const formatted = json.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          location: item.location,
          description: item.description,
          responsibilities: item.responsibilities,
          requirements: item.requirements,
          email: item.email,
          pageTitle: item.pageTitle,
        }));
        setJobs(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading Careers...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <main>
      {/* Page Header & Intro */}
      <div className="static-banner">
      <div className="static-banner-overlay"></div>
      <div className="static-banner-content">
        <h1>{jobs[0]?.pageTitle}</h1>

      </div>
    </div>
      <div className="space-y-5 max-w-4xl mx-auto px-6 py-12">
        <p>
          Thank you for your interest in joining our team. We are always looking for the best that fits in our culture.
          Please send us your resume if you are passionate about fiber-optic perimeter security, whether in technology or sales.
        </p>
        <p>
          Currently, we are looking to fill the following positions:
        </p>
        {jobs.map((job, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={job.id} className="border rounded-xl shadow-md bg-white overflow-hidden transition-all duration-300">
              {/* Job Title */}
              <button
                className="flex justify-between items-center w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <span className="font-semibold text-lg">{job.title}</span>
                <FaChevronDown
                  className={`ml-2 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"} text-gray-600`}
                />
              </button>

              {/* Job Details */}
              {isOpen && (
                <div className="px-6 pb-6 space-y-4 text-gray-700">
                  {job.location && <p className="font-medium">Location: {job.location}</p>}
                  
                  <div>
                    <h6 className="font-semibold mb-1">Description</h6>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{job.description}</ReactMarkdown>
                  </div>

                  <div>
                    <h6 className="font-semibold mb-1">What You Will Do</h6>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{job.responsibilities}</ReactMarkdown>
                  </div>

                  <div>
                    <h6 className="font-semibold mb-1">Requirements</h6>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{job.requirements}</ReactMarkdown>
                  </div>

                  <p className="font-medium">
                    Send your resume at: <a href={`mailto:${job.email}`} className="text-blue-600 underline">{job.email}</a>
                  </p>
                  
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
