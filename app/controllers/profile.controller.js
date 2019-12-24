const { matchedData } = require("express-validator");
const httpStatus = require("http-status");

const APIError = require("../utils/APIError");
const { authErrorMessages } = require("../utils/constants");
const User = require("../models/user");

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Update logged in user
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const user = Object.assign(req.user, matchedData(req));

    const savedUser = await user.save();
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(e));
  }
};

/**
 * Change Password of logged in user
 * @public
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = matchedData(req);
    const user = req.user;

    if (await user.passwordMatches(oldPassword)) {
      throw new APIError({
        message: authErrorMessages.INVALID_PASSWORD,
        status: httpStatus.CONFLICT
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};
