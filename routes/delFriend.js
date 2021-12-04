var express = require("express");
var router = express.Router();
const db = require("../config/db");

router.post("/delFriend", function (req, res, next) {
  const targetUserID = req.query.targetUserID;
  const sendUserID = req.query.sendUserID;

  //TODO: 인자들 필수로 입력받도록 하기
  if (!targetUserID || !sendUserID) {
    res.send("please send required element!");
    return;
  }

  db.query(
    `DELETE FROM ch_friend WHERE sendUser='${sendUserID}' AND receiveUser='${targetUserID}';`,
    function (error, results, fields) {
      // TODO: 기본에러처리
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.json("친구삭제완료");
    }
  );
});

module.exports = router;
