import Event from "../models/Event.js";
import { success, error } from "../helper/responseHelper.js";

/**
 * Create a new event
 * Only organizers can create events. Attendees can only register for events.
 * Prevents duplicate events with same title, date, category for the same organizer
 */
export const createEvent = async (req, res) => {
  try {
    // Defense in depth: Ensure only organizers can create events
    if (req.user.role !== "organizer") {
      return error(
        res,
        "Only event organizers can create events. Attendees can register for events.",
        403
      );
    }

    const { title, date, category, location } = req.body;

    // Check duplicate event for same organizer
    const existingEvent = await Event.findOne({
      title,
      date,
      category,
      organizer: req.user._id,
    });

    if (existingEvent) {
      return error(
        res,
        "Event already exists with same title, date and category",
        400
      );
    }

    // Create event
    const event = await Event.create({
      ...req.body,
      organizer: req.user._id,
    });

    success(res, "Event created", event);
  } catch (err) {
    error(res, err.message);
  }
};

/**
 * Get all events with optional filtering
 */
export const getEvents = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const events = await Event.find(query).populate("organizer");
    success(res, "Events fetched", events);
  } catch (err) {
    error(res, err.message || "Failed to fetch events", 500);
  }
};

/**
 * Get a single event by ID
 */
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer");
    if (!event) {
      return error(res, "Event not found", 404);
    }
    success(res, "Event fetched", event);
  } catch (err) {
    error(res, err.message || "Failed to fetch event", 500);
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    // Ensure only organizers can update events
    if (req.user.role !== "organizer") {
      return error(res, "Only event organizers can update events", 403);
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return error(res, "Event not found", 404);
    }

    // Ensure the organizer owns this event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return error(res, "You can only update your own events", 403);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    success(res, "Event updated successfully", updatedEvent);
  } catch (err) {
    error(res, err.message, 500);
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    // Ensure only organizers can delete events
    if (req.user.role !== "organizer") {
      return error(res, "Only event organizers can delete events", 403);
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return error(res, "Event not found", 404);
    }

    // Ensure the organizer owns this event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return error(res, "You can only delete your own events", 403);
    }

    await Event.findByIdAndDelete(req.params.id);
    success(res, "Event deleted");
  } catch (err) {
    error(res, err.message);
  }
};

// Approve/reject event
export const approveEvent = async (req, res) => {
  try {
    const { status } = req.body; // status: "approved" or "rejected"
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    success(res, `Event ${status}`, event);
  } catch (err) {
    error(res, err.message);
  }
};

// My events for organizer
export const myEvents = async (req, res) => {
  try {
    // Ensure only organizers can view their created events
    if (req.user.role !== "organizer") {
      return error(
        res,
        "Only event organizers can view their created events. Use 'My Registrations' to see events you've registered for.",
        403
      );
    }

    const organizerId = req.user._id;
    const events = await Event.find({ organizer: organizerId }).populate(
      "organizer"
    );

    success(res, "Organizer events fetched", events);
  } catch (err) {
    error(res, err.message || "Server error", 500);
  }
};
