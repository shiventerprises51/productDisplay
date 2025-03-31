import React from "react";
import "./SubcategoryFilter.css";

const SubcategoryFilter = ({
  subcategories,
  selectedCategory,
  selectedSubcategory,
  onSubcategoryChange,
}) => {
  if (!subcategories[selectedCategory]?.length) return null;

  return (
    <div className="subcategory-section my-4 subcategory-text text-dark">
      <div className="sub-ctg-heading">
        Subcategories
        <div className="decorative-line"></div>
      </div>
      <div className="d-none d-md-block">
        <div className="row row-cols-auto">
          <div className="sub-btn-groups" role="group">
            <div className="sub-btns">
              <button
                className={`sub-btn ${
                  selectedSubcategory === "All" ? "active" : ""
                }`}
                onClick={() => onSubcategoryChange("All")}
              >
                All
              </button>
            </div>
            {subcategories[selectedCategory].map((sub) => (
              <div key={sub.id} className="sub-btns">
                <button
                  className={`sub-btn ${
                    sub.id === selectedSubcategory ? "active" : ""
                  }`}
                  onClick={() => onSubcategoryChange(sub.id)}
                >
                  {sub.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryFilter;
