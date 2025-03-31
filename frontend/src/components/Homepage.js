import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import Navbar from "./Navbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Footer";
import { useSearchParams } from "react-router-dom";

const NextArrow = ({ onClick }) => (
  <div className="arrow next" onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
    </svg>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="arrow prev" onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
    </svg>
  </div>
);

const Homepage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const [sliderReady, setSliderReady] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedProducts = sessionStorage.getItem("products");
        const storedCategories = sessionStorage.getItem("categories");
        const storedSubcategories = sessionStorage.getItem("subcategories");

        if (!storedProducts || !storedCategories || !storedSubcategories) {
          console.log("Fetching products in background...");

          // Fetch data from the server
          const productResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/products/frontpage`
          );
          const productsData = await productResponse.json();

          const categoryResponse = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/api/categories`
          );
          const categoriesData = await categoryResponse.json();

          const subcategoriesData = {};
          for (const category of categoriesData) {
            const response = await fetch(
              `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${category.id}`
            );
            subcategoriesData[category.id] = await response.json();
          }

          // Store fetched data in sessionStorage
          sessionStorage.setItem("products", JSON.stringify(productsData));
          sessionStorage.setItem("categories", JSON.stringify(categoriesData));
          sessionStorage.setItem(
            "subcategories",
            JSON.stringify(subcategoriesData)
          );

          console.log("Products preloaded successfully!");
        } else {
          console.log("Products already stored in sessionStorage.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    // if (!loading) {
    const storedCategories =
      JSON.parse(sessionStorage.getItem("categories")) || [];
    // Filter categories that should be shown and have an image
    // const visibleCategories = storedCategories.filter(
    //   (cat) => cat.show && cat.img_url
    // );
    setCategories(storedCategories);
    // }
  }, [loading]);

  // Preload images using useMemo
  const sliderImages = useMemo(
    () => ({
      mobile: [
        require("./image/image5.jpg"),
        require("./image/image6.jpg"),
        require("./image/image7.jpg"),
      ],
      desktop: [
        require("./image/image1.jpg"),
        require("./image/image2.jpg"),
        require("./image/image3.jpg"),
      ],
    }),
    []
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initialize slider after short delay
    const initTimer = setTimeout(() => setSliderReady(true), 500);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(initTimer);
    };
  }, []);

  const sliderSettings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: true,
      fade: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      adaptiveHeight: true,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    }),
    []
  );

  return (
    <div className="home-container">
      <div className="Home-nav">
        <Navbar />
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        {sliderReady && (
          <Slider
            {...sliderSettings}
            key={isMobile ? "mobile" : "desktop"}
            className="full-width-slider"
          >
            {(isMobile ? sliderImages.mobile : sliderImages.desktop).map(
              (image, index) => (
                <div key={index} className="hero-slide">
                  <img
                    src={image}
                    alt={`Collection ${index + 1}`}
                    loading="eager"
                  />
                  <div className="slide-content">
                    <div className="hero-title">Shiv Enterprises</div>
                    <div className="hero-slogan">
                      We Make Better Things In A Better Way
                    </div>
                    <button
                      className="cta-button"
                      onClick={() => navigate("/FrontPage")}
                      disabled={loading} // Disable button until loading is complete
                    >
                      Explore Now
                    </button>
                  </div>
                </div>
              )
            )}
          </Slider>
        )}
      </div>

      <div className="categories-heading">
        <h2>Our Categories</h2>
        <div className="heading-divider"></div>
      </div>

      <section className="Home-product-showcase">
        {categories.map((category) => (
          <div key={category.id} className="Home-product-card">
            <img
              src={category.img_url}
              alt={category.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = require("./image/image1.jpg"); // Add a fallback image
              }}
            />
            <button
              className="product-hover-button"
              onClick={() => navigate(`/FrontPage?category=${category.id}`)}
              disabled={loading}
            >
              {/* Explore Now */}
              {category.name}
            </button>
          </div>
        ))}
      </section>

      <section className="about-section">
        <div className="about-container">
          <div className="about-logo">
            <img
              src={require("./image/ShivCollection-logo4.png")}
              alt="Company Logo"
            />
          </div>
          <div className="about-content">
            <h2>About Shiv Collection</h2>
            <p className="tagline">Crafting Excellence Since 2008</p>
            <p className="description">
              We are dedicated to creating premium quality products that blend
              traditional craftsmanship with modern design. Our commitment to
              quality and sustainability drives every aspect of our production
              process.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
