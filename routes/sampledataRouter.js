const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/sampledata", async (req, res, next) => {
  db.query("SELECT * FROM Student", function (err, rows, fields) {
    if (err) throw err;
    res.send(rows);
  });
});

module.exports = router;
