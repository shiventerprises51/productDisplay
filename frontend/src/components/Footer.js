import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="./FrontPage" className="footer-link">
            Product
          </a>
          <a href="./Contact-us" className="footer-link">
            Contact
          </a>
          <a href="./downloads" className="footer-link">
            Downloads
          </a>
        </div>
        <div className="footer-social">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-icon"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-icon"
          >
            Instagram
          </a>
        </div>
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} MyWebsite. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
