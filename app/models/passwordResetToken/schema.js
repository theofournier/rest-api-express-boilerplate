const mongoose = require("mongoose");

const { validationErrorMessages } = require("../../utils/constants");

/**
 * Refresh Token Schema
 * @private
 */
const schema = new mongoose.Schema(
  {
    verification: {
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
      validate: {
        validator: validator.isEmail,
        message: validationErrorMessages.INVALID_EMAIL
      },
      lowercase: true,
      required: true
    },
    expires: {
      type: Date
    },
    ipRequest: {
      type: String
    },
    browserRequest: {
      type: String
    },
    countryRequest: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = { schema };
