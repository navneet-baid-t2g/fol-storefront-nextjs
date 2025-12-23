import { RiCheckboxCircleFill } from "@remixicon/react";

export default function ThankYouPage() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <RiCheckboxCircleFill className="text-[#0133CC] w-20 h-20" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Thank You!
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-8">
          Your submission has been received. One of our team members will get in
          touch with you shortly.
        </p>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <p className="text-[#0133CC] leading-relaxed">
            If you do not hear from us within 1 business day, kindly send an
            email to{" "}
            <a
              href="mailto:Info@FiberOpticsLabs.com"
              className="text-[#E40A05] font-medium underline"
            >
              Info@FiberOpticsLabs.com
            </a>{" "}
            — we’ll take care of you at the earliest.
          </p>
        </div>
      </div>
    </section>
  );
}
