const mongoose = require("mongoose");
const crypto = require("crypto");
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
  async generate(user) {
    const userId = user._id;
    const userEmail = user.email;
    const token = `${userId}.${crypto.randomBytes(40).toString("hex")}`;
    const expires = moment()
      .add(refreshTokenExpirationInterval, "days")
      .toDate();
    const tokenObject = new RefreshToken({
      token,
      userId,
      userEmail,
      expires
    });
    await tokenObject.save();
    return tokenObject;
  }
};

/**
 * @typedef RefreshToken
 */
module.exports = mongoose.model("RefreshToken", schema);
