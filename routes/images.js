const express = require("express");
const database = require("../database.js");
const moment = require("moment");
const helpers = require("../helpers/images");
const helpersUsers = require("../helpers/users");

const router = express.Router();

router.post("/v1/images", (req, res) => {
  console.log("/********** Trying to upload new image");

  // Decalaration
  const currentDate = moment().format("YYYY-MM-DD");

  // Initialization
  let imageNameAndExtension = helpers.removeExtension(req.body["ImageName"]);
  // console.log(req.headers['operation']);
  // console.log(req.body);

  // read data
  let getDateDoc = database
    .collection(
      req.headers["operation"] == "Images"
        ? "Images"
        : req.headers["operation"] == "OK"
        ? "OK"
        : req.headers["operation"] == "NOT OK"
        ? "NOT OK"
        : "NOT OK M"
    )
    .doc(`${currentDate}`);
  let getDoc = getDateDoc
    .get()
    .then(doc => {
      if (!doc.exists) {
        switch (req.headers["operation"]) {
          case "Images":
            // write data
            helpers.writeNewImage(
              "Images",
              currentDate,
              Object.keys(imageNameAndExtension)[0],
              "?",
              `${[req.body["URL"]]}`,
              `${Object.values(imageNameAndExtension)[0]}`
            );
            break;
          case "OK":
            // write data
            helpers.writeNewImage(
              "OK",
              currentDate,
              Object.keys(imageNameAndExtension)[0],
              "OK",
              `${[req.body["URL"]]}`,
              `${Object.values(imageNameAndExtension)[0]}`
            );
            break;
          case "NOT OK":
            // write data
            helpers.writeNewImage(
              "NOT OK",
              currentDate,
              Object.keys(imageNameAndExtension)[0],
              "NOT OK",
              `${[req.body["URL"]]}`,
              `${Object.values(imageNameAndExtension)[0]}`
            );
            break;
          case "NOT OK M":
            // write data
            helpers.writeNewImage(
              "NOT OK M",
              currentDate,
              Object.keys(imageNameAndExtension)[0],
              "NOT OK M",
              `${[req.body["URL"]]}`,
              `${Object.values(imageNameAndExtension)[0]}`
            );
            break;
          default:
            "";
        }
      } else {
        switch (req.headers["operation"]) {
          case "Images":
            // write data
            helpers.updateImage(
              "Images",
              currentDate,
              Object.keys(imageNameAndExtension)[0],
              "?",
              `${[req.body["URL"]]}`,
              `${Object.values(imageNameAndExtension)[0]}`
            );
            break;
          case "OK":
            // write data
            helpers.updateImage(
              "OK",
              currentDate,
              Object.keys(imageNameAndExtension)[0],
              "OK",
              `${[req.body["URL"]]}`,
              `${Object.values(imageNameAndExtension)[0]}`
            );
            break;
          case "NOT OK":
            // write data
            helpers.updateImage(
              "NOT OK",
              currentDate,
              Object.keys(imageNameAndExtension)[0],
              "NOT OK",
              `${[req.body["URL"]]}`,
              `${Object.values(imageNameAndExtension)[0]}`
            );
            break;
          case "NOT OK M":
            // write data
            helpers.updateImage(
              "NOT OK M",
              currentDate,
              Object.keys(imageNameAndExtension)[0],
              "NOT OK M",
              `${[req.body["URL"]]}`,
              `${Object.values(imageNameAndExtension)[0]}`
            );
            break;
          default:
            "";
        }
      }
    })
    .catch(err => {
      console.log("Error getting document", err);
    });

  res.end();
});

router.post("/v1/images/reads", async (req, res) => {
  console.log("/********** Trying to upload new image");

  // get user info along read images
  let user = await helpersUsers.getUserInfo(req.headers["email"]);

  // merge currently provided images with the read images in past by the user
  let mergeImages = await helpers.mergeImages(
    req.body["images"],
    user["images"]
  );

  // update read images by user
  await helpers.updateReadImages(req.headers["email"], mergeImages);

  // update read images by user
  let images = await helpers.subtractImages(user["images"]);
  // console.log(mergeImages);

  res.send(images);
});

router.get("/v1/images", async (req, res) => {
  console.log("/********** Fetching images");

  switch (req.headers["operation"]) {
    case "userQuiz":
      // get all images
      let images = await helpers.getAllImages();
      // get random hundred images
      let randomizedImages = await helpers.randomizedImages(images);
      // get random hundred images
      let notOkImages = randomizedImages[1];
      // get random hundred images
      randomizedImages = randomizedImages[0];
      // get not ok marked images
      let getNotOkMImages = await helpers.getNotOkMImages(notOkImages);
      res.send({ randomizedImages, getNotOkMImages });
      break;
    case "userImages":
      // get user info along read images
      let user = await helpersUsers.getUserInfo(req.headers["email"]);
      // get all images
      let userImages = await helpers.subtractImages(user["images"]);
      console.log(userImages);
      res.send(userImages);
      break;
    default:
      // get all dates
      let dates = await helpers.getAllDates(
        req.headers["operation"] == "Images"
          ? "Images"
          : req.headers["operation"] == "OK"
          ? "OK"
          : req.headers["operation"] == "NOT OK"
          ? "NOT OK"
          : "NOT OK M"
      );

      // sort dates
      dates = helpers.sortDates(dates);

      // get doc of most recent date
      let mostRecentDatedDoc = await helpers.getDocForProvidedDate(
        dates[0],
        req.headers["operation"]
      );

      // final data
      let data = helpers.galleryData(dates, mostRecentDatedDoc);
      console.log(data);

      // send response back
      res.json(data);
  }
});

router.get("/v1/images/date", async (req, res) => {
  console.log("/********** Fetching images");

  // get doc of given date
  let providedDateDoc = await helpers.getDocForProvidedDate(
    req.headers.date,
    req.headers["operation"]
  );

  // final data
  let data = helpers.galleryData([req.headers.date], providedDateDoc);
  console.log(data);

  res.send(data);
});

router.patch("/v1/images/status", async (req, res) => {
  console.log("/********** Fetching images");

  // update image status
  let imageStatus = helpers.updateImageStatus(
    req.body["Date"],
    req.body["ImageName"],
    req.body["Status"],
    req.headers["operation"] == "Images" ? "Images" : "Quiz"
  );
  res.json({ ddd: "asdaf" });
});

router.patch("/v1/images", (req, res) => {
  console.log("/********** Updating images");
  res.end();
});

module.exports = router;
