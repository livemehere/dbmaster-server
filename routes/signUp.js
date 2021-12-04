var express = require("express");
var router = express.Router();
const db = require("../config/db");

router.post("/signUp", function (req, res, next) {
  const userid = req.body.userid;
  const userpw = req.body.userpw;
  const username = req.body.username;
  const usernickname = req.body.usernickname;
  //유저 주소
  const postcode = req.body.postcode;
  const address = req.body.address;
  const detailAddress = req.body.detailAddress;
  const extraAddress = req.body.extraAddress;
  //유저 프로필 사진 URL
  const profileURL = req.body.profileURL;
  const statusMsg = "신규유저";

  db.query(
    `INSERT INTO ch_user VALUES('${userid}','${userpw}','${username}','${usernickname}','${userid}${profileURL}',default,'${statusMsg}','${postcode}','${address}','${extraAddress}','${detailAddress}');`,
    function (error, results, fields) {
      // TODO: 기본에러처리
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.json("회원가입성공");
    }
  );
});

module.exports = router;
