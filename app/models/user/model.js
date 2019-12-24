const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const httpStatus = require("http-status");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");
const { omitBy, isNil } = require("lodash");

const APIError = require("../../utils/APIError");
const {
  env,
  jwtExpirationInterval,
  jwtSecret,
  loginAttempts,
  hoursToBlock
} = require("../../../config/vars");

const { authErrorMessages } = require("../../utils/constants");

const { schema, roles } = require("./schema");

// Encrypt password before save
schema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();

    const rounds = env === "test" ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
schema.method({
  transform() {
    const transformed = {};
    let fields = ["id", "name", "email", "role", "createdAt", "verified"];
    if (env !== "production") {
      fields = [...fields, "verification"];
    }

    fields.forEach(field => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const payload = {
      data: this._id
    };
    const options = {};
    if (jwtExpirationInterval) {
      options.expiresIn = `${jwtExpirationInterval}min`;
    }
    return jwt.sign(payload, jwtSecret, options);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },

  isBlocked() {
    return this.blockExpires > new Date();
  },

  blockIsExpired() {
    return (
      this.loginAttempts > loginAttempts && this.blockExpires <= new Date()
    );
  },

  chechRegisterWithService() {
    return Object.keys(this.services).length > 0;
  }
});

/**
 * Statics
 */
schema.statics = {
  roles,

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }

      throw new APIError({
        message: authErrorMessages.USER_NOT_FOUND,
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email)
      throw new APIError({
        message: authErrorMessages.EMAIL_REQUIRED
      });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    // Throw error if user is blocked
    if (user.isBlocked()) {
      throw new APIError({ ...err, message: authErrorMessages.USER_BLOCKED });
    } else if (user.blockIsExpired()) {
      // Else, reset login attempts if block expires
      user.loginAttempts = 0;
      await user.save();
    }
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        // Reset login attempts if good password
        user.loginAttempts = 0;
        await user.save();
        return { user, accessToken: user.token() };
      } else if (!user) {
        err.message = authErrorMessages.EMAIL_REQUIRED;
      } else {
        // Check if login with service (FB, GOOGLE)
        if (user.chechRegisterWithService()) {
          err.message = authErrorMessages.LOGGED_WITH_SERVICES;
          err.error = Object.keys(user.services);
        } else {
          // Add 1 login attempts if wrong password
          user.loginAttempts += 1;
          await user.save();
          err.message = authErrorMessages.INVALID_PASSWORD;
          // Block user if too many attempts
          if (user.loginAttempts > loginAttempts) {
            user.blockExpires = addHours(new Date(), hoursToBlock);
            await user.save();
            err.message = authErrorMessages.TOO_MANY_ATTEMPTS;
          }
        }
      }
    }
    // if no password check the refresh token
    else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = authErrorMessages.REFRESH_TOKEN_EXPIRED;
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = authErrorMessages.INVALID_REFRESH_TOKEN;
    }
    throw new APIError(err);
  },

  /**
   * Return verified user if exists and not already verified
   *
   * @param {String} id - The verification of user.
   * @returns {Promise<User, APIError>}
   */
  async verifyUser(id) {
    try {
      let user = await this.findOne({
        verification: id,
        verified: false
      }).exec();
      if (user) {
        user.verified = true;
        await user.save();
        return user;
      }

      throw new APIError({
        message: authErrorMessages.USER_NOT_FOUND_OR_ALREADY_VERIFIED,
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List users with filters and options.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ options, filters }) {
    return this.find(filters, null, options).exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.name === "MongoError" && error.code === 11000) {
      return new APIError({
        message: authErrorMessages.EMAIL_EXISTS,
        errors: [
          {
            field: "email",
            location: "body",
            messages: [authErrorMessages.EMAIL_EXISTS]
          }
        ],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack
      });
    }
    return error;
  },

  async oAuthLogin({ service, id, email, name }) {
    const user = await this.findOne({
      $or: [{ [`services.${service}`]: id }, { email }]
    });
    if (user) {
      user.services[service] = id;
      if (!user.name) user.name = name;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id },
      email,
      password,
      name
    });
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model("User", schema);
