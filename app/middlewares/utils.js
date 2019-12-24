const { validationResult } = require("express-validator");
const httpStatus = require("http-status");
const requestIp = require("request-ip");

const APIError = require("../utils/APIError");
const { validationErrorMessages } = require("../utils/constants");

/**
 * Gets IP from user
 * @param {*} req - request object
 */
exports.getIP = req => requestIp.getClientIp(req);

/**
 * Gets browser info from user
 * @param {*} req - request object
 */
exports.getBrowserInfo = req => req.headers["user-agent"];

/**
 * Gets country from user using App Engine header 'X-AppEngine-Country'
 * @param {*} req - request object
 */
exports.getCountry = req =>
  req.headers["X-AppEngine-Country"]
    ? req.headers["X-AppEngine-Country"]
    : "XX";

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
exports.validationResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    return next();
  } catch (err) {
    return next(
      new APIError({
        status: httpStatus.UNPROCESSABLE_ENTITY,
        message: validationErrorMessages.VALIDATION_ERROR,
        errors: err.array()
      })
    );
  }
};
