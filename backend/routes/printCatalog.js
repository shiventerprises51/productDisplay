const PDFDocument = require("pdfkit");
const express = require("express");
const axios = require("axios");
const pool = require("../config/db");
const router = express.Router();

router.post("/", async (req, res) => {
  const {
    categoryId,
    companyName,
    mobileNumber,
    dateApplicaple,
    priceFlag,
    priceAdjustment,
    minPrice,
    maxPrice,
    hintText,
  } = req.body;

  if (!categoryId) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  try {
    const subcategories = await pool`
      SELECT id, name FROM subcategories WHERE category_id = ${categoryId}
    `;

    if (subcategories.length === 0) {
      return res.status(404).json({ error: "No subcategories found" });
    }

    const doc = new PDFDocument({
      margins: {
        top: 10.4,
        bottom: 21.4,
        left: 21.4,
        right: 21.4,
      },
      size: [595.45, 841.68],
    });

    const filename = `catalog.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    doc.pipe(res);

    const cellWidth = 180;
    const cellHeight = 220;
    const margin = 5;
    let totalProducts = 0;
    let processedProducts = 0;
    const calcTotalPage = async () => {
      let totalPages = 0;

      for (const subcat of subcategories) {
        const productCountResult = await pool`
              SELECT COUNT(*) AS product_count 
              FROM products 
              WHERE subcategory_id = ${subcat.id}
              AND price BETWEEN ${minPrice} AND ${maxPrice}`;

        const productCount = productCountResult[0].product_count;

        const pagesForSubcategory = Math.ceil(productCount / 9); // 9 products per page

        // Add the calculated pages to the total
        totalPages += pagesForSubcategory;
        // totalProducts += productCountResult[0].product_count;
      }

      return totalPages;
    };
    let totalPages;
    // sendProgress({ stage: "initializing", progress: 0 });

    const renderHeader = () => {
      doc.addPage();
      doc.font("./fonts/Bold.ttf");
      doc
        .fontSize(10)
        .fillColor("red")
        .text(`Rates List applicable from ${dateApplicaple}`, {
          align: "center",
        });
      doc.moveDown(0.2);

      doc
        .fillColor("#0c4edd")
        .fontSize(26)
        .text(`${companyName}`, { align: "center", underline: true });

      doc
        .fillColor("#2cd40a")
        .fontSize(18)
        .text(`${mobileNumber}`, { align: "center" });
      doc
        .fontSize(10)
        .fillColor("red")
        .text(`(${hintText})`, { align: "center", highlight: true });

      // doc.moveDown();
    };

    let currentPage = 0;

    const renderProducts = async (products, subcategoryName) => {
      let subpageno = 1;
      // doc.addPage();
      let x = doc.page.margins.left;
      let y = doc.page.margins.top + 113;
      currentPage += 1;
      // renderFooter(doc, currentPage, totalPages);
      renderHeader();

      doc
        .fillColor("black")
        .moveTo(x, y - 150)
        .fontSize(15)
        .text(`${subcategoryName}`, { align: "center" });

      doc
        .moveTo(x, y - 144)
        .fontSize(10)
        .text(`${subpageno}`, { align: "center" })
        .moveDown();

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        // processedProducts++;
        // const progress = Math.round((processedProducts / totalProducts) * 100);
        // sendProgress({
        // stage: "processing",
        // progress,
        // });
        if (y + cellHeight > doc.page.height - doc.page.margins.bottom) {
          doc.moveDown();
          doc
            .fontSize(10)
            .fillColor("grey")
            .text(`Page ${currentPage} of ${totalPages}`, 0, 805, {
              align: "center",
            });
          subpageno = subpageno + 1;
          currentPage += 1;
          renderHeader();

          x = doc.page.margins.left;
          y = doc.page.margins.top + 113;
          doc
            .fillColor("black")
            .moveTo(x, y - 150)
            .fontSize(15)
            .text(`${subcategoryName}`, { align: "center" });
          doc
            .moveTo(x, y - 144)
            .fontSize(10)
            .text(`${subpageno}`, { align: "center" })
            .moveDown();
        }

        // Draw product cell
        doc
          .strokeColor("#0c4edd")
          .lineWidth(2)
          .rect(x, y, cellWidth, cellHeight)
          .stroke();

        // Dynamically adjust font size for product name
        let nameFontSize = 12;
        doc.fontSize(nameFontSize);
        while (
          doc.widthOfString(product.name) > cellWidth - 12 &&
          nameFontSize > 6
        ) {
          nameFontSize -= 0.5;
          doc.fontSize(nameFontSize);
        }

        doc.fillColor("black").text(product.name, x + 5, y + 3, {
          width: cellWidth - 10,
          align: "center",
        });

        const lineY = y + 18; // Adjust the Y-coordinate for the horizontal line
        doc
          .strokeColor("#f63c05")
          .lineWidth(1)
          .moveTo(x, lineY)
          .lineTo(x + cellWidth, lineY)
          .stroke();

        //Price Detail
        const eachcellWidth = 180; // Cell width

        // Draw vertical line to separate the two sections
        doc
          .strokeColor("#f63c05")
          .lineWidth(1)
          .moveTo(x - 35 + eachcellWidth / 2, y + 18) // Starting point for the vertical line
          .lineTo(x - 35 + eachcellWidth / 2, y + 36) // Ending point for the vertical line
          .stroke();

        if (priceFlag) {
          // Convert product.price to a number and calculate the adjusted price
          const basePrice = parseFloat(product.price);
          const adjustedPrice = basePrice + (basePrice * priceAdjustment) / 100;

          // Round the adjusted price to an integer
          const roundedPrice = Math.round(adjustedPrice);

          doc
            .fillColor("#2cd40a")
            .fontSize(12)
            .text(`Rs.${roundedPrice}/-`, x + 5, y + 21, {
              width: eachcellWidth / 2 - 40,
              align: "center",
            });
        }

        // Center and print details in the right section
        doc
          .fillColor("#2cd40a")
          .fontSize(12)
          .text(product.details, x - 35 + eachcellWidth / 2, y + 21, {
            width: eachcellWidth / 2 + 30,
            align: "center",
          });
        const lineYBI = y + 36; // Adjust the Y-coordinate for the horizontal line
        doc
          .strokeColor("#f63c05")
          .lineWidth(1)
          .moveTo(x, lineYBI)
          .lineTo(x + cellWidth, lineYBI)
          .stroke();

        // Draw product image

        if (product.image_url) {
          try {
            const imageBuffer = await axios.get(product.image_url, {
              responseType: "arraybuffer",
            });
            doc.image(Buffer.from(imageBuffer.data), x + 20, y + 40, {
              width: cellWidth - 40,
              height: 170,
              align: "center",
            });
          } catch {
            doc.text("[Image Not Available]", x + 5, y + 90);
          }
        }

        x += cellWidth + margin;

        if ((i + 1) % 3 === 0) {
          x = doc.page.margins.left;
          y += cellHeight + margin;
        }
      }

      doc
        .fontSize(10)
        .fillColor("grey")
        .text(`Page ${currentPage} of ${totalPages}`, 0, 805, {
          align: "center",
        });
    };

    totalPages = await calcTotalPage();

    for (const subcat of subcategories) {
      const products = await pool`
        SELECT name, price, details, image_url
        FROM products
        WHERE subcategory_id = ${subcat.id}
        AND price BETWEEN ${minPrice} AND ${maxPrice}
        ORDER BY price ASC, name ASC
      `;

      if (products.length > 0) {
        await renderProducts(products, subcat.name);
      }
    }
    // sendProgress({ stage: "completed", progress: 100 });
    doc.end();
  } catch (error) {
    console.error("Error generating catalog:", error);
    if (!res.headersSent)
      res.status(500).json({ error: "Error generating catalog" });
  }
});

module.exports = router;
