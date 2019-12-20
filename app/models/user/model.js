const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const mongoosePaginate = require("mongoose-paginate-v2");
const httpStatus = require("http-status");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");
const { omitBy, isNil } = require("lodash");

const APIError = require("../../utils/APIError");
const {
  env,
  jwtExpirationInterval,
  jwtSecret
} = require("../../../config/vars");

const { errorMessages } = require("../../utils/constants");

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
    const fields = ["id", "name", "email", "role", "createdAt", "verified"];
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
    if (jwtExpirationInterval != null) {
      options.expiresIn = `${jwtExpirationInterval}min`;
    }
    return jwt.sign(payload, jwtSecret, options);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  }
});

/**
 * Statics
 */
userSchema.statics = {
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
        message: errorMessages.USER_NOT_FOUND,
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
        message: errorMessages.EMAIL_REQUIRED
      });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() };
      } else if (!user) {
        err.message = errorMessages.EMAIL_REQUIRED;
      } else {
        err.message = errorMessages.INVALID_PASSWORD;
      }
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = errorMessages.INVALID_REFRESH_TOKEN;
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = errorMessages.REFRESH_TOKEN_REQUIRED;
    }
    throw new APIError(err);
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ page = 1, perPage = 30, name, email, role }) {
    const options = omitBy({ name, email, role }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
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
        message: errorMessages.EMAIL_EXISTS,
        errors: [
          {
            field: "email",
            location: "body",
            messages: [errorMessages.EMAIL_EXISTS]
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

schema.plugin(mongoosePaginate);

/**
 * @typedef User
 */
module.exports = mongoose.model("User", schema);
