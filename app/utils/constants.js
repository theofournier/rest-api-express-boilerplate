const validationErrorMessages = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  MISSING: "MISSING",
  IS_EMPTY: "IS_EMPTY",
  IS_NOT_STRING: "IS_NOT_STRING",
  IS_NOT_NUMERIC: "IS_NOT_NUMERIC",
  IS_NOT_DATE: "IS_NOT_DATE",
  IS_NOT_BASE64: "IS_NOT_BASE64",
  INVALID_SORT_ORDER: "INVALID_SORT_ORDER",
  INVALID_EMAIL: "INVALID_EMAIL",
  PAGE_MIN: "PAGE_MIN",
  PER_PAGE_MIN: "PER_PAGE_MIN",
  INVALID_ROLE: "INVALID_ROLE"
};

const authErrorMessages = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_NOT_FOUND_OR_ALREADY_VERIFIED: "USER_NOT_FOUND_OR_ALREADY_VERIFIED",
  EMAIL_REQUIRED: "EMAIL_REQUIRED",
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  PASSWORD_TOO_SHORT: "PASSWORD_TOO_SHORT",
  PASSWORD_REQUIRED: "PASSWORD_REQUIRED",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  INVALID_REFRESH_TOKEN: "INVALID_REFRESH_TOKEN",
  REFRESH_TOKEN_EXPIRED: "REFRESH_TOKEN_EXPIRED",
  REFRESH_TOKEN_REQUIRED: "REFRESH_TOKEN_REQUIRED",
  INVALID_ACCESS_TOKEN: "INVALID_ACCESS_TOKEN",
  ACCESS_TOKEN_REQUIRED: "ACCESS_TOKEN_REQUIRED",
  ACCESS_TOKEN_EXPIRED: "ACCESS_TOKEN_EXPIRED",
  RESET_TOKEN_REQUIRED: "RESET_TOKEN_REQUIRED",
  INVALID_RESET_TOKEN: "INVALID_RESET_TOKEN",
  RESET_TOKEN_EXPIRED: "RESET_TOKEN_EXPIRED",
  EMAIL_EXISTS: "EMAIL_EXISTS",
  LOGGED_WITH_SERVICES: "LOGGED_WITH_SERVICES",
  USER_BLOCKED: "USER_BLOCKED",
  TOO_MANY_ATTEMPTS: "TOO_MANY_ATTEMPTS",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND"
};

const auth = {
  ADMIN: "admin",
  USER: "user",
  LOGGED_USER: "_loggedUser"
};

const filtering = {
  OR: "$or",
  AFTER: "after",
  BEFORE: "before",
  REGEX: "regex",
  EQ: "eq",
  IN: "in",
  GT: "gt",
  LT: "lt",
  GTE: "gte",
  LTE: "lte",
  EXISTS: "exists"
};

const mongoQuery = {
  [filtering.OR]: "$or",
  [filtering.REGEX]: "$regex",
  [filtering.EQ]: "$eq",
  [filtering.IN]: "$in",
  [filtering.GT]: "$gt",
  [filtering.LT]: "$lt",
  [filtering.GTE]: "$gte",
  [filtering.LTE]: "$lte",
  [filtering.EXISTS]: "$exists"
};

module.exports = {
  validationErrorMessages,
  authErrorMessages,
  auth,
  filtering,
  mongoQuery
};
