const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorization = async (req, res, next) => {
  // jwt.verify 는 마지막 콜백함수로써, error를 컨트롤 할 수 있다
  jwt.verify(req.query.token, process.env.JWT_KEY, (err, token) => {
    if (err) {
      // 토큰 해독에서 에러가발생하면(기간만료,이상한토큰...등) 에러이름 반환하고 더이상 진행하지 않는다
      res.send(err);
    } else {
      // 에러가 없다면, 다음 미들웨어로 넘어간다
      next();
    }
  });
};

module.exports = authorization;
