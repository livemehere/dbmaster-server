var express = require("express");
var router = express.Router();
const db = require("../config/db");

router.get("/getLastMsg", function (req, res, next) {
  const targetUserID = req.query.targetUserID;
  const sendUserID = req.query.sendUserID;

  //TODO: 인자들 필수로 입력받도록 하기
  if (!targetUserID || !sendUserID) {
    res.send("please send required element!");
    return;
  }

  db.query(
    `SELECT * FROM ch_message WHERE (targetUserID='${targetUserID}' AND sendUserID='${sendUserID}') OR (sendUserID='${targetUserID}' AND targetUserID='${sendUserID}') ORDER BY timestamp DESC LIMIT 1;`,
    function (error, results, fields) {
      // TODO: 기본에러처리
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.send(results[0]);
    }
  );
});

module.exports = router;
