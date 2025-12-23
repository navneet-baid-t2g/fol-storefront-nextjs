import { Metadata } from "next"
import Link from "next/link";
import { RiErrorWarningFill } from "@remixicon/react";

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-xl">
        <RiErrorWarningFill className="mx-auto text-red-500" size={90} />

        <h1 className="mt-6 text-5xl font-bold text-gray-800 tracking-tight">
          404
        </h1>

        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          The page you’re looking for wandered off the path.
          It happens — even pixels get curious sometimes.
        </p>

        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-900 transition"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}
