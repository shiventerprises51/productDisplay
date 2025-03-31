import React, { useState } from "react";
import PropTypes from "prop-types";
import "./CategoryFilter.css";
import Divider from "@mui/material/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from "@mui/material/Button";

const CategoryFilter = ({
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
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div className={`category-section ${isSearchVisible ? "search-mode" : ""}`}>
      <div className="ctg-content">
        {!isSearchVisible && (
          <>
            <div className="ctg-name">Categories</div>
            <Divider orientation="vertical" variant="middle" flexItem />
            <div className="ctg-btn-group" role="group">
              <div className="ctg-btns">
                <button
                  className={`ctg-btn ${
                    selectedCategory === "All" ? "active" : ""
                  }`}
                  onClick={() => onCategoryChange("All")}
                >
                  All
                </button>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="ctg-btns">
                  <button
                    className={`ctg-btn ${
                      category.id === selectedCategory ? "active" : ""
                    }`}
                    onClick={() => onCategoryChange(category.id)}
                  >
                    {category.name}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="search-bar-container">
        {!isSearchVisible ? (
          <FontAwesomeIcon
            icon={faSearch}
            className="search-icon"
            onClick={toggleSearchVisibility}
          />
        ) : (
          <FontAwesomeIcon
            icon={faTimes}
            className="search-icon"
            onClick={toggleSearchVisibility}
          />
        )}
      </div>

      <div
        className={`search-filter-wrapper ${isSearchVisible ? "visible" : ""}`}
      >
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="price-filter-category">
          <div className="Price-filter-input">
            <input
              type="number"
              value={minPrice}
              placeholder="Min price"
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              value={maxPrice}
              placeholder="Max price"
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="price-filter-button">
            <Button
              variant="outlined"
              size="medium"
              onClick={handlePriceFilter}
            >
              Apply
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="medium"
              onClick={resetFilters}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

CategoryFilter.propTypes = {
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

export default CategoryFilter;
