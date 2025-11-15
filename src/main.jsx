import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UIProvider } from "./contexts/UIContext";
import { InsightsProvider } from "./contexts/InsightsContext";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error(
    'Root element not found. Ensure index.html contains <div id="root"></div>'
  );
}

createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <InsightsProvider>
            <App />
          </InsightsProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
