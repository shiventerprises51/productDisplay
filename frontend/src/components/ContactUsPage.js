import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function ContactUsPage() {
  return (
    <div className="contact-page">
      <div className="ContactNavbar">
        <Navbar />
      </div>

      <div className="contact-hero-section text-center p-5 bg-primary text-white">
        <h1>Contact Us</h1>
        <p className="mt-3">
          Have questions or feedback? We're here to help! Get in touch with us.
        </p>
      </div>

      <div className="container my-5">
        <div className="row">
          {/* Contact Form Section */}
          <div className="col-md-6">
            <h2>Send Us a Message</h2>
            <form
              target="_self"
              action="https://formsubmit.co/7b08d1788b956889afb4e9fa9c5237df"
              method="POST"
              className="contact-form mt-4"
            >
              <input type="text" name="_honey" style={{ display: "none" }} />
              <input type="hidden" name="_captcha" value={false} />
              <input
                type="hidden"
                name="_next"
                value="https://shiventerprises.vercel.app/Contact-success"
              />

              {/* Name and Phone Fields */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="Phone"
                  id="phone"
                  className="form-control"
                  placeholder="Phone Number"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  className="form-control"
                  placeholder="Your Message"
                  rows="5"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-info btn-lg btn-block">
                Submit Form
              </button>
            </form>
          </div>

          {/* Contact Information Section */}
          <div className="col-md-6">
            <h2>Contact Information</h2>
            <p className="mt-4">
              Feel free to reach out to us via the following methods:
            </p>
            <ul className="list-unstyled contact-details">
              <li>
                <i className="bi bi-geo-alt"></i> RZ - 63/404, Street No 15C,
                Shivpuri, West Sagarpur, New Delhi ,India
              </li>
              <li>
                <i className="bi bi-telephone"></i> Phone: +91 9717437131
              </li>
              <li>
                <i className="bi bi-envelope"></i> Email:
                ramadharkumar51@gmail.com
              </li>
            </ul>

            <div className="social-icons mt-4">
              <a href="#" className="text-info me-3">
                <i className="bi bi-facebook"></i>
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

export default ContactUsPage;
