import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

document.documentElement.setAttribute("data-theme", "dark");

if (navigator.userAgent.toLowerCase().includes("electron")) {
  document.documentElement.setAttribute("data-electron", "");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
