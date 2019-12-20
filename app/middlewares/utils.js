const { validationResult } = require("express-validator");

const APIError = require("../../utils/APIError");
const { errorMessages } = require("../utils/constants");

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
        status: 422,
        message: errorMessages.VALIDATION_ERROR,
        errors: err.array()
      })
    );
  }
};
