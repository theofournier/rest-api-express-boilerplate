const mongoose = require("mongoose");
const uuidv4 = require("uuid/v4");
const moment = require("moment-timezone");

const { refreshTokenExpirationInterval } = require("../../../config/vars");

const { schema } = require("./schema");

schema.statics = {
  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {User} user
   * @returns {RefreshToken}
   */
  generate(user) {
    const userId = user._id;
    const userEmail = user.email;
    const token = `${userId}.${uuidv4()}`;
    const expires = moment()
      .add(refreshTokenExpirationInterval, "days")
      .toDate();
    const tokenObject = new this({
      token,
      userId,
      userEmail,
      expires
    });
    tokenObject.save();
    return tokenObject;
  }
};

/**
 * @typedef RefreshToken
 */
module.exports = mongoose.model("RefreshToken", schema);
