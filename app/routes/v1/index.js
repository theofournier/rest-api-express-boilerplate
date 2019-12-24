const express = require("express");
const trimRequest = require("trim-request");

const { authorize } = require("../../middlewares/auth");

const authRoutes = require("./auth.route");
const usersRoutes = require("./users.route");
const profileRoutes = require("./profile.route");

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

router.post("/generate-query", authorize(), trimRequest.all, (req, res) => {
  res.send(Buffer.from(JSON.stringify(req.body)).toString("base64"));
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/profile", profileRoutes);

module.exports = router;
