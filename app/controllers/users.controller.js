const httpStatus = require("http-status");
const { matchedData } = require("express-validator");
const { omit } = require("lodash");

const { parseMongoQuery } = require("../utils/utils");
const User = require("../models/user");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const users = await User.list(parseMongoQuery(data.q));
    const transformedUsers = users.map(user => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const user = new User(data);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(matchedData(req));
    const ommitRole = user.role !== "admin" ? "role" : "";
    const newUserObject = omit(newUser.toObject(), "_id", ommitRole);

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const ommitRole = req.locals.user.role !== "admin" ? "role" : "";
    const updatedUser = omit(matchedData(req), ommitRole);
    const user = Object.assign(req.locals.user, updatedUser);

    const savedUser = await user.save();
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(e));
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const { user } = req.locals;
    await user.remove();
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};
