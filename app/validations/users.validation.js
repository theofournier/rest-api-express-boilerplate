const { param, body, query } = require("express-validator");

const { validationResult } = require("../middlewares/utils");
const { validationErrorMessages } = require("../utils/constants");
const { passwordLength } = require("../../config/vars");
const User = require("../models/user");

/**
 * Validates list of user request
 */
exports.listUsers = [
  query("q")
    .optional()
    .isBase64()
    .withMessage(validationErrorMessages.IS_NOT_BASE64),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates create user request
 */
exports.createUser = [
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
  body("role")
    .optional()
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .isIn(User.roles)
    .withMessage(validationErrorMessages.INVALID_ROLE),
  (req, res, next) => {
    validationResult(req, res, next);
  }
];

/**
 * Validates replace user request
 */
exports.replaceUser = [
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
  body("role")
    .optional()
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .isIn(User.roles)
    .withMessage(validationErrorMessages.INVALID_ROLE),
  param("id")
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
 * Validates update user request
 */
exports.updateUser = [
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
  body("password")
    .optional()
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .isLength({
      min: passwordLength
    })
    .withMessage(validationErrorMessages.PASSWORD_TOO_SHORT),
  body("role")
    .optional()
    .isString()
    .withMessage(validationErrorMessages.IS_NOT_STRING)
    .isIn(User.roles)
    .withMessage(validationErrorMessages.INVALID_ROLE),
  param("id")
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
 * Validates with id param request
 */
exports.idParam = [
  param("id")
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
