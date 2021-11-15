var express = require("express");
var router = express.Router();

router.get("/testsite", function (req, res, next) {
  res.render("testsite");
});

module.exports = router;
