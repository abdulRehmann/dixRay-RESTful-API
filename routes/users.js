const express = require("express");
const mysql = require("mysql");
const helpers = require("../helpers/users");
const messagesHelpers = require("../helpers/messages");

const router = express.Router();

router.post("/v1/users/:id", async (req, res) => {
  console.log("/********** Trying to create a new user");

  // save return value given by function
  let user = await helpers.checkUserExists(req.params.id);

  // If isn't empty then it means that user exists
  if (user != null) {
    res.sendStatus(404);
  } else {
    // Create user because user didn't exist.
    await helpers.addNewUser(req.params.id, {
      Name: req.body["Name"],
      Address: req.body["Address"],
      Phone: req.body["Phone"],
      Password: req.body["Password"],
      Quiz: 0,
      Accumulative_Points: 0,
      Status: "Unblock",
      Quiz_Status: false
    });
    // Create new chat.
    await messagesHelpers.creteNewChat(req.params.id);
    res.sendStatus(200);
  }
});

router.get("/v1/users/:id", async (req, res) => {
  console.log("/********** Fetching user with id: " + req.params.id);

  // save return value given by function
  let email = await helpers.checkUserExists(req.params.id);

  // save return value given by function
  let getUserInfo = await helpers.getUserInfo(req.params.id);

  switch (req.headers["operation"]) {
    case "profile":
      res.send(getUserInfo);
      break;
    default:
      // If isn't empty then it means that user exists
      if (
        email != null &&
        getUserInfo["Password"] == req.headers["operation"]
      ) {
        if (getUserInfo["Status"] == "Unblock") {
          res.sendStatus(200);
        } else {
          res.sendStatus(409);
        }
      } else {
        res.sendStatus(404);
      }
  }
  console.log(req.params.id, req.headers.password);
  res.end();
});

router.get("/v1/users", async (req, res) => {
  console.log("/********** Fetching all users");

  // get all users
  let getAllUsers = await helpers.getAllUsers();

  res.send(getAllUsers);
});

router.patch("/v1/users/:id", async (req, res) => {
  console.log("/********** Updating user with id: " + req.params.id);

  // vraiables declaration area
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  console.log(keys[0] + values[0]);

  switch (keys[0]) {
    case "Quiz":
      await helpers.updateUser(req.params.id, "Quiz", values);
      break;
    case "Earning":
      let user = await helpers.getUserInfo(req.body["email"]);
      let points = user["Accumulative_Points"] + values[0];
      await helpers.updateUser(req.params.id, "Accumulative_Points", points);
      break;
    case "status":
      await helpers.updateUser(req.params.id, "Status", values[0]);
      break;
    default:
      "";
  }
  res.sendStatus(200);
});

module.exports = router;
