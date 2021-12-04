var express = require("express");
var router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

router.post("/login", function (req, res, next) {
  const userId = req.body.id;
  const userPw = req.body.pw;

  //TODO: 인자들 필수로 입력받도록 하기
  if (!userId || !userPw) {
    res.send("please send required element!");
    return;
  }

  db.query(
    `SELECT password FROM ch_user WHERE id='${userId}'`,
    function (error, results, fields) {
      // TODO: 기본에러처리
      if (error) {
        res.send(error);
        return;
      }
      // TODO: 아이디가 존재하지 않을경우
      if (!results[0]) {
        res.send({ res: false, msg: "존재하지않는 ID입니다" });
        return;
      }

      bcrypt.compare(userPw, results[0].password, (err, same) => {
        console.log(same); //=> true
        if (same) {
          res.send({ res: true, msg: "login success" });
        } else {
          res.send({ res: false, msg: "비밀번호가 맞지 않습니다" });
        }
      });
    }
  );
});

module.exports = router;
