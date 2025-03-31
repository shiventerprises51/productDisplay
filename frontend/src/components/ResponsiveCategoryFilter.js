import React from "react";
import { useMediaQuery } from "@mui/material";
import CategoryFilter from "./CategoryFilter";
import MobileCategoryFilter from "./MobileCategoryFilter";

const ResponsiveCategoryFilter = ({
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
  const isMobile = useMediaQuery("(max-width:768px)");

  return isMobile ? (
    <MobileCategoryFilter
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={onCategoryChange}
      searchTerm={searchTerm}
      handleSearch={handleSearch}
      minPrice={minPrice}
      maxPrice={maxPrice}
      handlePriceFilter={handlePriceFilter}
      setMinPrice={setMinPrice}
      setMaxPrice={setMaxPrice}
      resetFilters={resetFilters}
    />
  ) : (
    <CategoryFilter
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={onCategoryChange}
      searchTerm={searchTerm}
      handleSearch={handleSearch}
      minPrice={minPrice}
      maxPrice={maxPrice}
      handlePriceFilter={handlePriceFilter}
      setMinPrice={setMinPrice}
      setMaxPrice={setMaxPrice}
      resetFilters={resetFilters}
    />
  );
};

export default ResponsiveCategoryFilter;
