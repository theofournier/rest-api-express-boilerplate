const { body } = require("express-validator");

const { validationResult } = require("../middlewares/utils");
const { validationErrorMessages } = require("../utils/constants");
const { passwordLength } = require("../../config/vars");

/**
 * Validates update profile request
 */
exports.updateProfile = [
  body("name")
    .optional()
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING),
  body("email")
    .optional()
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .isEmail()
    .withMessage(validationErrorMessages.INVALID_EMAIL),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates change password request
 */
exports.changePassword = [
  body("oldPassword")
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
  body("newPassword")
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
