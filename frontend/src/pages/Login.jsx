import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    // Email empty
    if (!email) {
      setError("Email is required");
      return false;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password empty
    if (!password) {
      setError("Password is required");
      return false;
    }

    // Password strength check
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be of 8 chracters & should contain letters, numbers & special symbols"
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        {
          email: email,
          password: password,
        }
      );

      // Save login status
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", response.data.user.name);
      localStorage.setItem("userEmail", response.data.user.email);

      // ✅ NEW: Save JWT token
      localStorage.setItem("token", response.data.access_token);

      setShowSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Server error. Please try again.");
      }
    }
  };


  return (
    <div className="login-hero">
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-popup">
            <i className="fas fa-check-circle"></i>
            <h3>Login Successful!</h3>
            <p>Welcome</p>
          </div>
        </div>
      )}
      <div className="login-box">
        <h2>Login</h2>
        <p>Please Enter Your Details to Login</p>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="fas fa-envelope input-icon"></i>
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <i
              className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} input-icon eye-icon`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          {/* ERROR MESSAGE (BOTTOM LEFT OF PASSWORD) */}
          <p className="login-error-text">{error}</p>

          <button type="submit" className="login-log-btn">
            LOGIN
          </button>
        </form>

        <p className="login-signup-text">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
