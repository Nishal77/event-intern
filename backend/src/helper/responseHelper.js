// src/helper/responseHelper.js

// Named export for success
export const success = (res, message, data = {}) => {
  return res.status(200).json({ success: true, message, data });
};

// Named export for error
export const error = (res, message, status = 400) => {
  return res.status(status).json({ success: false, message });
};
