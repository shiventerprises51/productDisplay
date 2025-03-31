# Product Display Project

This project is a full-stack application designed to manage and display products. It includes both backend and frontend components.

## Table of Contents

- [Project Structure](#project-structure)
- [Backend](#backend)
  - [Environment Variables](#environment-variables)
  - [Routes](#routes)
  - [Database Configuration](#database-configuration)
- [Frontend](#frontend)
  - [Components](#components)
  - [API Integration](#api-integration)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Available Scripts](#available-scripts)
- [Learn More](#learn-more)

## Project Structure

```
.gitignore
backend/
  .env
  .gitignore
  config/
    db.js
    dbtemp.js
  fonts/
    Bold.ttf
    Regular.ttf
  gdriveapikey.json
  index.js
  package.json
  routes/
    categories.js
    categoriesforadmin.js
    gdrive.js
    login.js
    printCatalog.js
    products.js
    subcategories.js
    upload.js
    uploads/
  temp.js
Backup/
  .env
  .gitignore
  package.json
  public/
    favicon.ico
    favicon5.ico
    index.html
    logo192.png
frontend/
  .env
  .gitignore
  package.json
  public/
  README.md
  src/
```

## Backend

The backend is built with Node.js and Express. It handles API requests, database interactions, and serves static files.

### Environment Variables

The backend uses environment variables to manage sensitive information. These variables are stored in the `.env` file.

### Routes

- **Categories**: Manages product categories.
  - [categories.js](backend/routes/categories.js)
  - [categoriesforadmin.js](backend/routes/categoriesforadmin.js)
- **Products**: Manages products.
  - [products.js](backend/routes/products.js)
- **Subcategories**: Manages product subcategories.
  - [subcategories.js](backend/routes/subcategories.js)
- **Upload**: Handles file uploads.
  - [upload.js](backend/routes/upload.js)
- **Google Drive Integration**: Manages Google Drive interactions.
  - [gdrive.js](backend/routes/gdrive.js)
- **Login**: Manages user authentication.
  - [login.js](backend/routes/login.js)
- **Print Catalog**: Manages catalog printing.
  - [printCatalog.js](backend/routes/printCatalog.js)

### Database Configuration

Database configuration is managed in the `config` directory:

- [db.js](backend/config/db.js)
- [dbtemp.js](backend/config/dbtemp.js)

## Frontend

The frontend is built with React. It provides a user interface for managing and displaying products.

### Components

- **AdminDashboard**: Main dashboard for admin users.
  - [AdminDashboard.js](frontend/src/components/AdminDashboard.js)
- **AdminAddCategory**: Component for adding categories.
  - [AdminAddCategory.js](frontend/src/components/AdminAddCategory.js)
- **AdminAddProduct**: Component for adding products.
  - [AdminAddProduct.js](frontend/src/components/AdminAddProduct.js)
- **AdminAddSubcategories**: Component for adding subcategories.
  - [AdminAddSubcategories.js](frontend/src/components/AdminAddSubcategories.js)
- **AdminDisplay**: Displays products in a categorized manner.
  - [AdminDisplay.js](frontend/src/components/AdminDisplay.js)
- **AdminProductList**: Lists all products.
  - [AdminProductList.js](frontend/src/components/AdminProductList.js)
- **AdminUploadCatalog**: Handles catalog uploads.
  - [AdminUploadCatalog.js](frontend/src/components/AdminUploadCatalog.js)
- **Login**: User login component.
  - [Login.js](frontend/src/components/Login.js)
- **PrintCatalog**: Handles catalog printing.
  - [PrintCatalog.js](frontend/src/components/PrintCatalog.js)
- **ContactUsPage**: Contact us page.
  - [ContactUsPage.js](frontend/src/components/ContactUsPage.js)
- **Downloads**: Manages downloads.
  - [Downloads.js](frontend/src/components/Downloads.js)
- **Cart**: Manages the shopping cart.
  - [Cart.js](frontend/src/components/Cart.js)
- **HandlePrint**: Handles print functionality.
  - [HandlePrint.js](frontend/src/components/print/HandlePrint.js)

### API Integration

The frontend interacts with the backend through various API endpoints. These endpoints are defined in the backend routes and are used in the frontend components to fetch and manipulate data.

## Getting Started

### Backend Setup

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the necessary environment variables.
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the necessary environment variables.
4. Start the frontend development server:
   ```sh
   npm start
   ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However, we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

```

```
