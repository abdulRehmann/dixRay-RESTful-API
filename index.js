// load our app server using express...
const cool = require("cool-ascii-faces");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3000;
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());

app.use(express.static("./public"));

app.use(morgan("short"));

app.use(express.static(path.join(__dirname, 'images')));

/* ***************************** Start - Routes *************************************** */
/* ************************************************************************************ */

const users = require("./routes/users");
const messages = require("./routes/messages");
const payment = require("./routes/payment");
const images = require("./routes/images");
app.use(users);
app.use(messages);
app.use(payment);
app.use(images);

/* ***************************** End - Routes ***************************************** */
/* ************************************************************************************ */

app.get("/", (req, res) => {
  console.log("Responding to root route");
  res.send("Hello from Root");
});

app.listen(PORT, () => {
  console.log("Server is up and listening on: " + PORT);
});