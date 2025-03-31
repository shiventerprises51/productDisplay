import React, { useState } from "react";
import PropTypes from "prop-types";
import "./MobileCategoryFilter.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";

const MobileCategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  handleSearch,
  minPrice,
  maxPrice,
  handlePriceFilter,
  setMinPrice,
  setMaxPrice,
  resetFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mobile-category-container">
      {/* Category Chips and Search Icon */}
      <div className="mobile-category-scroll">
        <button
          className={`mobile-category-chip ${
            selectedCategory === "All" ? "active" : ""
          }`}
          onClick={() => onCategoryChange("All")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`mobile-category-chip ${
              category.id === selectedCategory ? "active" : ""
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Fixed Search Icon */}
      <div className="search-icon-wrapper">
        <FontAwesomeIcon
          icon={faSearch}
          className="mobile-search-icon"
          onClick={() => setShowFilters(true)}
        />
      </div>

      {/* Filter Panel with Overlay */}
      {showFilters && (
        <>
          <div
            className="mobile-filter-overlay"
            onClick={() => setShowFilters(false)}
          />
          <div className="mobile-filter-panel">
            <div className="mobile-filter-header">
              <h3>Filters</h3>
              <FontAwesomeIcon
                icon={faTimes}
                className="mobile-close-icon"
                onClick={() => setShowFilters(false)}
              />
            </div>

            <div className="mobile-search-container">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="mobile-search-input"
              />
            </div>

            <div className="mobile-price-filter">
              <div className="price-inputs">
                <input
                  type="number"
                  value={minPrice}
                  placeholder="Min price"
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="mobile-price-input"
                />
                <input
                  type="number"
                  value={maxPrice}
                  placeholder="Max price"
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="mobile-price-input"
                />
              </div>
              <div className="mobile-filter-buttons">
                <Button
                  variant="contained"
                  className="mobile-apply-btn"
                  onClick={() => {
                    handlePriceFilter();
                    setShowFilters(false);
                  }}
                >
                  Apply
                </Button>
                <Button
                  variant="outlined"
                  className="mobile-reset-btn"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

MobileCategoryFilter.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  minPrice: PropTypes.string.isRequired,
  maxPrice: PropTypes.string.isRequired,
  handlePriceFilter: PropTypes.func.isRequired,
  setMinPrice: PropTypes.func.isRequired,
  setMaxPrice: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
};

export default MobileCategoryFilter;
