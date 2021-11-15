const express = require("express");
const router = express.Router();
// const db = require("../config/db");

router.get("/sampledata", async (req, res, next) => {
  res.json({ response: true });
});

module.exports = router;
