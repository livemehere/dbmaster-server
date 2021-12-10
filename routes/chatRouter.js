var express = require("express");
var router = express.Router();

router.get("/chat", function (req, res, next) {
  const userID = req.cookies.userID;
  const userPW = req.cookies.userPW;

  if (userID && userPW) {
    res.render("chat", { autoID: userID, autoPW: userPW });
  } else {
    res.render("chat", { autoID: undefined, autoPW: undefined });
  }
});

module.exports = router;
