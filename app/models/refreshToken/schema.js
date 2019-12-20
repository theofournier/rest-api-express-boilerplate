const mongoose = require("mongoose");

/**
 * Refresh Token Schema
 * @private
 */
const schema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userEmail: {
    type: String,
    ref: "User",
    required: true
  },
  expires: { type: Date }
});

module.exports = { schema };
