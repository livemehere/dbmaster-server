const express = require("express");
const router = express.Router();
const axios = require("axios");
// const db = require("../config/db");

router.post("/uploadImg/:userID", async (req, res, next) => {
  res.send("success!");
});

module.exports = router;
