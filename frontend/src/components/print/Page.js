// import React, { useRef, useEffect, useState } from "react";
// import "./Page.css";

// const Page = ({
//   dateApplicable,
//   companyName,
//   phoneNumbers,
//   hintText,
//   subcategoryName,
//   subPageNumber,
//   productsOnPage = [],
//   pageNumber,
//   totalPage,
//   priceFlag,
//   priceAdjustment,
// }) => {
//   const productNameRefs = useRef([]);
//   const [forceUpdate, setForceUpdate] = useState(false); // State to force re-render
//   // console.log(priceFlag);
//   // priceFlag = 1;
//   useEffect(() => {
//     const resizeObserver = new ResizeObserver((entries) => {
//       entries.forEach((entry) => {
//         const ref = entry.target;
//         const maxWidth = 240.6; // Cell width in pixels
//         let fontSize = 18; // Initial font size

//         // Reduce font size until the text fits within the cell width
//         while (ref.scrollWidth > maxWidth && fontSize > 6) {
//           fontSize -= 0.5;
//           ref.style.fontSize = `${fontSize}px`;
//         }

//         // Ensure the text does not wrap
//         ref.style.whiteSpace = "nowrap";
//         ref.style.overflow = "hidden";
//         ref.style.textOverflow = "ellipsis";
//       });
//     });

//     // Observe elements
//     productNameRefs.current.forEach((ref) => {
//       if (ref) {
//         resizeObserver.observe(ref);
//       }
//     });

//     // Cleanup observer on unmount
//     return () => {
//       productNameRefs.current.forEach((ref) => {
//         if (ref) {
//           resizeObserver.unobserve(ref);
//         }
//       });
//     };
//   }, [productsOnPage, forceUpdate]); // Add forceUpdate as a dependency

//   // Force a re-render after initial load
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setForceUpdate((prev) => !prev); // Toggle forceUpdate to trigger re-render
//     }, 500); // Adjust the delay as needed (500ms is a good starting point)

//     return () => clearTimeout(timeout); // Cleanup timeout on unmount
//   }, []);

//   return (
//     <div className="parentcontainerforprint">
//       <div id="a4-page" className="a4-page">
//         {/* Header Section */}
//         <div className="date-applicable">
//           Rates List applicable from {dateApplicable}
//         </div>
//         <div className="companyName">{companyName}</div>
//         <div className="phoneNumbers">{phoneNumbers}</div>
//         <div className="hintText">{hintText}</div>
//         <div className="subcategoryName">{subcategoryName}</div>
//         <div className="subPageNumber">{subPageNumber}</div>

//         {/* Product Grid */}
//         <div className="productgrid">
//           {productsOnPage.map((product, index) => (
//             <div key={index} className="productcardtoprint">
//               <div
//                 ref={(el) => (productNameRefs.current[index] = el)}
//                 className="productnametoprint"
//                 style={{ fontSize: "18px", whiteSpace: "nowrap" }} // Initial styles
//               >
//                 {product.name}
//               </div>
//               <div className="productnameline"></div>

//               <div className="productdetailstoprint">
//                 <div className="productpricetoprint">
//                   Rs.{" "}
//                   {priceFlag
//                     ? (() => {
//                         const basePrice = parseFloat(product.price);
//                         if (priceAdjustment === 0) {
//                           var newBase;
//                           if (basePrice % 1 !== 0) {
//                             newBase = basePrice.toFixed(2);
//                           }
//                           return newBase;
//                         }
//                         const adjustment = basePrice * (priceAdjustment / 100);
//                         const adjustedPrice = basePrice + adjustment;
//                         const roundedPrice = Math.round(adjustedPrice);
//                         console.log(roundedPrice);
//                         return roundedPrice;
//                       })()
//                     : ""}
//                 </div>
//                 <div className="productsizetoprint">{product.details}</div>
//               </div>
//               <div className="productdetailline"></div>
//               <img
//                 src={product.image_url}
//                 alt={product.productName}
//                 className="productimagetoprint"
//               />
//             </div>
//           ))}
//         </div>
//         <div className="pagenumbertoprint">
//           Page {pageNumber} of {totalPage}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

