import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/PublicNavbar.css";
import ribbon from "../assets/ribbon.png";

const PublicNavbar = () => {
  return (
    <nav className="navbar">

      {/* Left: Logo */}
      <div className="logo">
        <img src={ribbon} alt="Ribbon" />
        <span className="brand">Breast Cancer Detection </span>
      </div>

      {/* Center: Links */}
      <ul className="nav-links">
        <li>
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="nav-link">
            Contact Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="nav-link">
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/awareness" className="nav-link">
            Awareness
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" className="nav-login-btn">
            Log In
          </NavLink>
        </li>
      </ul>




    </nav>
  );
};

export default PublicNavbar;
