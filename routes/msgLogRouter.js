var express = require("express");
var router = express.Router();
const db = require("../config/db");

router.get("/msgLog", function (req, res, next) {
  const targetUserID = req.query.targetUserID;
  const sendUserID = req.query.sendUserID;

  //TODO: 인자들 필수로 입력받도록 하기
  if (!targetUserID || !sendUserID) {
    res.send("please send required element!");
    return;
  }
  db.query(
    `SELECT * FROM ch_message WHERE targetUserID='${targetUserID}' and sendUserID='${sendUserID}' OR targetUserID='${sendUserID}' and sendUserID='${targetUserID}' ORDER BY timestamp;`,
    function (error, results, fields) {
      // TODO: 기본에러처리
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.send(results);
    }
  );

  db.query(
    `UPDATE ch_message SET isRead=0 WHERE targetUserID='${targetUserID}' AND sendUserID='${sendUserID}';`,
    function (error, results, fields) {
      // TODO: 기본에러처리
      if (error) {
        res.status(400).send(error);
        return;
      }
    }
  );
});

module.exports = router;
