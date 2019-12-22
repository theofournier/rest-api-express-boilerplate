const mongoose = require("mongoose");
const validator = require("validator");

const { errorMessages, auth } = require("../../utils/constants");

/**
 * User Roles
 */
const roles = [auth.USER, auth.ADMIN];

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: errorMessages.INVALID_EMAIL
      },
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: roles,
      default: auth.USER
    },
    services: {
      facebook: String,
      google: String
    },
    verification: {
      type: String
    },
    verified: {
      type: Boolean,
      default: false
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    blockExpires: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = { schema, roles };
