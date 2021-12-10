var express = require("express");
var router = express.Router();
const db = require("../config/db");

router.post("/saveMsg", function (req, res, next) {
  const payload = req.body.payload;
  const targetUserID = req.body.targetUserID;
  const sendUserID = req.body.sendUserID;
  const timestamp = req.body.timestamp;
  const isRead = req.body.isRead;

  //TODO: 인자들 필수로 입력받도록 하기
  if (!payload || !targetUserID || !sendUserID || !timestamp || !isRead) {
    res.send("please send required element!");
    return;
  }
  console.log(">>>>>");
  console.log(payload);

  db.query(
    `INSERT INTO ch_message VALUES(default,'${payload}','${targetUserID}','${sendUserID}',${timestamp},${isRead});`,
    function (error, results, fields) {
      // TODO: 기본에러처리
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.send({ res: true, msg: "저장성공" });
    }
  );
});

module.exports = router;
