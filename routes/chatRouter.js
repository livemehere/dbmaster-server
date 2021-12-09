var express = require("express");
var router = express.Router();

router.get("/chat", function (req, res, next) {
  const userID = req.cookies.userID;
  const userPW = req.cookies.userPW;

  if (userID && userPW) {
    res.render("mypage", { id: userID });
  } else {
    res.render("chat");
  }
});

module.exports = router;
