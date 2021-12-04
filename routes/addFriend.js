var express = require("express");
var router = express.Router();
const db = require("../config/db");

router.post("/addFriend", function (req, res, next) {
  const targetUserID = req.query.targetUserID;
  const sendUserID = req.query.sendUserID;

  //TODO: 인자들 필수로 입력받도록 하기
  if (!targetUserID || !sendUserID) {
    res.send("please send required element!");
    return;
  }

  db.query(
    `INSERT INTO ch_friend VALUES('${sendUserID}','${targetUserID}');`,
    function (error, results, fields) {
      // TODO: 기본에러처리
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.send({ res: true, msg: "친구 추가 완료" });
    }
  );
});

module.exports = router;
