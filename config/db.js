const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.MYUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

try {
  connection.connect();
} catch (err) {
  console.log(err);
}

module.exports = connection;
