"use client";
import { useState } from "react";
import "./style.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BecomeASalesPartner() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    experience: "",
    hearAbout: "",
    message: "",
    terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  const invalidEmailDomains = ["test.com", "invalid.com", "fake.com"];

  const validate = () => {
    let err = {};
    const nameRegex = /^[A-Za-z\s]{1,50}$/;
    const companyRegex = /^[A-Za-z0-9\s.,&()/-]{1,100}$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^(?!.*--)(?:\+?[1-9]\d{0,2})?[-]?(?:\d[-]?){7,15}\d$/;

    // Trimmed values
    const f = { ...form };
    Object.keys(f).forEach((key) => {
      if (typeof f[key] === "string") f[key] = f[key].trim();
    });

    // First Name
    if (!f.firstName) err.firstName = "First Name is required.";
    else if (!nameRegex.test(f.firstName))
      err.firstName = "Only letters allowed and max 50 characters.";

    // Last Name
    if (!f.lastName) err.lastName = "Last Name is required.";
    else if (!nameRegex.test(f.lastName))
      err.lastName = "Only letters allowed and max 50 characters.";

    // Email
    if (!f.email) err.email = "Email address is required.";
    else if (!emailRegex.test(f.email))
      err.email = "Enter a valid email address.";
    else {
      const domain = f.email.split("@")[1];
      if (invalidEmailDomains.includes(domain))
        err.email = "This email domain is not allowed.";
    }

    // Phone
    if (!f.phone) {
      err.phone = "Phone number is required.";
    } else {

      if (!phoneRegex.test(f.phone)) {
        err.phone = "Enter a valid phone number.";
      }
    }


    // Company Name
    if (!f.company) err.company = "Company/Business Name is required.";
    else if (!companyRegex.test(f.company))
      err.company = "Max 100 chars. Letters, numbers & selected symbols allowed.";

    // Dropdowns
    if (!f.experience) err.experience = "Please select your experience.";
    if (!f.hearAbout) err.hearAbout = "Please select an option.";

    // Message
    if (!f.message) err.message = "Message is required.";
    else if (f.message.length < 10)
      err.message = "Message must be at least 10 characters.";
    else if (f.message.length > 1024)
      err.message = "Message cannot exceed 1024 characters.";

    // Terms
    if (!f.terms) err.terms = "You must agree before submitting.";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Get IP Address
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();

      const payload = {
        data: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          emailAddress: form.email.trim(),
          phoneNumber: form.phone.trim(),
          companyName: form.company.trim(),
          salesExperience: form.experience,
          referralSource: form.hearAbout,
          message: form.message.trim(),
          ipAddress: ipData?.ip || "0.0.0.0",
        },
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/sales-partners-enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_KEY}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        console.error(await res.text());
        alert("Something went wrong. Please try again.");
        return;
      }

      // Reset form after success
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        experience: "",
        hearAbout: "",
        message: "",
        terms: false,
      });

      setErrors({});

      setTimeout(() => {
        router.push("/thank-you");
      }, 700);

    } catch (error) {
      console.error(error);
      alert("Unable to submit form right now. Please try later.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const setValue = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <>
      {/* === YOUR BANNER (unchanged) === */}
      <div className="hero-banner">
        <div className="overlay"></div>
        <div className="banner-content">
          <h1>Become A Sales Partner</h1>
          <p>
            Unlock new earning opportunities & promote high-quality products,
            enjoy competitive commissions, and grow your business with full support,
            marketing resources, and training for long-term success.
          </p>
          <Link href="#register" className="banner-btn">Register as Dealer</Link>
        </div>
      </div>

      {/* === FORM SECTION === */}
      <div className="max-w-8xl mx-auto">
        <div className="sales-form-wrapper" id="register">
          <h2 className="form-title bordered">Start Your Sales Partnership</h2>
          <p className="form-subtitle mt-4">
            Join our sales partner network to grow your income by promoting
            trusted products with full support.
          </p>

          <form className="sales-form" onSubmit={handleSubmit}>
            {/* First & Last Name */}
            <div className="form-row">
              <div className="field">
                <input
                  type="text"
                  placeholder="First Name"
                  className={errors.firstName ? "error-input" : ""}
                  value={form.firstName}
                  onChange={(e) => setValue("firstName", e.target.value)}
                />
                {errors.firstName && (
                  <p className="error-text">{errors.firstName}</p>
                )}
              </div>

              <div className="field">
                <input
                  type="text"
                  placeholder="Last Name"
                  className={errors.lastName ? "error-input" : ""}
                  value={form.lastName}
                  onChange={(e) => setValue("lastName", e.target.value)}
                />
                {errors.lastName && (
                  <p className="error-text">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="form-row">
              <div className="field">
                <input
                  type="email"
                  placeholder="Email Address"
                  className={errors.email ? "error-input" : ""}
                  value={form.email}
                  onChange={(e) => setValue("email", e.target.value)}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              <div className="field">
                <input
                  type="tel"
                  placeholder="Phone No."
                  className={errors.phone ? "error-input" : ""}
                  value={form.phone}
                  onChange={(e) => setValue("phone", e.target.value)}
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
            </div>

            {/* Company */}
            <div className="form-row">
              <div className="field">
                <input
                  type="text"
                  placeholder="Company/Business Name"
                  className={errors.company ? "error-input" : ""}
                  value={form.company}
                  onChange={(e) => setValue("company", e.target.value)}
                />
                {errors.company && (
                  <p className="error-text">{errors.company}</p>
                )}
              </div>
            </div>

            {/* Dropdowns */}
            <div className="form-row">
              <div className="field">
                <select
                  className={errors.experience ? "error-input" : ""}
                  value={form.experience}
                  onChange={(e) => setValue("experience", e.target.value)}
                >
                  <option value="">Sales Experience</option>
                  <option value="0-1">0–1 Years</option>
                  <option value="1-3">1–3 Years</option>
                  <option value="3-5">3–5 Years</option>
                  <option value="5+">5+ Years</option>
                  <option value="no-exp">No Prior Experience</option>
                </select>
                {errors.experience && (
                  <p className="error-text">{errors.experience}</p>
                )}
              </div>

              <div className="field">
                <select
                  className={errors.hearAbout ? "error-input" : ""}
                  value={form.hearAbout}
                  onChange={(e) => setValue("hearAbout", e.target.value)}
                >
                  <option value="">How did you hear about us?</option>
                  <option value="google">Google Search</option>
                  <option value="social-media">Social Media</option>
                  <option value="email">Email Newsletter</option>
                  <option value="friend">Friend / Referral</option>
                  <option value="website">Our Website</option>
                  <option value="event">Event / Exhibition</option>
                  <option value="other">Other</option>
                </select>
                {errors.hearAbout && (
                  <p className="error-text">{errors.hearAbout}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="field">
              <textarea
                placeholder="Type Your Message Here....."
                className={errors.message ? "error-input" : ""}
                value={form.message}
                onChange={(e) => setValue("message", e.target.value)}
              ></textarea>
              {errors.message && (
                <p className="error-text">{errors.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="terms-row">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={(e) => setValue("terms", e.target.checked)}
              />
              <label>
                I confirm that I have read and agree to the Terms & Conditions.
              </label>
            </div>
            {errors.terms && (
              <p className="error-text">{errors.terms}</p>
            )}

            <button className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
