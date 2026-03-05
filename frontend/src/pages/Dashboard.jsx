
import React from "react";
import "../styles/Dashboard.css";
import riskImg from "../assets/risk.png";
import profileImg from "../assets/profile.png";
import resultImg from "../assets/result.png";
import awarenessImg from "../assets/db_awareness.png";
import doctorImg from "../assets/doctor2.png";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      {/* HERO SECTION */}
      <section className="dashboard-hero">
        <div className="hero-container">

          <div className="hero-image">
            <img src={doctorImg} alt="Doctor" />
          </div>

          <div className="hero-content">
            <h1>Welcome to Your Health Dashboard</h1>
            <p className="hero-subtitle">
              Early detection saves lives. Stay aware, stay strong.
            </p>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="dashboard-main">
        {/* CARDS */}
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Check Risk</h3>
            <img src={riskImg} alt="risk" />
            <p>Assess Your Risk</p>
            <button onClick={() => navigate("/predict")} className="secondary-btn">Get Started</button>
          </div>

          <div className="dashboard-card">
            <h3>My Profile</h3>
            <img src={profileImg} alt="profile" />
            <p>Manage Your Info</p>
            <button onClick={() => navigate("/profile")} className="secondary-btn">View Profile</button>
          </div>

          <div className="dashboard-card">
            <h3>View Results</h3>
            <img src={resultImg} alt="results" />
            <p>See Your Reports</p>
            <button onClick={() => navigate("/reports")} className="secondary-btn">View Reports</button>
          </div>

          <div className="dashboard-card">
            <h3>Awareness</h3>
            <img src={awarenessImg} alt="awareness" />
            <p>Learn About Breast Cancer</p>
            <button onClick={() => navigate("/dashboard/awareness")} className="secondary-btn">Explore</button>
          </div>
        </div>

        {/* AWARENESS STRIP */}
        <div className="awareness-strip">
          <p>
            Early detection can save lives. Regular self-exams and timely
            screenings significantly improve survival rates.
          </p>
        </div>

        {/* MOTIVATION CARD */}
        <div className="motivation-card">
          <h2>You’re Stronger Than You Think 💖</h2>
          <p>
            Taking a small step today can make a big difference tomorrow. Stay
            aware, stay confident, and prioritize your well-being.
          </p>
        </div>
      </section>
    </div>
  );
}
