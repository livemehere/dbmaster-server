var express = require("express");
var router = express.Router();
const db = require("../config/db");

router.get("/getAllUser", function (req, res, next) {
  db.query(`SELECT * FROM ch_user;`, function (error, results, fields) {
    // TODO: 기본에러처리
    if (error) {
      res.status(400).send(error);
      return;
    }
    res.send(results);
  });
});

module.exports = router;
