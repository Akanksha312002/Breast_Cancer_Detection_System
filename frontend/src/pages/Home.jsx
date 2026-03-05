import React from 'react'
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { isUserLoggedIn } from "../utils/auth";

const Home = () => {
  const isLoggedIn = isUserLoggedIn();

  return (
    <>
      {/* HERO SECTION */}
      <div className="home-hero">
        
        <div className="home-hero-content">
          <h1>
            <span className="home-pink-text">BREAST CANCER</span><br />
            DETECTION SYSTEM
          </h1>

          <p className="home-hero-tagline">
            Early Detection • Better Care • Smarter Decisions
          </p>

          <p className="home-hero-description">
            This project focuses on the early detection of breast cancer using
            modern technology to support accurate prediction and awareness.
          </p>

          <Link
            to={isLoggedIn ? "/dashboard/about" : "/about"}
            className="home-hero-read-more"
          >
            Read More
          </Link>
        </div>

      </div>

      {/* DISCLAIMER SECTION */}
      <div className="home-disclaimer">
        <p>
          <strong>Disclaimer:</strong> This system is developed for educational
          and prediction purposes only. The results generated are not a medical
          diagnosis and may not always be accurate. Please consult a qualified
          healthcare professional for confirmed diagnosis.
        </p>

        <Link
          to={isLoggedIn ? "/dashboard/disclaimer" : "/disclaimer"}
          className="home-read-more-btn"
        >
          Read More
        </Link>
      </div>
    </>
  );
};

export default Home;