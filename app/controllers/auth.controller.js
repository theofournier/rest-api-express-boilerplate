const uuidv4 = require("uuid/v4");
const { matchedData } = require("express-validator");
const httpStatus = require("http-status");
const moment = require("moment-timezone");

const APIError = require("../utils/APIError");
const { jwtExpirationInterval, env } = require("../../config/vars");
const { authErrorMessages } = require("../utils/constants");
const { getIP, getCountry, getBrowserInfo } = require("../middlewares/utils");
const emailProvider = require("../services/emailProvider");

const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");
const PasswordResetToken = require("../models/passwordResetToken");

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = "Bearer";
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = jwtExpirationInterval
    ? moment().add(jwtExpirationInterval, "minutes")
    : null;
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn
  };
}

/**
 * Returns jwt token and user if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    let data = matchedData(req);
    data = {
      ...data,
      verification: uuidv4()
    };
    let user = await User.findOne({ email: data.email }).exec();
    if (user && user.chechRegisterWithService()) {
      throw new APIError({
        status: httpStatus.UNAUTHORIZED,
        isPublic: true,
        message: authErrorMessages.LOGGED_WITH_SERVICES,
        error: Object.keys(user.services)
      });
    }
    user = await new User(data).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());
    emailProvider.sendRegistration(req.getLocale(), user);
    return res
      .status(httpStatus.CREATED)
      .json({ token, user: userTransformed });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token and user if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const { user, accessToken } = await User.findAndGenerateToken(data);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.verify = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const user = await User.verifyUser(data.id);
    const userTransformed = user.transform();
    return res.json({ user: userTransformed, verified: true });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = matchedData(req);
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken
    });
    const { user, accessToken } = await User.findAndGenerateToken({
      email,
      refreshObject
    });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * Return a generate password reset token and send email
 * @public
 */
exports.sendPasswordReset = async (req, res, next) => {
  try {
    const { email } = matchedData(req);
    const user = await User.findOne({ email }).exec();
    if (user) {
      const passwordResetObj = await PasswordResetToken.generate(
        user,
        getIP(req),
        getBrowserInfo(req),
        getCountry(req)
      );
      emailProvider.sendPasswordReset(req.getLocale(), user, passwordResetObj);
      let data = {
        email,
        expires: passwordResetObj.expires
      };
      if (env !== "production") {
        data = {
          ...data,
          verification: passwordResetObj.verification,
          ipRequest: passwordResetObj.ipRequest,
          browserRequest: passwordResetObj.browserRequest,
          countryRequest: passwordResetObj.countryRequest
        };
      }
      res.status(httpStatus.OK);
      return res.json(data);
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: authErrorMessages.EMAIL_NOT_FOUND
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, verification } = matchedData(req);
    const resetTokenObject = await PasswordResetToken.findOneAndRemove({
      userEmail: email,
      verification
    });

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    if (!resetTokenObject) {
      err.message = authErrorMessages.INVALID_RESET_TOKEN;
      throw new APIError(err);
    }
    if (moment().isAfter(resetTokenObject.expires)) {
      err.message = authErrorMessages.RESET_TOKEN_EXPIRED;
      throw new APIError(err);
    }

    const user = await User.findOne({
      email: resetTokenObject.userEmail
    }).exec();
    user.password = password;
    await user.save();
    res.status(httpStatus.OK);
    return res.json({ email });
  } catch (error) {
    return next(error);
  }
};
