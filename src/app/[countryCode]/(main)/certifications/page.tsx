import React from "react"

interface CertificationItem {
  id: string
  title: string
  pdfUrl: string
  imageUrl: string
}

// Static certifications data
const STATIC_CERTIFICATIONS: CertificationItem[] = [
  {
    id: "cert-1",
    title: "ISO/IEC 27001 : 2022",
    pdfUrl: "/pdfs/IS0-27001-Fiber-Optics-Labs.pdf",
    imageUrl: "/images/IS0-27001-Fiber-Optics-Labs_page-0001.jpg"
  },
  {
    id: "cert-2",
    title: "ISO 9001 : 2015",
    pdfUrl: "/pdfs/Fiber-Optics-Labs-QMS.pdf",
    imageUrl: "/images/Fiber-Optics-Labs-QMS_page-0001.jpg"
  }
]

const CertificationsPage: React.FC = () => {
  const certifications = STATIC_CERTIFICATIONS

  return (
    <>
      <div className="static-banner">
        <div className="static-banner-overlay"></div>
        <div className="static-banner-content">
          <h1>Certifications</h1>
        </div>
      </div>

      <div className="flex justify-center py-8">
  <div className="flex gap-12 flex-wrap justify-center">
    {certifications.map((cert) => (
      <div
        key={cert.id}
        className="w-[300px] bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-lg transition duration-300 flex flex-col items-center p-4"
      >
        {/* Image */}
        <div className="w-full flex justify-center items-center mb-3">
          <img
            src={cert.imageUrl}
            alt={cert.title}
            className="w-full h-[420px] object-contain"
          />
        </div>

        {/* Title */}
        <h3 className="text-[18px] font-semibold text-center mb-2">
          {cert.title}
        </h3>

        {/* Button */}
        <a
          href={cert.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 px-5 py-2 bg-indigo-800 text-white text-sm rounded-md hover:bg-indigo-700 transition"
        >
          View PDF
        </a>
      </div>
    ))}
  </div>
</div>
    </>
  )
}

export default CertificationsPage
