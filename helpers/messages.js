const database = require("../database.js");

// create new chat
const creteNewChat = async (email = "") => {
  await database
    .collection("Messages")
    .doc(email)
    .set({ messages: [] })
    .then(function() {
      console.log("Chat successfully created!");
    })
    .catch(err => {
      console.log("Error creating chat", err);
    });
};

// get list of emails from messages
const getEmailFromMessages = async () => {
  let emails = [];
  await database
    .collection("Messages")
    .listDocuments()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        emails.push(doc.id);
      });
    })
    .catch(err => {
      console.log("Error getting emails", err);
    });
  return emails;
};

// post new message
const updateUserMessages = async (user = "", message = "") => {
  await database
    .collection("Messages")
    .doc(user)
    .update({ messages: [{ [user]: `${message}` }] })
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
};

exports.creteNewChat = creteNewChat;
exports.getEmailFromMessages = getEmailFromMessages;
exports.updateUserMessages = updateUserMessages;
