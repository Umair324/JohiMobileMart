import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "./components/Toast.jsx";
import { FavoritesProvider } from "./hooks/useFavorites.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId || ""}>
        <AuthProvider>
          <ToastProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </ToastProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);