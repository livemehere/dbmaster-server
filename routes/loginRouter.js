var express = require("express");
var router = express.Router();

router.post("/login", function (req, res, next) {
  res.json("OK");
});

module.exports = router;
