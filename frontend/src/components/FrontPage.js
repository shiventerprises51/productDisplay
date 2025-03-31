import React, { useContext, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./FrontPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import ProductCards from "./ProductCards";
import Footer from "./Footer";
import { CartContext } from "./context/Cart";
import ResponsiveCategoryFilter from "./ResponsiveCategoryFilter";
import ResponsiveSubcategoryFilter from "./ResponsiveSubcategoryFilter";
import BarLoader from "react-spinners/BarLoader";
import ProductModal from "./ProductModal";
import CartButton from "./CartButton";
import { useNavigate } from "react-router-dom";
// import Cart from "./Cart";

function FrontPage() {
  const navigate = useNavigate();
  // const { cartItems, addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayOrder, setDisplayOrder] = useState([]); // Tracks visual display order
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const modalRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const { cartItems, addToCart, removeFromCart, setQuantity, quantityInCart } =
    useContext(CartContext);
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const storedProducts = sessionStorage.getItem("products");
  //       const storedCategories = sessionStorage.getItem("categories");
  //       const storedSubcategories = sessionStorage.getItem("subcategories");

  //       if (storedProducts && storedCategories && storedSubcategories) {
  //         setLoading(false);
  //         console.log("Yes Got it");

  //         // Retrieve data from sessionStorage
  //         const productsData = JSON.parse(storedProducts);
  //         const categoriesData = JSON.parse(storedCategories);
  //         const subcategoriesData = JSON.parse(storedSubcategories);

  //         setProducts(productsData);
  //         setCategories(categoriesData);
  //         setSubcategories(subcategoriesData);
  //         setFilteredProducts(productsData); // Assuming you want the initial filter to be all products
  //       } else {
  //         console.log("NO Didn't get it");
  //         // Fetch data from the server
  //         const productResponse = await fetch(
  //           `${process.env.REACT_APP_SERVER_URL}/api/products`
  //         );
  //         const productsData = await productResponse.json();

  //         const categoryResponse = await fetch(
  //           `${process.env.REACT_APP_SERVER_URL}/api/categories`
  //         );
  //         const categoriesData = await categoryResponse.json();

  //         const subcategoriesData = {};
  //         for (const category of categoriesData) {
  //           const response = await fetch(
  //             `${process.env.REACT_APP_SERVER_URL}/api/subcategories/${category.id}`
  //           );
  //           subcategoriesData[category.id] = await response.json();
  //         }

  //         setProducts(productsData);
  //         setCategories(Array.isArray(categoriesData) ? categoriesData : []);
  //         setSubcategories(subcategoriesData);
  //         setFilteredProducts(productsData);

  //         // Store data in sessionStorage
  //         sessionStorage.setItem("products", JSON.stringify(productsData));
  //         sessionStorage.setItem("categories", JSON.stringify(categoriesData));
  //         sessionStorage.setItem(
  //           "subcategories",
  //           JSON.stringify(subcategoriesData)
  //         );
  //       }
  //       if (urlCategory && categories.length > 0) {
  //         const categoryId = parseInt(urlCategory);
  //         const category = categories.find((cat) => cat.id === categoryId);

  //         if (category) {
  //           setSelectedCategory(categoryId);
  //           filterProducts("", categoryId, "All", "", "");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [urlCategory]);

  useEffect(() => {
    const storedProducts = sessionStorage.getItem("products");
    const storedCategories = sessionStorage.getItem("categories");
    const storedSubcategories = sessionStorage.getItem("subcategories");

    if (storedProducts && storedCategories && storedSubcategories) {
      console.log("Loading products from sessionStorage...");
      setLoading(false);
      setProducts(JSON.parse(storedProducts));
      setCategories(JSON.parse(storedCategories));
      setSubcategories(JSON.parse(storedSubcategories));
      setFilteredProducts(JSON.parse(storedProducts));
    } else {
      console.log("Products not found in sessionStorage, consider preloading.");
    }

    if (urlCategory) {
      const categoryId = parseInt(urlCategory);
      const category = categories.find((cat) => cat.id === categoryId);

      if (category) {
        setSelectedCategory(categoryId);
        filterProducts("", categoryId, "All", "", "");
      }
    }
  }, [urlCategory]);
  useEffect(() => {
    if (categories.length > 0 && urlCategory) {
      const categoryId = parseInt(urlCategory);
      const categoryExists = categories.some((cat) => cat.id === categoryId);

      if (categoryExists) {
        setSelectedCategory(categoryId);
        filterProducts("", categoryId, "All", "", "");
      }
    }
  }, [categories, urlCategory]); // Run when categories or URL param changes

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalProduct &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalProduct]);

  // Build display order when filtered products change
  useEffect(() => {
    const newDisplayOrder = [];
    const grouped = groupProducts();

    // Flatten the grouped structure into displayOrder
    Object.values(grouped).forEach((categoryGroup) => {
      Object.values(categoryGroup).forEach((subcategoryGroup) => {
        subcategoryGroup.forEach((product) => newDisplayOrder.push(product));
      });
    });

    setDisplayOrder(newDisplayOrder);
  }, [filteredProducts]);

  // Category/subcategory handlers
  const handleCategoryChange = (categoryId) => {
    // Use navigate instead of history.replaceState
    navigate(`/FrontPage?category=${categoryId}`);
    setSelectedCategory(categoryId);
    setSelectedSubcategory("All");
    filterProducts(searchTerm, categoryId, "All", minPrice, maxPrice);
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    filterProducts(
      searchTerm,
      selectedCategory,
      subcategoryId,
      minPrice,
      maxPrice
    );
  };

  // Search and price filtering
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterProducts(
      term,
      selectedCategory,
      selectedSubcategory,
      minPrice,
      maxPrice
    );
  };

  const handlePriceFilter = () => {
    filterProducts(
      searchTerm,
      selectedCategory,
      selectedSubcategory,
      minPrice,
      maxPrice
    );
  };

  // Filter products
  const filterProducts = (term, categoryId, subcategoryId, min, max) => {
    let filtered = products;

    if (categoryId !== "All") {
      filtered = filtered.filter(
        (product) => product.category_id === categoryId
      );
    }

    if (subcategoryId !== "All") {
      filtered = filtered.filter(
        (product) => product.subcategory_id === subcategoryId
      );
    }

    if (term) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(term)
      );
    }

    if (min !== "" || max !== "") {
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.price);
        return (!min || price >= min) && (!max || price <= max);
      });
    }

    filtered = filtered.sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    );
    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setFilteredProducts(products); // Important: Reset to the original product list
  };

  // Group products and build display order
  const groupProducts = () => {
    const grouped = {};
    filteredProducts.forEach((product) => {
      const categoryName =
        categories.find((cat) => cat.id === product.category_id)?.name ||
        "Uncategorized";
      const subcategoryName =
        subcategories[product.category_id]?.find(
          (sub) => sub.id === product.subcategory_id
        )?.name || "Uncategorized";

      if (!grouped[categoryName]) grouped[categoryName] = {};
      if (!grouped[categoryName][subcategoryName])
        grouped[categoryName][subcategoryName] = [];
      grouped[categoryName][subcategoryName].push(product);
    });
    return grouped;
  };
  if (loading) {
    return (
      <div className="loader">
        <p> product loading...</p>
        <BarLoader
          cssOverride={{}}
          height={10}
          speedMultiplier={1}
          width={300}
        />
      </div>
    );
  }

  // Modal navigation
  const openModal = (product, category) => {
    setModalProduct({ ...product, category });
    const index = displayOrder.findIndex((p) => p.id === product.id);
    setCurrentProductIndex(index);
  };

  const closeModal = () => {
    setModalProduct(null);
    setCurrentProductIndex(0);
  };

  // Function to handle adding the product to the cart
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Function to handle removing the product from the cart
  const handleRemoveFromCart = (product, flag = false) => {
    removeFromCart(product, flag);
  };

  // Check if the modal product is in the cart
  const cartProduct = modalProduct
    ? cartItems.find((item) => item.id === modalProduct.id)
    : null;

  const handleNextProduct = () => {
    const nextIndex = (currentProductIndex + 1) % displayOrder.length;
    setCurrentProductIndex(nextIndex);
    setModalProduct(displayOrder[nextIndex]);
  };

  const handlePreviousProduct = () => {
    const prevIndex =
      (currentProductIndex - 1 + displayOrder.length) % displayOrder.length;
    setCurrentProductIndex(prevIndex);
    setModalProduct(displayOrder[prevIndex]);
  };

  // Swipe handling
  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 50) handlePreviousProduct();
    else if (deltaX < -50) handleNextProduct();
  };

  // Render
  const groupedProducts = groupProducts();

  return (
    <div className="Frontpageparent">
      <div className="app-container">
        {/* Navbar and Hero Section */}
        <div className="frontnavbar">
          <Navbar />
        </div>

        {/* Category Selection */}
        <div className="Category-section-frontpage">
          <ResponsiveCategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            minPrice={minPrice}
            maxPrice={maxPrice}
            handlePriceFilter={handlePriceFilter}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            resetFilters={resetFilters}
          />
        </div>

        <div className="frontpage-content">
          {/* Subcategory Selection */}
          <ResponsiveSubcategoryFilter
            subcategories={subcategories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSubcategoryChange={handleSubcategoryChange}
          />
          {/* Product Grid */}
          <div className="product-grid">
            {Object.entries(groupedProducts).map(
              ([categoryName, subcategories]) => (
                <div key={categoryName} className="category-group">
                  <div className="frontpage-ctg-heading">{categoryName}</div>
                  {Object.entries(subcategories).map(
                    ([subcategoryName, products]) => (
                      <div key={subcategoryName} className="subcategory-group">
                        <div className="frontpage-sub-heading">
                          {subcategoryName}
                        </div>
                        <div className="product-cards">
                          {products.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => openModal(product, categoryName)}
                            >
                              <ProductCards
                                id={product.id}
                                category={categoryName}
                                image_url={product.image_url}
                                name={product.name}
                                price={product.price}
                                description={product.details}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <CartButton itemCount={quantityInCart()}></CartButton>

      <Footer />

      {/* Product Modal */}
      {modalProduct && (
        <ProductModal
          modalProduct={modalProduct}
          closeModal={closeModal}
          handleAddToCart={handleAddToCart}
          handleRemoveFromCart={handleRemoveFromCart}
          cartItems={cartItems}
          handlePreviousProduct={handlePreviousProduct}
          handleNextProduct={handleNextProduct}
          handleTouchStart={handleTouchStart}
          handleTouchEnd={handleTouchEnd}
          setQuantity={setQuantity}
        />
      )}
    </div>
  );
}

export default FrontPage;
