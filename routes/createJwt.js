const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/dev_jwt", (req, res) => {
  console.log("create JWT");
  const token = jwt.sign(
    {
      user: "dev",
    },
    process.env.JWT_KEY,
    { expiresIn: "30d" } // m,h,d 단위로 설정가능
  );
  res.send(token);
});

module.exports = router;
