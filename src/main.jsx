import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { InboxProvider } from "./context/InboxContext";
import "./index.css";
import "./i18n/index.js";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <InboxProvider>
          <App />
        </InboxProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
