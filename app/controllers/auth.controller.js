const uuidv4 = require("uuid/v4");
const { matchedData } = require("express-validator");
const httpStatus = require("http-status");
const moment = require("moment-timezone");

const { jwtExpirationInterval } = require("../../config/vars");

const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = "Bearer";
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, "minutes");
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const data = matchedData(req);
    data = {
      ...data,
      verification: uuidv4()
    };
    const user = await new User(data).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());
    //TODO SEND REGISTRATION EMAIL
    return res
      .status(httpStatus.CREATED)
      .json({ token, user: userTransformed });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};
