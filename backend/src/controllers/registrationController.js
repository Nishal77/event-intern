import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import { success, error } from "../helper/responseHelper.js";

// Register for an event
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return error(res, "Event not found", 404);

    const existing = await Registration.findOne({
      event: eventId,
      user: req.user._id,
    });
    if (existing) return error(res, "Already registered");

    const registration = await Registration.create({
      event: eventId,
      user: req.user._id,
    });
    success(res, "Registered successfully", registration);
  } catch (err) {
    error(res, err.message);
  }
};

// Get user's registrations
export const myRegistrations = async (req, res) => {
  const registrations = await Registration.find({
    user: req.user._id,
  }).populate("event");
  success(res, "My registrations fetched", registrations);
};

// Cancel registration
export const cancelRegistration = async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    success(res, "Registration cancelled");
  } catch (err) {
    error(res, err.message);
  }
};

// Admin: All registrations
export const allRegistrations = async (req, res) => {
  const registrations = await Registration.find()
    .populate("user")
    .populate("event");
  success(res, "All registrations fetched", registrations);
};
