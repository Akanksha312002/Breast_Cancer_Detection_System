import React from "react";
import { NavLink } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import "../styles/DashboardNavbar.css";
import ribbon from "../assets/ribbon.png";

const DashboardNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("token");   // ✅ IMPORTANT
        navigate("/"); // go back to home
    };

    return (
        <nav className="dash-navbar">

            {/* Left: Logo */}
            <Link to="/dashboard/home" className="dash-logo">
                <img src={ribbon} alt="Ribbon" />
                <span className="dash-brand">Breast Cancer Detection</span>
            </Link>

            {/* Center: Links */}
            <ul className="dash-nav-links">

                <li>
                    <NavLink to="/dashboard" end className="dash-nav-link">
                        Dashboard
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/predict" className="dash-nav-link">
                        Check Risk
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/contact" className="dash-nav-link">
                        ContactUs
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/about" className="dash-nav-link">
                        AboutUs
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/awareness" className="dash-nav-link">
                        Awareness
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/profile" className="dash-nav-link">
                        My Profile
                    </NavLink>

                </li>
                <li>
                    <button type="button" onClick={handleLogout} className="dash-nav-logout-btn">
                        Log Out
                    </button>
                </li>
            </ul>




        </nav >
    )
}

export default DashboardNavbar
