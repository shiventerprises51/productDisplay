import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function ContactusSuccess() {
  return (
    <div className="contact-page">
      <div className="ContactNavbar">
        <Navbar />
      </div>

      <div className="hero-section text-center p-5 bg-primary text-white">
        <h1>Contact Us</h1>
        <p className="mt-3">
          Have questions or feedback? We're here to help! Get in touch with us.
        </p>
      </div>

      <div className="container my-5">
        <div className="row">
          {/* Contact Form Section */}
          <div className="col-md-6">
            <h3 className="text-success">
              Message recieved, we will get back to you.
            </h3>
          </div>

          {/* Contact Information Section */}
          <div className="col-md-6">
            <h2>Contact Information</h2>
            <p className="mt-4">
              Feel free to reach out to us via the following methods:
            </p>
            <ul className="list-unstyled contact-details">
              <li>
                <i className="bi bi-geo-alt"></i> Address: Rz 487/407 Street No
                - 15 G, Shivpuri, West Sagarpur, New Delhi, India
              </li>
              <li>
                <i className="bi bi-telephone"></i> Phone: +91 9958660231
              </li>
              <li>
                <i className="bi bi-envelope"></i> Email: sukesh3333@gmail.com
              </li>
            </ul>

            <div className="social-icons mt-4">
              <a href="#" className="text-info me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-info me-3">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-info">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ContactusSuccess;
