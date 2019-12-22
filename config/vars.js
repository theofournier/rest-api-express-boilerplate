const path = require("path");

// import .env variables
require("dotenv-safe").config({
  allowEmptyValues: true
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  refreshTokenExpirationInterval: process.env.REFRESH_TOKEN_EXPIRATION_DAYS,
  passwordResetTokenExpirationInterval:
    process.env.PASSWORD_RESET_TOKEN_EXPIRATION_HOURS,
  loginAttempts: process.env.LOGIN_ATTEMPTS,
  hoursToBlock: process.env.HOURS_TO_BLOCK,
  mongo: {
    uri:
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TESTS
        : process.env.MONGO_URI
  },
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
  emailConfig: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD
  },
  redis: {
    useRedis: process.env.USE_REDIS,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    defaultTtl: process.env.REDIS_DEFAULT_TTL,
    namespace: process.env.REDIS_NAMESPACE
  }
};