import React, { useRef, useEffect, useState } from "react";
import "./Page.css";

const Page = ({
  dateApplicable,
  companyName,
  phoneNumbers,
  hintText,
  subcategoryName,
  subPageNumber,
  productsOnPage = [],
  pageNumber,
  totalPage,
  priceFlag,
  priceAdjustment,
}) => {
  const productNameRefs = useRef([]);
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const ref = entry.target;
        const maxWidth = 240.6; // Cell width in pixels
        let fontSize = 18; // Initial font size

        // Reduce font size until the text fits within the cell width
        while (ref.scrollWidth > maxWidth && fontSize > 6) {
          fontSize -= 0.5;
          ref.style.fontSize = `${fontSize}px`;
        }

        // Ensure the text does not wrap
        ref.style.whiteSpace = "nowrap";
        ref.style.overflow = "hidden";
        ref.style.textOverflow = "ellipsis";
      });
    });

    // Observe elements
    productNameRefs.current.forEach((ref) => {
      if (ref) {
        resizeObserver.observe(ref);
      }
    });

    // Cleanup observer on unmount
    return () => {
      productNameRefs.current.forEach((ref) => {
        if (ref) {
          resizeObserver.unobserve(ref);
        }
      });
    };
  }, [productsOnPage, forceUpdate]);

  // Force a re-render after initial load
  useEffect(() => {
    const timeout = setTimeout(() => {
      setForceUpdate((prev) => !prev); // Toggle forceUpdate to trigger re-render
    }, 500); // Adjust the delay as needed (500ms is a good starting point)

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, []);

  // Function to calculate the adjusted price
  const calculateAdjustedPrice = (price) => {
    const basePrice = parseFloat(price);
    if (isNaN(basePrice)) return "N/A"; // Handle invalid prices

    if (priceAdjustment === 0) {
      // If no adjustment, return the base price with 2 decimal places
      return basePrice.toFixed(2);
    }

    // Apply price adjustment
    const adjustment = basePrice * (priceAdjustment / 100);
    const adjustedPrice = basePrice + adjustment;

    // Round the adjusted price to the nearest integer
    return Math.round(adjustedPrice).toFixed(2);
  };

  return (
    <div className="parentcontainerforprint">
      <div id="a4-page" className="a4-page">
        {/* Header Section */}
        <div className="date-applicable">
          Rates List applicable from {dateApplicable}
        </div>
        <div className="companyName">{companyName}</div>
        <div className="phoneNumbers">{phoneNumbers}</div>
        <div className="hintText">{hintText}</div>
        <div className="subcategoryName">{subcategoryName}</div>
        <div className="subPageNumber">{subPageNumber}</div>

        {/* Product Grid */}
        <div className="productgrid">
          {productsOnPage.map((product, index) => (
            <div key={index} className="productcardtoprint">
              <div
                ref={(el) => (productNameRefs.current[index] = el)}
                className="productnametoprint"
                style={{ fontSize: "18px", whiteSpace: "nowrap" }} // Initial styles
              >
                {product.name}
              </div>
              <div className="productnameline"></div>

              <div className="productdetailstoprint">
                <div className="productpricetoprint">
                  {priceFlag
                    ? `Rs. ${calculateAdjustedPrice(product.price)}`
                    : ""}
                </div>
                <div className="productsizetoprint">{product.details}</div>
              </div>
              <div className="productdetailline"></div>
              <img
                src={product.image_url}
                alt={product.productName}
                className="productimagetoprint"
              />
            </div>
          ))}
        </div>
        <div className="pagenumbertoprint">
          Page {pageNumber} of {totalPage}
        </div>
      </div>
    </div>
  );
};

export default Page;
