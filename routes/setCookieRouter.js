const express = require("express");
const router = express.Router();

router.get("/setCookie", (req, res) => {
  const userID = req.query.userID;
  const userPW = req.query.userPW;
  res.cookie("userID", userID);
  res.cookie("userPW", userPW);
  res.send("coockie");
});

module.exports = router;
