import React from "react";
import { createRoot } from "react-dom/client";
import App from "./Components/App.jsx";
import "../public/style.css";

// Get the root element
const rootElement = document.getElementById("root");

// Create a React root
const root = createRoot(rootElement);

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
