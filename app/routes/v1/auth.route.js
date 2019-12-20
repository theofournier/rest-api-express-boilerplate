const express = require("express");
const trimRequest = require("trim-request");

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
 * @apiSuccess (Created 201) {Date}    user.verified      User verified
 * @apiSuccess (Created 201) {Date}    user.verification  User verification token (Except production env)
 *
 * @apiError (Bad Request 409)  Conflict         Email already exist
 * @apiError (Bad Request 422)  ValidationError  Some parameters may contain invalid values
 */
router
  .route("/register")
  .post(trimRequest.all, validate.register, controller.register);

module.exports = router;
