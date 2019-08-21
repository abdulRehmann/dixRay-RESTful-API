const express = require("express");
const database = require("../database.js");
const helpers = require("../helpers/messages");

const router = express.Router();

router.post("/v1/chats/rooms/goget", (req, res) => {
  console.log("/********** Insert data into room");
  const user = Object.keys(req.body)[0];

  // update message
  // let updateMessage = await helpers.updateUserMessages(user, req.body[user]);

  console.log(req.body);
  res.send("asdfsadf");
});

router.get("/v1/chats/rooms/:id", (req, res) => {
  console.log("/********** Fetching chat for: " + req.params.user);
  // create connection
  const connection = getConnection();
  // query
  const insertUserQuery = `SELECT * FROM ${"`room-" + req.params.id + "`"}`;
  // execution
  connection.query(insertUserQuery, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err);
      res.sendStatus(500);
      return;
    }
    // response : OK
    res.send(JSON.stringify(rows));
    // terminate response
    res.end();
  });
});

router.get("/v1/chats", async (req, res) => {
  console.log("/********** Fetching all chats");

  // create connection
  let emailsList = await helpers.getEmailFromMessages();

  console.log(emailsList);
  res.send(emailsList);
});

module.exports = router;
