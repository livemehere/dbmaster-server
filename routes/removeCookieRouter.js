const express = require("express");
const router = express.Router();

router.get("/removeCookie", (req, res) => {
  res.clearCookie("userID");
  res.clearCookie("userPW");
  res.json("auto login removed");
});

module.exports = router;
