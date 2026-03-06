import React, { useState } from "react";
import axios from "axios";
import "../styles/ContactUs.css";
import bg1 from "../assets/contactus1.jpeg";
import bg2 from "../assets/contactus2.png";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:5000/contact", formData);

      setSuccessMessage(response.data.message);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="contact-page">
      {/* ========== SECTION 1 ========== */}
      <section
        className="contact-hero-section"
        style={{ backgroundImage: `url(${bg1})` }}
      >
        <div className="contact-hero-overlay">
          <h1 className="contact-hero-title">Contact Our Support Team</h1>
          <p className="contact-hero-subtitle">
            We’re here to help you with guidance, support and information!!
          </p>

          <div className="contact-info-bar">
            <div className="contact-info-item">
              <i className="fas fa-envelope contact-icon"></i>
              <div>
                <h3>Email</h3>
                <p>support@gmail.com</p>
              </div>
            </div>

            <div className="contact-divider"></div>

            <div className="contact-info-item">
              <i className="fas fa-phone contact-icon"></i>
              <div>
                <h3>Phone</h3>
                <p>+91 98765 XXXXX</p>
              </div>
            </div>

            <div className="contact-divider"></div>

            <div className="contact-info-item">
              <i className="fas fa-map-marker-alt contact-icon"></i>
              <div>
                <h3>Address</h3>
                <p>SGM College</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 2 ========== */}
      <section
        className="contact-form-section"
        style={{ backgroundImage: `url(${bg2})` }}
      >
        <div className="contact-message-banner">
          <span className="contact-ribbon">🎗</span>
          <p>
            Early detection helps save lives. Don’t hesitate to reach out
            if you need help or have questions.
          </p>
        </div>

        <div className="contact-form-wrapper">
          <h2 className="contact-form-title">Send Us a Message</h2>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
            />

            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
            ></textarea>

            <button type="submit">Send Message</button>
          </form>

          {successMessage && (
            <p className="contact-success-message">{successMessage}</p>
          )}

          {errorMessage && (
            <p className="contact-error-message">{errorMessage}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ContactUs;