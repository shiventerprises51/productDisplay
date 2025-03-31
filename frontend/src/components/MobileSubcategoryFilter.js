import React, { useState, useEffect, useRef } from "react";
import "./MobileSubcategoryFilter.css";

const MobileSubcategoryFilter = ({
  subcategories,
  selectedCategory,
  selectedSubcategory,
  onSubcategoryChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (
    !subcategories[selectedCategory] ||
    subcategories[selectedCategory].length === 0
  )
    return null;

  const getSelectedName = () =>
    selectedSubcategory === "All"
      ? "All"
      : subcategories[selectedCategory]?.find(
          (sub) => sub.id === selectedSubcategory
        )?.name || "All";

  const handleSelect = (id) => {
    onSubcategoryChange(id);
    setIsDropdownOpen(false);
  };

  return (
    <div className="mobile-subcategory-filter" ref={dropdownRef}>
      <div className="dropdown-wrapper">
        <button
          className="dropdown-toggle"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
        >
          {getSelectedName()}
          <span className={`caret ${isDropdownOpen ? "open" : ""}`}></span>
        </button>
        <div className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
          <div
            className={`dropdown-item ${
              selectedSubcategory === "All" ? "active" : ""
            }`}
            onClick={() => handleSelect("All")}
          >
            All
          </div>
          {subcategories[selectedCategory].map((sub) => (
            <div
              key={sub.id}
              className={`dropdown-item ${
                sub.id === selectedSubcategory ? "active" : ""
              }`}
              onClick={() => handleSelect(sub.id)}
            >
              {sub.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileSubcategoryFilter;
