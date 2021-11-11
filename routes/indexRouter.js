var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // console.log(req.cookies["kong"]); // 쿠키 불러오기, 쿠키는 항상 요청에 있음
  // res.cookie("kong", "love Ha"); //쿠키 저장하기
  res.render("index", { title: "Express" });
});

module.exports = router;
