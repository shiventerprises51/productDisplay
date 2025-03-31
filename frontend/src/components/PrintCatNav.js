import React from "react";
// import "./printCatNav.module.css";

const PrintCatNav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Back Button */}
        <a
          href="/admin"
          className="btn btn-light d-flex align-items-center rounded px-3"
          style={{ fontWeight: "500" }}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </a>
      </div>
    </nav>
  );
};

export default PrintCatNav;
