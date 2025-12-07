import { useState } from "react";
import Navbar from "../components/Navbar";
import "./ContactPage.css";
import Footer from "../components/Footer";
const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // demo handling — API can be added later
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", message: "" });
    }, 2500);
  };

  return (
    <>
      <Navbar />
      <main className="contact-container">
        <section className="contact-header">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you! Send us a message anytime.</p>
        </section>

        <section className="contact-content">
          {/* Left side: Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email Address
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Message
              <textarea
                name="message"
                placeholder="Write your message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </label>

            <button type="submit" className="contact-btn">
              Send Message
            </button>

            {submitted && (
              <p className="contact-success">
                ✓ Thank you! Your message has been sent.
              </p>
            )}
          </form>

          {/* Right side: Contact details */}
          <aside className="contact-info">
            <h2>Reach Us</h2>
            <p>
              📍 221B Fragrance Avenue, Paris, France
              <br />
              ✉ support@perfumeclub.com
              <br />
              ☎ +33 910 222 5678
            </p>

            <h2>Business Hours</h2>
            <p>
              Monday – Friday: 9:00 AM – 7:00 PM
              <br />
              Saturday: 10:00 AM – 4:00 PM
              <br />
              Sunday: Closed
            </p>
          </aside>
        </section>
      </main>
        <Footer />
    </>
  );
};

export default ContactPage;
