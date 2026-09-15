import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TripCartProvider } from "./context/TripCartContext";
import { ToastProvider } from "./components/ui/Toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TripCartProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </TripCartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
