const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compression = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const i18n = require("i18n");
const routes = require("../app/routes/v1");
const { logs, redis } = require("./vars");
const strategies = require("./passport");
const error = require("../app/middlewares/error");

/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// Redis cache enabled by env variable
if (redis.useRedis === "true") {
  const getExpeditiousCache = require("express-expeditious");
  const cache = getExpeditiousCache({
    namespace: redis.namespace,
    defaultTtl: redis.defaultTtl,
    engine: require("expeditious-engine-redis")({
      host: redis.host,
      port: redis.port
    })
  });
  app.use(cache);
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// i18n
i18n.configure({
  locales: ["en", "es"],
  directory: `${__dirname}/locales`,
  defaultLocale: "en",
  objectNotation: true
});
app.use(i18n.init);

// gzip compression
app.use(compression());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(passport.initialize());
passport.use("jwt", strategies.jwt);
passport.use("facebook", strategies.facebook);
passport.use("google", strategies.google);

// mount api v1 routes
app.use("/v1", routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
