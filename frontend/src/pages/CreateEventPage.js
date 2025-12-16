import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, MapPin, DollarSign, Tag, Image } from "lucide-react";
import { eventService } from "../services/eventService";
import { Alert } from "../components/Alert";
import ProtectedRoute from "../components/ProtectedRoute";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    category: "conference",
    price: 0,
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.date
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await eventService.createEvent(formData);
      setSuccess("Event created successfully! Redirecting...");
      setTimeout(() => navigate("/my-events"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "conference",
    "workshop",
    "networking",
    "webinar",
    "meetup",
  ];

  return (
    <ProtectedRoute
      element={
        <div className="min-h-screen bg-primary-50">
          {/* Header */}
          <div className="bg-white border-b border-primary-100">
            <div className="section-container py-8">
              <h1 className="text-3xl font-bold text-primary-900">
                Create New Event
              </h1>
              <p className="text-primary-600 mt-2">
                Launch your event and reach attendees
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="section-container py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              {error && (
                <Alert
                  type="error"
                  title="Error"
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

              <form onSubmit={handleSubmit} className="card p-8">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter event title"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="input-field resize-none"
                      rows="6"
                      placeholder="Describe your event in detail"
                      required
                    ></textarea>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="Event venue or online link"
                        required
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                      Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="input-field pl-10"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                      Price ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                      Event Image URL
                    </label>
                    <div className="relative">
                      <Image className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full mt-8"
                  >
                    {loading ? "Creating Event..." : "Create Event"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      }
      requiredRole="organizer"
    />
  );
};

export default CreateEventPage;
