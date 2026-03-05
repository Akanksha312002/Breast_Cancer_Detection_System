import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © 2026 Breast Cancer Detection System | Consult with a healthcare
        professional for an accurate diagnosis
      </p>

      <div className="social-icons">

      <a
        href="https://www.instagram.com/preventbreastcancer/?hl=ene"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-instagram"></i>
      </a>

      <a
        href="https://www.facebook.com/canprotectfoundation/?ref=embed_page#"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-facebook-f"></i>
      </a>

      <a
        href="https://x.com/NBCF"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-x-twitter"></i>
      </a>

     
      </div>
      

    </footer>
  );
};

export default Footer;
