import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Scanner from "./components/Scanner.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavSidebar from "./components/NavSidebar.jsx";
import AuthProvider from "./auth/AuthProvider.jsx";
import ProtectedRoutes from "./auth/ProtectedRoutes.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        {/* <NavSidebar> */}
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <App />
                </ProtectedRoutes>
              }
            />
            <Route path="/scanner" element={
              <ProtectedRoutes><Scanner></Scanner></ProtectedRoutes>
              
              
              } />

            <Route path="/register" element={<Register />} />
          </Routes>
        {/* </NavSidebar> */}
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
