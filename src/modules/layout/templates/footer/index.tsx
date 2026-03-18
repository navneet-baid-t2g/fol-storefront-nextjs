import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { RiFacebookLine, RiInstagramLine, RiLinkedinLine, RiMailLine, RiMapPinLine, RiPhoneLine, RiTwitterXLine, RiYoutubeLine } from "@remixicon/react";


export default async function Footer() {
  const shopItems = [
  "Zone Product",
  "Medium Range Point Locating",
  "Long Range Point Locating",
  "Long Range Classification System",
  "Single Mode Cable",
  "Multimode Cable",
  "Enclosures",
]
const res = await fetch(
  `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/collections`,
  {
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
    },
    next: { revalidate: 60 },
  }
)

const { collections } = await res.json()
  return (
    <>
      <footer className="footer px-3 xl:px-0">
        <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8 mb-16 mx-auto flex flex-col md:flex-row justify-between">
          {/*<div>
            <LocalizedClientLink href="/">
              <img src="/images/logo.png" alt="Fiber Optics Labs" className="footer-logo" />
            </LocalizedClientLink>
          </div>*/}
          <div className="social-links mt-8 md:mt-0">
            <a href="https://www.facebook.com/share/18Q7w43cYZ/?mibextid=wwXIfr" className="social-link"><RiFacebookLine /></a>
            <a href="https://x.com/FiberLabs48831" className="social-link"><RiTwitterXLine /></a>
            <a href="https://www.linkedin.com/in/aditya-kumar-singh-7b8299233?utm_source=share_via&utm_content=profile&utm_medium=member_ios" className="social-link"><RiLinkedinLine /></a>
            <a href="https://www.instagram.com/fiberopticslabs?igsh=eGM1bnBjdGV5ZmQw" className="social-link"><RiInstagramLine /></a>
            <a href="https://www.youtube.com/@FiberOpticsLabs" className="social-link"><RiYoutubeLine /></a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8 footer-container">
          <div className="footer-col">
            <h3 className="footer-title">Get In Touch</h3>

            <div className="footer-item">
              <span className="icon"><RiMapPinLine /></span>
              <h4>Address</h4>
            </div>
            <p className="footer-text">
              B-704, 7th Floor Tower-B, Cyber Park 62, Plot No C-28, 29,<br />
              Sector 62, Noida, UP 201309, India
            </p>

            <div className="footer-item">
              <span className="icon"><RiMailLine /></span>
              <h4>Mail Us</h4>
            </div>
            <p className="footer-text">
              <a href="mailto:Info@FiberOpticsLabs.com">Info@FiberOpticsLabs.com</a>
            </p>

            <div className="footer-item">
              <span className="icon"><RiPhoneLine /></span>
              <h4>Phone No.</h4>
            </div>
            <p className="footer-text"><a href="tel:+91 82876 07598">+91 82876 07598</a></p>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Information</h3>
            <ul className="footer-links">
              <li><a href="/about-us">About Fiber Optics Labs</a></li>
              <li><a href="/why-choose-us">Fiber Optics Labs Difference</a></li>
              <li><a href="/testimonials">Testimonials</a></li>
              <li><a href="/events">Event Calendar</a></li>
              <li><a href="/events">Independent Sales Program</a></li>
              <li><a href="/datasheet">Datasheets</a></li>
              <li><a href="/product-videos">Product Videos</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Customer Services</h3>
            <ul className="footer-links">
              <li><a href="/warranty-support">Warranty Terms</a></li>
              <li><a href="/rma">RMA</a></li>
              <li><a href="/become-a-sales-partner">Dealer Application</a></li>
              <li><a href="/blogs">Blog</a></li>
              <li><a href="/faqs">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-title">Shop</h3>
            <ul className="footer-links">
              {await Promise.all(
                shopItems.map(async (item) => {
                  const matchedCollection = collections?.find(
                    (col: any) => col.title.toLowerCase() === item.toLowerCase()
                  )

                  if (!matchedCollection) {
                    return (
                      <li key={item}>
                        <span>{item}</span>
                      </li>
                    )
                  }

                  // ✅ Fetch products of this collection
                  const prodRes = await fetch(
                    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?collection_id=${matchedCollection.id}`,
                    {
                      headers: {
                        "x-publishable-api-key":
                          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
                      },
                      next: { revalidate: 60 },
                    }
                  )

                  const { products } = await prodRes.json()

                  // ✅ If only 1 product → go to product page
                  if (products?.length === 1) {
                    return (
                      <li key={item}>
                        <LocalizedClientLink href={`/products/${products[0].handle}`}>
                          {item}
                        </LocalizedClientLink>
                      </li>
                    )
                  }

                  // ✅ Else → go to collection page
                  return (
                    <li key={item}>
                      <LocalizedClientLink href={`/collections/${matchedCollection.handle}`}>
                        {item}
                      </LocalizedClientLink>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </div>
      </footer>
      <div className="bottom-footer px-3 xl:px-0">
        <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8    text-center md:text-left md:flex justify-between items-center">
          <p>© Fiber Optics Labs {new Date().getFullYear()}. All rights reserved.</p>
          <img src="/images/payments.png" alt="Payments Methods Accepted" className="mx-auto md:mx-0" />
        </div>
      </div>
    </>
  );
}
