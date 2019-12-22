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

/**
 * Validates login request
 */
exports.login = [
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

/**
 * Validates verify request
 */
exports.verify = [
  check("id")
    .isString()
    .withMessage(errorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(errorMessages.MISSING)
    .notEmpty()
    .withMessage(errorMessages.IS_EMPTY),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates oAuth request
 */
exports.oAuth = [
  check("access_token")
    .isString()
    .withMessage(errorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(errorMessages.MISSING)
    .notEmpty()
    .withMessage(errorMessages.IS_EMPTY),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates refresh token request
 */
exports.refresh = [
  check("email")
    .isString()
    .withMessage(errorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(errorMessages.MISSING)
    .notEmpty()
    .withMessage(errorMessages.IS_EMPTY)
    .isEmail()
    .withMessage(errorMessages.INVALID_EMAIL),
  check("refreshToken")
    .isString()
    .withMessage(errorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(errorMessages.MISSING)
    .notEmpty()
    .withMessage(errorMessages.IS_EMPTY),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates send password token request
 */
exports.sendPasswordReset = [
  check("email")
    .isString()
    .withMessage(errorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(errorMessages.MISSING)
    .notEmpty()
    .withMessage(errorMessages.IS_EMPTY)
    .isEmail()
    .withMessage(errorMessages.INVALID_EMAIL),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates password reset request
 */
exports.passwordReset = [
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
  check("verification")
    .isString()
    .withMessage(errorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(errorMessages.MISSING)
    .notEmpty()
    .withMessage(errorMessages.IS_EMPTY),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];
