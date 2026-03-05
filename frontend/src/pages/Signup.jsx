import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Signup.css";

const API_BASE = "http://127.0.0.1:5000";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [resendIn, setResendIn] = useState(0); // seconds

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // ✅ replaces alert
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // avatar
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const validateBeforeOtp = () => {
    if (!name || !email) {
      setError("Please enter name and email first.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    setError("");
    return true;
  };

  const validatePasswords = () => {
    if (!password || !confirmPassword) {
      setError("Password and Confirm Password are required.");
      return false;
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError("Password must contain letters, numbers & special symbols.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSendOtp = async () => {
    setSuccessMsg("");
    if (!validateBeforeOtp()) return;

    if (resendIn > 0) return;

    try {
      setOtpLoading(true);
      setError("");

      await axios.post(`${API_BASE}/send-signup-otp`, { email });

      setOtpSent(true);
      setOtpVerified(false);
      setOtp("");
      setResendIn(30);
      setSuccessMsg("✅ OTP sent to your email. (Valid for 5 minutes)");
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to send OTP.";
      setError(msg);
      setOtpSent(false);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setSuccessMsg("");

    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!otp) {
      setError("Please enter OTP.");
      return;
    }

    try {
      setVerifyLoading(true);
      setError("");

      await axios.post(`${API_BASE}/verify-signup-otp`, { email, otp });

      setOtpVerified(true);
      setSuccessMsg("✅ OTP verified. Now set your password to complete signup.");
    } catch (err) {
      const msg = err?.response?.data?.error || "OTP verification failed.";
      setError(msg);
      setOtpVerified(false);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    if (!otpVerified) {
      setError("Please verify OTP first.");
      return;
    }

    if (!validatePasswords()) return;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) formData.append("avatar", avatar);

      await axios.post(`${API_BASE}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const msg = err?.response?.data?.error || "Server error. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="signup-hero">
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-popup">
            <i className="fas fa-check-circle"></i>
            <h3>Signup Successful!</h3>
            <p>Please login to continue</p>
          </div>
        </div>
      )}

      <div className="signup-box">
        <h2>Sign Up</h2>
        <p>Create your account</p>

        {/* Avatar */}
        <div className="signup-avatar-wrap">
          <label className="signup-avatar-circle">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="avatar preview"
                className="signup-avatar-img"
              />
            ) : (
              <span className="signup-avatar-placeholder">
                <i className="fas fa-user"></i>
              </span>
            )}

            <span className="signup-camera-badge">
              <i className="fas fa-camera"></i>
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleAvatarChange}
              hidden
            />
          </label>
          <p className="signup-avatar-text">Upload profile photo (optional)</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={otpVerified}
            />
            <i className="fas fa-user input-icon"></i>
          </div>

          {/* EMAIL */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setOtpSent(false);
                setOtpVerified(false);
                setOtp("");
                setSuccessMsg("");
              }}
              disabled={otpVerified}
            />
            <i className="fas fa-envelope input-icon"></i>
          </div>

          {/* SEND OTP */}
          <button
            type="button"
            className="signup-otp-btn"
            onClick={handleSendOtp}
            disabled={otpLoading || resendIn > 0 || otpVerified}
          >
            {otpLoading ? (
              <span className="btn-loader"></span>
            ) : resendIn > 0 ? (
              `Resend OTP in ${resendIn}s`
            ) : (
              "Send OTP"
            )}
          </button>

          {/* ✅ OTP UI hidden until otpSent */}
          {otpSent && (
            <>
              <p className="otp-hint">OTP expires in <b>5 minutes</b>.</p>

              <div className="otp-row">
                <div className="input-group otp-input">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={otpVerified}
                  />
                  <i className="fas fa-key input-icon"></i>
                </div>

                <button
                  type="button"
                  className="signup-verify-btn"
                  onClick={handleVerifyOtp}
                  disabled={verifyLoading || otpVerified}
                >
                  {verifyLoading ? <span className="btn-loader dark"></span> : "Verify"}
                </button>
              </div>
            </>
          )}

          {/* Passwords only after OTP verified */}
          <div className={`password-block ${otpVerified ? "show" : ""}`}>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!otpVerified}
              />
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} input-icon eye-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!otpVerified}
              />
              <i
                className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} input-icon eye-icon`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>
          </div>

          {/* messages */}
          {successMsg && <p className="signup-success-text">{successMsg}</p>}
          <p className="signup-error-text">{error}</p>

          <button type="submit" className="signup-btn" disabled={!otpVerified}>
            SIGN UP
          </button>
        </form>

        <p className="signup-login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;