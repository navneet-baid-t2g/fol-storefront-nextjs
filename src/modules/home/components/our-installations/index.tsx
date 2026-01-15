export default function OurInstallations() {
  return (
    <section className="px-3 xl:px-0">
      <div className="mx-auto w-full max-w-8xl  lg:px-8">
        <div className="section-header mb-8">
          <h2 className="bordered">Our Installations</h2>
        </div>
        <div className="map-wrapper">
          <img src="images/contact-us-world-wide-locations.webp" alt="World Map" className="world-map" />

          <span className="marker us">UNITED STATES</span>
          <span className="marker mexico">MEXICO</span>
          <span className="marker brazil">BRAZIL</span>

          <span className="marker england">ENGLAND</span>
          <span className="marker france">FRANCE</span>
          <span className="marker spain">SPAIN</span>

          <span className="marker saudi">SAUDI ARABIA</span>
          <span className="marker uae">UAE</span>
          <span className="marker india">INDIA</span>

          <span className="marker south-africa">SOUTH AFRICA</span>
        </div>
      </div>
    </section>
  )
}
