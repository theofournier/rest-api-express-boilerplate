const httpStatus = require("http-status");
const passport = require("passport");
const User = require("../models/user");
const APIError = require("../utils/APIError");
const { authErrorMessages, auth } = require("../utils/constants");

const ADMIN = auth.ADMIN;
const LOGGED_USER = auth.LOGGED_USER;

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : authErrorMessages.UNAUTHORIZED,
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined
  });

  try {
    if (error || !user) throw error;
    await logIn(user, { session: false });
  } catch (e) {
    if (e.message === "jwt expired")
      apiError.message = authErrorMessages.ACCESS_TOKEN_EXPIRED;
    if (e.message === "No auth token")
      apiError.message = authErrorMessages.ACCESS_TOKEN_REQUIRED;
    return next(apiError);
  }

  if (roles === LOGGED_USER) {
    if (user.role !== ADMIN && req.params.id !== user._id.toString()) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = authErrorMessages.FORBIDDEN;
      return next(apiError);
    }
  } else if (!roles.includes(user.role)) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = authErrorMessages.FORBIDDEN;
    return next(apiError);
  } else if (err || !user) {
    return next(apiError);
  }

  req.user = user;

  return next();
};

exports.authorize = (roles = User.roles) => (req, res, next) =>
  passport.authenticate(
    "jwt",
    { session: false },
    handleJWT(req, res, next, roles)
  )(req, res, next);

exports.oAuth = service => passport.authenticate(service, { session: false });
