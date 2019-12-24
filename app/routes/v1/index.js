const express = require("express");
const authRoutes = require("./auth.route");
const usersRoutes = require("./users.route");

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

router.post("/generate-query", (req, res) => {
  res.send(Buffer.from(JSON.stringify(req.body)).toString("base64"));
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);

module.exports = router;
