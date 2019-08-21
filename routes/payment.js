const express = require("express");
const mysql = require("mysql");

const router = express.Router();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  database: "mydb"
});

function getConnection() {
  return pool;
}

router.post("/v1/payments", (req, res) => {
  console.log("/********** Trying to create a new payment");
  res.end();
});

router.get("/v1/payments/:id", (req, res) => {
  console.log("/********** Fetching single payment");
  res.end();
});

router.patch("/v1/payments/:id", (req, res) => {
  console.log("/********** Updating payment: " + req.params.price);
  res.end();
});

module.exports = router;
