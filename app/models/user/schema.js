const mongoose = require("mongoose");
const validator = require("validator");

const { errorMessages } = require("../../utils/constants");

/**
 * User Roles
 */
const roles = ["user", "admin"];

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
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: roles,
      default: "user"
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
      default: 0,
      select: false
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = { schema, roles };
