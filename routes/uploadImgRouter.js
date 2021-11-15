const express = require("express");
const router = express.Router();
const axios = require("axios");
// const db = require("../config/db");

router.post("/uploadImg", async (req, res, next) => {
  res.send("Image upload success!");
});

module.exports = router;
