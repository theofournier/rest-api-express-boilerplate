const mongoose = require("mongoose");
const uuidv4 = require("uuid/v4");
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
    const verification = `${userId}.${uuidv4()}`;
    const expires = moment()
      .add(passwordResetTokenExpirationInterval, "hours")
      .toDate();
    const tokenObject = new this({
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
