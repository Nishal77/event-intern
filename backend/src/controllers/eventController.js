import Event from "../models/Event.js";
import { success, error } from "../helper/responseHelper.js";

// Create event
// Create event (no duplicate events)
export const createEvent = async (req, res) => {
  try {
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

// Get all events
export const getEvents = async (req, res) => {
  const events = await Event.find().populate("organizer");
  success(res, "Events fetched", events);
};

// Get single event
export const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id).populate("organizer");
  if (!event) return error(res, "Event not found", 404);
  success(res, "Event fetched", event);
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
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
    const organizerId = req.user.id; // logged-in organizer

    const events = await Event.find({ organizer: organizerId });

    return res.status(200).json({
      success: true,
      message: "Organizer events fetched",
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
