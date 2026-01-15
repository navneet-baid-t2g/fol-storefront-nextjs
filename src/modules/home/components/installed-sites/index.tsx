const INSTALLED_SITES = [
  {
    title: "Airports",
    image: "images/Airports.webp",
    alt: "Airports",
  },
  {
    title: "Data Centers",
    image: "images/Data-Centers.webp",
    alt: "Data Centers",
  },
  {
    title: "Sub Stations",
    image: "images/Sub-Stations.webp",
    alt: "Sub Stations",
  },
  {
    title: "Govt Buildings",
    image: "images/Govt-Buildings.webp",
    alt: "Govt Buildings",
  },
  {
    title: "Jails",
    image: "images/Jails.webp",
    alt: "Jails",
  },
  {
    title: "Metros",
    image: "images/Airports.webp",
    alt: "Metros",
  },
  {
    title: "Military",
    image: "images/Military.webp",
    alt: "Military",
  },
  {
    title: "Palaces",
    image: "images/Palaces.webp",
    alt: "Palaces",
  },
  {
    title: "Power Plants",
    image: "images/Power-Plants.webp",
    alt: "Power Plants",
  },
  {
    title: "Solar Farms",
    image: "images/Solar-Farms.webp",
    alt: "Solar Farms",
  },
];

export default function InstalledSites() {
  return (
    <section className="px-3 xl:px-0 installed-sites-section">
      <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="section-header mb-8">
          <h2 className="bordered">Our Installed Sites</h2>
        </div>

        <div className="card-grid">
          {INSTALLED_SITES.map((site) => (
            <div className="card" key={site.title}>
              <img
                src={site.image}
                alt={site.alt}
                className="card-img"
              />
              <h4>{site.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
