import React from "react"

const Resources = () => {
  const productDatasheet = [
    { name: "FOL-101", link: "/images/FOL101_DATA_SHEET.pdf" },
    { name: "FR302-class", link: "/images/FR302_Datasheet.pdf" },
  ]

  return (
    <>
      <div className="product-hero-banner">
        <div className="product-banner-overlay"></div>
        <div className="product-banner-content">
          <h1>Datasheet</h1>
        </div>
      </div>

      <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
        <div className="w-full">
          <div className="w-full flex justify-between items-center border-b py-4">
            <h2 className="text-lg font-semibold">Product Name</h2>
            <h2 className="text-lg font-semibold">Download Datasheet</h2>
          </div>

          {productDatasheet.map((item, index) => (
            <div
              key={index}
              className="w-full flex justify-between items-center border-b py-4"
            >
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <a
                href={item.link}
                download
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Resources
