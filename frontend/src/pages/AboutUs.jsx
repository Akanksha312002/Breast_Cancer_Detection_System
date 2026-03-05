import React from "react";
import "../styles/AboutUs.css";
import aboutBg from "../assets/aboutus.png"; // your background image

const AboutUs = () => {
  return (
    <div className="about-page">

      <section
        className="about-hero"
        style={{ backgroundImage: `url(${aboutBg})` }}
      >
        <div className="about-overlay">

          <h1 className="about-title">About Us</h1>
          <p className="about-subtitle">
            Learn more about our mission to promote breast cancer awareness
            and early detection.
          </p>

          {/* Combined Info Card */}
          <div className="about-card">

            <div className="about-item">
              <div className="about-icon">💗</div>
              <div>
                <h3>Who We Are</h3>
                <p>
                  Breast Cancer Detection is dedicated to providing an accurate
                  risk assessment and spreading awareness to save lives through
                  early detection.
                </p>
              </div>
            </div>

            <div className="about-divider"></div>

            <div className="about-item">
              <div className="about-icon">🎯</div>
              <div>
                <h3>Our Mission</h3>
                <p>
                  Our mission is to empower women with the knowledge and tools
                  they need to assess their breast cancer risk early and take
                  preventive action.
                </p>
              </div>
            </div>

            <div className="about-divider"></div>

            <div className="about-item">
              <div className="about-icon">🌸</div>
              <div>
                <h3>Why Choose Us?</h3>
                <p>
                  Advanced technology, user-friendly tools, educational
                  resources, and a strong commitment to women’s health and
                  wellness.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
