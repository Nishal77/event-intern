import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Layout component that conditionally shows Navbar/Footer
 * Hides them on admin routes, login, and register pages
 */
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  // Don't show Navbar/Footer on admin routes or auth pages
  if (isAdminRoute || isAuthPage) {
    return <>{children}</>;
  }

  // Regular layout with Navbar and Footer
  return (
    <div className="flex flex-col min-h-screen bg-primary-50">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

