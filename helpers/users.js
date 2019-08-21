const database = require("../database.js");

// add new user
const addNewUser = async (email, data) => {
  await database
    .collection("Users")
    .doc(email)
    .set(data)
    .then(function() {
      console.log("User successfully created!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error creating user: ", error);
    });
};

// check user exists
const checkUserExists = async email => {
  const users = await getAllUsers();
  // Comparing the new email with the other users email address.
  let user = await users.find(user => {
    return Object.keys(user)[0] == email;
  });
  return user;
};

// get doc of a user
const getUserInfo = async (email = "") => {
  let user = {};
  await database
    .collection("Users")
    .doc(email)
    .get()
    .then(querySnapshot => {
      user = querySnapshot.data();
    });
  return user;
};

// get docs of all users
const getAllUsers = async () => {
  let users = [];
  await database
    .collection("Users")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(function(doc) {
        users.push({ [doc.id]: doc.data() });
      });
    });
  return users;
};

// update doc for provided user
const updateUser = async (user = "", fieldKey = "", fieldValue = "") => {
  console.log(user, fieldKey, fieldValue);
  await database
    .collection("Users")
    .doc(user)
    .update(
      fieldKey == "Quiz"
        ? {
            [fieldKey]: fieldValue[0]
          }
        : {
            [fieldKey]: fieldKey == "Status" ? `${fieldValue}` : fieldValue
          }
    )
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
};

exports.addNewUser = addNewUser;
exports.checkUserExists = checkUserExists;
exports.getUserInfo = getUserInfo;
exports.getAllUsers = getAllUsers;
exports.updateUser = updateUser;
