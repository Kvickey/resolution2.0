import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Importing your CSS styles
import App from "./App"; // Importing the main App component
import $ from "jquery"; // Importing jQuery
import { AuthProvider } from "./components/AuthProvider";
import { BrowserRouter } from "react-router-dom";

// Making jQuery available globally
window.$ = $;
window.jQuery = $;

// Creating a root for rendering the app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Rendering the App component
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
