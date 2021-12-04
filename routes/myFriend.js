var express = require("express");
var router = express.Router();
const db = require("../config/db");

router.get("/myFriend", function (req, res, next) {
  const userID = req.query.userID;
  //TODO: 인자들 필수로 입력받도록 하기
  if (!userID) {
    res.send("please send required element!");
    return;
  }
  //해당 유저의 친구들의 정보를 다가져옴
  db.query(
    `SELECT * FROM ch_user WHERE id IN ( SELECT receiveUser FROM ch_friend WHERE sendUser='${userID}');`,
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
