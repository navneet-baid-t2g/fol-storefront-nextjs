"use client";
import { useState } from "react";
import "./style.css";
import { RiMailLine, RiMap2Line, RiPhoneLine } from "@remixicon/react";
import { useRouter } from "next/navigation";

export default function BecomeASalesPartner() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
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

    // Message
    if (!f.message) err.message = "Message is required.";
    else if (f.message.length < 10)
      err.message = "Message must be at least 10 characters.";
    else if (f.message.length > 1024)
      err.message = "Message cannot exceed 1024 characters.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Fetch user's IP
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();

      const payload = {
        data: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          emailAddress: form.email.trim(),
          phoneNumber: form.phone.trim(),
          message: form.message.trim(),
          ipAddress: ipData.ip || "0.0.0.0",
        },
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_API_BASE_URL}/contact-enquiries`,
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

      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });

      setErrors({});

      setTimeout(() => {
        router.push("/thank-you");
      }, 700);

    } catch (err) {
      console.error(err);
      alert("Unable to submit form right now.");
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
      <div className="static-banner">
        <div className="static-banner-overlay"></div>
        <div className="static-banner-content">
          <h1>Contact Us</h1>
        </div>
      </div>

      <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8  ">
        <div className="flex flex-col lg:flex-row py-12 gap-12">

          {/* LEFT COLUMN (Form) */}
          <div className="w-full lg:w-6/12">
            <div className="contact-form-wrapper">
              <h2 className="form-title bordered">Reach Out To Our Team</h2>
              <p className="form-subtitle">
                Have a question or comment?<br />
                Use the form below to send us a message or contact us by mail at:
              </p>

              <form className="contact-form" onSubmit={handleSubmit}>

                {/* First & Last Name */}
                <div className="form-row flex flex-col sm:flex-row gap-4">
                  <div className="field w-full">
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

                  <div className="field w-full">
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
                <div className="form-row flex flex-col sm:flex-row gap-4">
                  <div className="field w-full">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={errors.email ? "error-input" : ""}
                      value={form.email}
                      onChange={(e) => setValue("email", e.target.value)}
                    />
                    {errors.email && (
                      <p className="error-text">{errors.email}</p>
                    )}
                  </div>

                  <div className="field w-full">
                    <input
                      type="tel"
                      placeholder="Phone No."
                      className={errors.phone ? "error-input" : ""}
                      value={form.phone}
                      onChange={(e) => setValue("phone", e.target.value)}
                    />
                    {errors.phone && (
                      <p className="error-text">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="field w-full">
                  <textarea
                    placeholder="Type Your Message Here....."
                    className={errors.message ? "error-input" : ""}
                    value={form.message}
                    onChange={(e) => setValue("message", e.target.value)}
                  />
                  {errors.message && (
                    <p className="error-text">{errors.message}</p>
                  )}
                </div>

                <button className="submit-btn mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-6/12 contact-info">
            <h3 className="bordered">Get in Touch</h3>
            <p className="my-4">
              We'd love to hear from you – please use the form to send us your
              message or product inquiry.
            </p>

            {/* Address */}
            <div className="contact-row">
              <RiMap2Line className="contact-icon" />
              <p>
                B-704, 7th Floor Tower-B, Cyber Park 62, Plot No C-28, 29, Sector 62,<br />
                Noida, UP 201309, India
              </p>
            </div>

            {/* Email */}
            <div className="contact-row">
              <RiMailLine className="contact-icon" />
              <p>
                <a
                  href="mailto:Info@FiberOpticsLabs.com"
                  className="contact-link hover:underline"
                >
                  Info@FiberOpticsLabs.com
                </a>
              </p>
            </div>

            {/* Phone */}
            <div className="contact-row">
              <RiPhoneLine className="contact-icon" />
              <p>
                <a href="tel:+91 82876 07598" className="contact-link hover:underline">
                  +91 82876 07598
                </a>
              </p>
            </div>

            {/* Opening Hours */}
            <h4 className="opening-title mt-6">Opening Hours:</h4>
            <div className="opening-hours space-y-1">
              <p>MON TO FRI: 9:30 AM - 06:00 PM IST</p>
              <p>SAT: 9:30 AM - 5:00 PM IST</p>
              <p>SUN: Closed</p>
            </div>
          </div>
        </div>

        {/* MAP */}
        <div className="map-embed-container mt-10">
          <div className="map-embed-inner">
            <iframe
              title="Company location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5811417002433!2d77.3663421!3d28.612339900000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x456545e46584e901%3A0x8333e90c84428020!2sFIBER%20OPTICS%20LABS!5e0!3m2!1sen!2sin!4v1764069275846!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map-iframe"
            />
          </div>
        </div>
      </div>

    </>
  );
}
