const express = require("express");
const trimRequest = require("trim-request");

const { authorize } = require("../../middlewares/auth");
const validate = require("../../validations/profile.validation");
const controller = require("../../controllers/profile.controller");

const router = express.Router();

router
  .route("/")
  /**
   * @api {get} v1/profile User Profile
   * @apiDescription Get logged in user profile information
   * @apiVersion 1.0.0
   * @apiName Profile
   * @apiGroup Profile
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  name       User's name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
   */
  .get(authorize(), trimRequest.all, controller.loggedIn)
  /**
   * @api {patch} v1/profile Update Profile
   * @apiDescription Update some fields of a user document
   * @apiVersion 1.0.0
   * @apiName UpdateProfile
   * @apiGroup Profile
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {String}             email     User's email
   * @apiParam  {String{6..128}}     password  User's password
   * @apiParam  {String{..128}}      [name]    User's name
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  name       User's name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 422)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   */
  .patch(
    authorize(),
    trimRequest.all,
    validate.updateProfile,
    controller.update
  );

/**
 * @api {get} v1/profile/change-password Change Password
 * @apiDescription Change Password of the logged in user
 * @apiVersion 1.0.0
 * @apiName ChangePassword
 * @apiGroup Profile
 * @apiPermission user
 *
 * @apiHeader {String} Authorization   User's access token
 *
 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Users can access the data
 */
router.get(
  "/change-password",
  authorize(),
  trimRequest.all,
  validate.changePassword,
  controller.changePassword
);

module.exports = router;
