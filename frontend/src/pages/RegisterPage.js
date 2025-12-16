import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "../services/eventService";
import { Alert } from "../components/Alert";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      await authService.register(submitData);

      // If user registered as organizer, automatically log them in and redirect to home
      if (submitData.role === "organizer") {
        try {
          const resp = await authService.login({
            email: submitData.email,
            password: submitData.password,
          });
          const returnedUser =
            resp.data?.data?.user || resp.data?.user || resp.data?.data;
          const returnedToken = resp.data?.data?.token || resp.data?.token;
          if (returnedUser && returnedToken) {
            login(returnedUser, returnedToken);
            navigate("/");
            return;
          }
        } catch (loginErr) {
          // fallback to notifying success and sending to login
          console.error("Auto-login failed after registration", loginErr);
        }
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary-900 mb-2">
              Create Account
            </h2>
            <p className="text-primary-600">
              Join EventEase and start managing events
            </p>
          </div>

          {/* Messages */}
          {error && (
            <Alert
              type="error"
              title="Registration Failed"
              message={error}
              onClose={() => setError(null)}
            />
          )}
          {success && (
            <Alert
              type="success"
              title="Success"
              message={success}
              onClose={() => setSuccess(null)}
            />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Account Type
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="user">Attendee</option>
                <option value="organizer">Event Organizer</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-primary-200"></div>
            <span className="px-3 text-sm text-primary-600">or</span>
            <div className="flex-1 border-t border-primary-200"></div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-primary-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary-900 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
