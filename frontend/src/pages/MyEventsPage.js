import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import { eventService } from "../services/eventService";
import { Alert, LoadingSpinner } from "../components/Alert";
import ProtectedRoute from "../components/ProtectedRoute";

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.myEvents();
      setEvents(response.data?.data || []);
    } catch (err) {
      setError("Failed to load your events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await eventService.deleteEvent(eventId);
      setSuccess("Event deleted successfully");
      setEvents(events.filter((e) => e._id !== eventId));
    } catch (err) {
      setError("Failed to delete event");
    }
  };

  return (
    <ProtectedRoute
      element={
        <div className="min-h-screen bg-primary-50">
          {/* Header */}
          <div className="bg-white border-b border-primary-100">
            <div className="section-container py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div>
                  <h1 className="text-3xl font-bold text-primary-900 mb-2">
                    My Events
                  </h1>
                  <p className="text-primary-600">
                    Manage all your organized events
                  </p>
                </div>
                <Link
                  to="/create-event"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Event</span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="section-container py-12">
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

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : events.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 card p-8"
              >
                <Calendar className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary-900 mb-2">
                  No Events Yet
                </h3>
                <p className="text-primary-600 mb-6">
                  Create your first event to get started
                </p>
                <Link to="/create-event" className="btn-primary inline-block">
                  Create Event
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <EventCard event={event} actionLabel="View" />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Link
                        to={`/edit-event/${event._id}`}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      }
      requiredRole="organizer"
    />
  );
};

export default MyEventsPage;
