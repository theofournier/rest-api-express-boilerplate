const mongoose = require("mongoose");
const crypto = require("crypto");
const moment = require("moment-timezone");

const {
  passwordResetTokenExpirationInterval
} = require("../../../config/vars");

const { schema } = require("./schema");

schema.statics = {
  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {User} user
   * @returns {PasswordResetToken}
   */
  async generate(user, ip, browser, country) {
    const userId = user._id;
    const userEmail = user.email;
    const verification = `${userId}.${crypto.randomBytes(40).toString("hex")}`;
    const expires = moment()
      .add(passwordResetTokenExpirationInterval, "hours")
      .toDate();
    const tokenObject = new PasswordResetToken({
      verification,
      userId,
      userEmail,
      expires,
      ipRequest: ip,
      browserRequest: browser,
      countryRequest: country
    });
    await tokenObject.save();
    return tokenObject;
  }
};

/**
 * @typedef PasswordResetToken
 */
module.exports = mongoose.model("PasswordResetToken", schema);
