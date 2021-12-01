var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/mypage/:id", function (req, res, next) {
  const id = req.params.id;
  res.render("mypage", { id });
});

module.exports = router;
