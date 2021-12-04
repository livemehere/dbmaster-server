var express = require("express");
var router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

router.post("/resetPw", function (req, res, next) {
  const userid = req.body.userid;
  const userpw = req.body.userpw;

  //비밀번호를 암호화함
  const encryptedPW = bcrypt.hashSync(userpw, 10); //비밀번호 암호화
  console.log(encryptedPW);

  db.query(
    `UPDATE ch_user SET password='${encryptedPW}' WHERE id='${userid}'`,
    function (error, results, fields) {
      // TODO: 기본에러처리
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.json("비밀번호 변경성공");
    }
  );
});

module.exports = router;
