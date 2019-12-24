const { body } = require("express-validator");

const { validationResult } = require("../middlewares/utils");
const { validationErrorMessages } = require("../utils/constants");
const { passwordLength } = require("../../config/vars");

/**
 * Validates register request
 */
exports.register = [
  body("name")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY),
  body("email")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY)
    .isEmail()
    .withMessage(validationErrorMessages.INVALID_EMAIL),
  body("password")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY)
    .isLength({
      min: passwordLength
    })
    .withMessage(validationErrorMessages.PASSWORD_TOO_SHORT),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates login request
 */
exports.login = [
  body("email")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY)
    .isEmail()
    .withMessage(validationErrorMessages.INVALID_EMAIL),
  body("password")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY)
    .isLength({
      min: passwordLength
    })
    .withMessage(validationErrorMessages.PASSWORD_TOO_SHORT),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates verify request
 */
exports.verify = [
  body("id")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates oAuth request
 */
exports.oAuth = [
  body("access_token")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates refresh token request
 */
exports.refresh = [
  body("email")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY)
    .isEmail()
    .withMessage(validationErrorMessages.INVALID_EMAIL),
  body("refreshToken")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates send password token request
 */
exports.sendPasswordReset = [
  body("email")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY)
    .isEmail()
    .withMessage(validationErrorMessages.INVALID_EMAIL),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates password reset request
 */
exports.passwordReset = [
  body("email")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY)
    .isEmail()
    .withMessage(validationErrorMessages.INVALID_EMAIL),
  body("password")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY)
    .isLength({
      min: passwordLength
    })
    .withMessage(validationErrorMessages.PASSWORD_TOO_SHORT),
  body("verification")
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .exists()
    .withMessage(validationErrorMessages.MISSING)
    .notEmpty()
    .withMessage(validationErrorMessages.IS_EMPTY),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];
