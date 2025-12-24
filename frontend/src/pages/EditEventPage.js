import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, DollarSign, Tag, Image } from "lucide-react";
import { eventService } from "../services/eventService";
import { Alert } from "../components/Alert";
import ProtectedRoute from "../components/ProtectedRoute";

const EditEventPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
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

  const fetchEvent = useCallback(async () => {
    try {
      setLoadingEvent(true);
      const response = await eventService.getEvent(id);
      const event = response.data?.data || response.data;
      
      if (event) {
        // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
        let eventDate = "";
        if (event.date) {
          try {
            const dateObj = new Date(event.date);
            if (!isNaN(dateObj.getTime())) {
              // Get local date/time in the correct format
              const year = dateObj.getFullYear();
              const month = String(dateObj.getMonth() + 1).padStart(2, "0");
              const day = String(dateObj.getDate()).padStart(2, "0");
              const hours = String(dateObj.getHours()).padStart(2, "0");
              const minutes = String(dateObj.getMinutes()).padStart(2, "0");
              eventDate = `${year}-${month}-${day}T${hours}:${minutes}`;
            }
          } catch (e) {
            console.error("Date parsing error:", e);
          }
        }
        
        setFormData({
          title: event.title || "",
          description: event.description || "",
          location: event.location || "",
          date: eventDate,
          category: event.category || "conference",
          price: event.price || 0,
          image: event.image || "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load event");
    } finally {
      setLoadingEvent(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

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
      setError("Please fill in all the required fields");
      return;
    }

    try {
      setLoading(true);
      await eventService.updateEvent(id, formData);
      setSuccess("Event updated! Taking you back...");
      setTimeout(() => navigate("/my-events"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't update event. Try again?"
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

  if (loadingEvent) {
    return (
      <ProtectedRoute
        element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600">Loading event...</p>
            </div>
          </div>
        }
        requiredRole="organizer"
      />
    );
  }

  return (
    <ProtectedRoute
      element={
        <div className="min-h-screen bg-gray-50">
          {/* Simple Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-2xl mx-auto px-6 py-5">
              <h1 className="text-lg font-medium text-gray-900">
                Edit Event
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Update your event details
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto px-6 py-8">
            {error && (
              <div className="mb-6">
                <Alert
                  type="error"
                  message={error}
                  onClose={() => setError(null)}
                />
              </div>
            )}
            {success && (
              <div className="mb-6">
                <Alert
                  type="success"
                  message={success}
                  onClose={() => setSuccess(null)}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm resize-none"
                    rows="4"
                    required
                  ></textarea>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Event Image URL
                  </label>
                  <div className="relative">
                    <Image className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? "Updating Event..." : "Update Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
      requiredRole="organizer"
    />
  );
};

export default EditEventPage;

