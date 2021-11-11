var express = require("express");
var router = express.Router();

router.post("/chat", function (req, res, next) {
  res.send("post요청성공했어임마");
});

module.exports = router;
