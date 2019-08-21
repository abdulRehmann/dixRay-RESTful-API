const database = require("../database.js");
const helpersUsers = require("../helpers/users");

// split image name and extension
const removeExtension = (name = "") => {
  name = name.split(".");
  return { [name[0]]: name[1] };
};

// write new image
const writeNewImage = (
  collection = "",
  currentDate = "",
  imageName = "",
  status = "",
  url = "",
  extension = ""
) => {
  database
    .collection(collection)
    .doc(currentDate)
    .set({
      [imageName]: {
        Status: status,
        URL: url,
        Extension: extension,
        Selected: false
      }
    })
    .then(() => {
      // console.log("new user added");
    });
};

// update new image
const updateImage = (
  collection = "",
  currentDate = "",
  imageName = "",
  status = "",
  url = "",
  extension = ""
) => {
  database
    .collection(collection)
    .doc(currentDate)
    .update({
      [imageName]: {
        Status: status,
        URL: url,
        Extension: extension,
        Selected: false
      }
    })
    .then(() => {
      // console.log("new user added");
    });
};

// get all dates in images collection
const getAllDates = async (operation = "") => {
  let dates = [];
  await database
    .collection(operation)
    .listDocuments()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        dates.push(doc.id);
      });
    })
    .catch(err => {
      console.log("Error getting document", err);
    });
  return dates;
};

// sort dates
const sortDates = (dates = []) => {
  dates = dates
    .sort(function compare(a, b) {
      // console.log(a, b);
      var dateA = new Date(a);
      var dateB = new Date(b);
      return dateA - dateB;
    })
    .reverse();
  return dates;
};

// get doc for provided date
const getDocForProvidedDate = async (date = "", operation = "") => {
  let markers = [];
  console.log(date, operation);
  await database
    .collection(operation)
    .doc(`${date}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log("No document exists");
      } else {
        markers.push(doc.data());
      }
    })
    .catch(err => {
      console.log("Error getting document", err);
    });
  return markers;
};

// get doc for provided date
const galleryData = (dates = [], mostRecentDatedDoc = []) => {
  let data = new Array();
  data = dates.map((date, index) => {
    return index === 0
      ? {
          [date]: Object.keys(mostRecentDatedDoc[0]).map(imageName => {
            return { [imageName]: mostRecentDatedDoc[0][imageName] };
          })
        }
      : { [date]: [] };
  });
  return data;
};

// get doc for provided date
const updateImageStatus = async (
  Date = "",
  ImageName = "",
  Status = "",
  operation = ""
) => {
  await database
    .collection(operation)
    .doc(Date)
    .update({
      [ImageName + ".Status"]: `${Status}`
    })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
};

// get all docs inside images collection
const getCollectionImages = async (collection = "") => {
  let images = [];
  await database
    .collection(collection)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let keys = {};
        keys = Object.keys(doc.data());
        keys.map(key => {
          images.push({
            ImageName: `${key}`,
            URL: doc.data()[key]["URL"],
            Status: doc.data()[key]["Status"]
          });
        });
      });
    });
  return images;
};

// get all docs inside images collection
const getAllImages = async () => {
  let images = [],
    ok = [],
    notOk = [];
  ok = await getCollectionImages("OK");
  notOk = await getCollectionImages("NOT OK");

  images = await mergeImages(notOk, ok);

  return images;
};

// write read images by a user
const getNotOkMImages = async (notOk = []) => {
  let markedImages = [];
  let lastImage = "";
  let notOkM = await getCollectionImages("NOT OK M");
  notOk != undefined
    ? notOkM.forEach(notOkMImage => {
        notOk.forEach(notOkImage => {
          if (notOkMImage["ImageName"] == notOkImage["ImageName"]) {
            if (markedImages.length > 0) {
              markedImages.forEach(markedImage => {
                if (
                  lastImage != notOkImage["ImageName"]
                ) {
                  lastImage = notOkMImage["ImageName"];
                  markedImages.push(notOkMImage);
                }
              });
            } else {
              lastImage = notOkMImage["ImageName"];
              markedImages.push(notOkMImage);
            }
          }
        });
      })
    : undefined;
  return markedImages;
};

// get hundred images for quiz
const randomizedImages = async (images = []) => {
  let randomImages = [],
    notOk = [];
  for (let i = 0; i < 100; i++) {
    let currentImg = images[Math.floor(Math.random() * images.length)];
    if (currentImg["Status"] == "NOT OK") {
      randomImages.push(currentImg);
      notOk.push(currentImg);
    } else {
      randomImages.push(currentImg);
    }
  }
  return [randomImages, notOk];
};

// write read images by a user
const mergeImages = async (currentImages = [], previousImages = []) => {
  let images = previousImages.concat(currentImages);
  return images;
};

// write read images by a user
const updateReadImages = async (email = "", images = []) => {
  await database
    .collection("Users")
    .doc(email)
    .update({ images: images })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
};

// write read images by a user
const subtractImages = async (images = []) => {
  let allImages = await getCollectionImages("Images");
  // console.log(images.length);
  images != undefined
    ? images.forEach(userImage => {
        allImages.forEach(image => {
          image["ImageName"] == userImage["ImageName"] && allImages.pop(image);
        });
      })
    : false;
  // console.log(images.length);
  return allImages;
};

exports.removeExtension = removeExtension;
exports.writeNewImage = writeNewImage;
exports.updateImage = updateImage;
exports.getCollectionImages = getCollectionImages;
exports.getAllDates = getAllDates;
exports.sortDates = sortDates;
exports.getDocForProvidedDate = getDocForProvidedDate;
exports.galleryData = galleryData;
exports.updateImageStatus = updateImageStatus;
exports.getAllImages = getAllImages;
exports.getNotOkMImages = getNotOkMImages;
exports.randomizedImages = randomizedImages;
exports.mergeImages = mergeImages;
exports.updateReadImages = updateReadImages;
exports.subtractImages = subtractImages;

// notOk.forEach(notOkImage => {
//   notOkM.forEach(notOkMImage => {
//     if (notOkMImage["ImageName"] == notOkImage["ImageName"]) {
//       // if (markedImages.length > 0) {
//       //   markedImages.forEach(markedImage => {
//       //     if (markedImage["ImageName"] != notOkImage["ImageName"]) {
//       //       markedImages.push(notOkMImage);
//       //     }
//       //   });
//       // } else {
//       //   markedImages.push(notOkMImage);
//       // }
//       markedImages.push(notOkMImage);
//     }
//   });
// })
