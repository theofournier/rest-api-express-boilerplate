const { check } = require("express-validator");

const { validationResult } = require("../middlewares/utils");
const { errorMessages } = require("../utils/constants");

/**
 * Validates register request
 */
exports.register = [
  check("name")
    .isString()
    .withMessage(errorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(errorMessages.MISSING)
    .notEmpty()
    .withMessage(errorMessages.IS_EMPTY),
  check("email")
    .isString()
    .withMessage(errorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(errorMessages.MISSING)
    .notEmpty()
    .withMessage(errorMessages.IS_EMPTY)
    .isEmail()
    .withMessage(errorMessages.INVALID_EMAIL),
  check("password")
    .isString()
    .withMessage(errorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(errorMessages.MISSING)
    .notEmpty()
    .withMessage(errorMessages.IS_EMPTY)
    .isLength({
      min: 5
    })
    .withMessage(errorMessages.PASSWORD_TOO_SHORT),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];
