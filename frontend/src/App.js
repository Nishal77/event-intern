import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventDetailPage from "./pages/EventDetailPage";
import CreateEventPage from "./pages/CreateEventPage";
import MyEventsPage from "./pages/MyEventsPage";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";
import AdminPage from "./pages/AdminPage";

// Styles
import "./index.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-primary-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/event/:id" element={<EventDetailPage />} />

              {/* Protected Routes */}
              <Route
                path="/create-event"
                element={
                  <ProtectedRoute
                    element={<CreateEventPage />}
                    requiredRole="organizer"
                  />
                }
              />
              <Route
                path="/my-events"
                element={
                  <ProtectedRoute
                    element={<MyEventsPage />}
                    requiredRole="organizer"
                  />
                }
              />
              <Route
                path="/my-registrations"
                element={<ProtectedRoute element={<MyRegistrationsPage />} />}
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    element={<AdminPage />}
                    requiredRole="admin"
                  />
                }
              />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
