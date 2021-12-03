var express = require("express");
var router = express.Router();
const db = require("../config/db");

router.get("/loadAllMsgData", function (req, res, next) {
  const userID = req.query.userID;

  //TODO: 인자들 필수로 입력받도록 하기
  if (!userID) {
    res.send("please send required element!");
    return;
  }

  db.query(
    `SELECT * FROM ch_message WHERE targetUserID='${userID}' OR sendUserID='${userID}';`,
    function (error, results, fields) {
      // TODO: 기본에러처리
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.send(results);
    }
  );
});

module.exports = router;
