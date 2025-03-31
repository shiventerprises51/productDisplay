import React from "react";
import { useMediaQuery } from "@mui/material";
import SubcategoryFilter from "./SubcategoryFilter";
import MobileSubcategoryFilter from "./MobileSubcategoryFilter";

const ResponsiveSubcategoryFilter = ({
  subcategories,
  selectedCategory,
  selectedSubcategory,
  onSubcategoryChange,
}) => {
  const isMobile = useMediaQuery("(max-width:768px)");

  return isMobile ? (
    <MobileSubcategoryFilter
      subcategories={subcategories}
      selectedCategory={selectedCategory}
      selectedSubcategory={selectedSubcategory}
      onSubcategoryChange={onSubcategoryChange}
    />
  ) : (
    <SubcategoryFilter
      subcategories={subcategories}
      selectedCategory={selectedCategory}
      selectedSubcategory={selectedSubcategory}
      onSubcategoryChange={onSubcategoryChange}
    />
  );
};

export default ResponsiveSubcategoryFilter;
