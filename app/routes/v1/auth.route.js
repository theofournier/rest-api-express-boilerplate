const express = require("express");
const trimRequest = require("trim-request");

const oAuthLogin = require("../../middlewares/auth").oAuth;
const validate = require("../../validations/auth.validation");
const controller = require("../../controllers/auth.controller");

const router = express.Router();

/**
 * @api {post} v1/auth/register Register
 * @apiDescription Register a new user
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}          name      User's name
 * @apiParam  {String}          email     User's email
 * @apiParam  {String{6..128}}  password  User's password
 *
 * @apiSuccess (Created 201) {String}  token.tokenType     Access Token's type
 * @apiSuccess (Created 201) {String}  token.accessToken   Authorization Token
 * @apiSuccess (Created 201) {String}  token.refreshToken  Token to get a new accessToken
 *                                                   after expiration time
 * @apiSuccess (Created 201) {Number}  token.expiresIn     Access Token's expiration time
 *                                                   in miliseconds
 * @apiSuccess (Created 201) {String}  token.timezone      The server's Timezone
 *
 * @apiSuccess (Created 201) {String}  user.id            User's id
 * @apiSuccess (Created 201) {String}  user.name          User's name
 * @apiSuccess (Created 201) {String}  user.email         User's email
 * @apiSuccess (Created 201) {String}  user.role          User's role
 * @apiSuccess (Created 201) {Date}    user.createdAt     Timestamp
 * @apiSuccess (Created 201) {Boolean} user.verified      User verified
 * @apiSuccess (Created 201) {String}  user.verification  User verification token (Except production env)
 *
 * @apiError (Bad Request 409)  Conflict         Email already exist
 * @apiError (Bad Request 422)  ValidationError  Some parameters may contain invalid values
 */
router
  .route("/register")
  .post(trimRequest.all, validate.register, controller.register);

/**
 * @api {post} v1/auth/login Login
 * @apiDescription Get an accessToken
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}         email     User's email
 * @apiParam  {String}  password  User's password
 *
 * @apiSuccess  {String}  token.tokenType     Access Token's type
 * @apiSuccess  {String}  token.accessToken   Authorization Token
 * @apiSuccess  {String}  token.refreshToken  Token to get a new accessToken
 *                                                   after expiration time
 * @apiSuccess  {Number}  token.expiresIn     Access Token's expiration time
 *                                                   in miliseconds
 *
 * @apiSuccess  {String}  user.id             User's id
 * @apiSuccess  {String}  user.name           User's name
 * @apiSuccess  {String}  user.email          User's email
 * @apiSuccess  {String}  user.role           User's role
 * @apiSuccess  {Date}    user.createdAt      Timestamp
 * @apiSuccess  {Boolean} user.verified      User verified
 * @apiSuccess  {String}  user.verification  User verification token (Except production env)
 *
 *
 * @apiError (Bad Request 401)  Unauthorized     Password incorrect, User blocked
 * @apiError (Bad Request 422)  ValidationError  Some parameters may contain invalid values
 */
router.route("/login").post(trimRequest.all, validate.login, controller.login);

/**
 * @api {post} v1/auth/verify Verify
 * @apiDescription Verify user and get user back
 * @apiVersion 1.0.0
 * @apiName Verify
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}    id     User's verification id
 *
 * @apiSuccess  {Boolean}  verified           User's verified
 *
 * @apiSuccess  {String}  user.id             User's id
 * @apiSuccess  {String}  user.name           User's name
 * @apiSuccess  {String}  user.email          User's email
 * @apiSuccess  {String}  user.role           User's role
 * @apiSuccess  {Date}    user.createdAt      Timestamp
 * @apiSuccess  {Boolean} user.verified      User verified
 * @apiSuccess  {String}  user.verification  User verification token (Except production env)
 *
 *
 * @apiError (Not Found 404)  Not Found  Verification id not found
 */
router
  .route("/verify")
  .post(trimRequest.all, validate.verify, controller.verify);

/**
 * @api {post} v1/auth/refresh-token Refresh Token
 * @apiDescription Refresh expired accessToken
 * @apiVersion 1.0.0
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  email         User's email
 * @apiParam  {String}  refreshToken  Refresh token aquired when user logged in
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken or user blocked
 */
router.route("/refresh-token").post(validate.refresh, controller.refresh);

/**
 * @api {post} v1/auth/facebook Facebook Login
 * @apiDescription Login with facebook. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName FacebookLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Facebook's access_token
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token, or user blocked
 */
router
  .route("/facebook")
  .post(validate.oAuth, oAuthLogin("facebook"), controller.oAuth);

/**
 * @api {post} v1/auth/google Google Login
 * @apiDescription Login with google. Creates a new user if it does not exist
 * @apiVersion 1.0.0
 * @apiName GoogleLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  access_token  Google's access_token
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accpessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Incorrect access_token
 */
router
  .route("/google")
  .post(validate.oAuth, oAuthLogin("google"), controller.oAuth);

/**
 * @api {post} v1/auth/send-password-reset Send password reset
 * @apiDescription Generate and send password reset token
 * @apiVersion 1.0.0
 * @apiName Send Password Reset
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  email         User's email
 *
 * @apiSuccess {String}  email     User's email
 * @apiSuccess {Date}    expires   Reset password token expiration
 *
 * @apiError (Bad Request 422)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Email not found
 */
router
  .route("/send-password-reset")
  .post(validate.sendPasswordReset, controller.sendPasswordReset);

/**
 * @api {post} v1/auth/password-reset Password reset
 * @apiDescription Reset the password if valid token
 * @apiVersion 1.0.0
 * @apiName Password Reset
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  email         User's email
 * @apiParam  {String}  password      User's password
 *
 * @apiSuccess {String}  email     User's email
 *
 * @apiError (Bad Request 422)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized    Invalid token
 */
router
  .route("/password-reset")
  .post(validate.passwordReset, controller.resetPassword);

module.exports = router;
