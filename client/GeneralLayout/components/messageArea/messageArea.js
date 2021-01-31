import { Messages } from '../../../../imports/api/messages.js';
import { Entities } from '../../../../imports/api/entities.js';

Template.messageArea.onCreated(function() {
    this.subscribe("messageUsers");
    this.subscribe("activeEntities");
    this.subscribe("myMessages");
});

Template.messageArea.onRendered(function() {
    Session.set("messageUserClicked", "");
    $('input#messageInput').characterCounter();
});

Template.messageArea.helpers({
    convoWith: function() {
        let convoUserId = Session.get("messageUserClicked");
        if (convoUserId == "" || convoUserId == null) {
            return false;
        } else {
            let convoUser = Meteor.users.findOne({ _id: convoUserId }).username;
            if (typeof convoUser == 'undefined' || convoUser == "" || convoUser == null) {
                // check to see if the convoUser ID is from an Entity instead.
                let convoUser = Entities.findOne({ _id: convoUserId }).entityName;
                Session.set("receiverName", convoUser);
                Session.set("convoType", "Group");
                return convoUser;
            } else {
                Session.set("receiverName", convoUser);
                Session.set("convoType", "individual");
                return convoUser;
            }

        }
    },
    convoInfo: function() {
        let convoUserId = Session.get("messageUserClicked");
        let myId = Meteor.userId();
        if (typeof convoUserId == 'undefined' || convoUserId == null || convoUserId == "") {
            return;
        } else {
            console.log("My id= " + myId + " and Receiver Id = " + convoUserId);
            return Messages.find({ $or: [{ senderId: myId, receiverId: convoUserId }, { receiverId: myId, senderId: convoUserId }]});
        }
    },
    messageAddedAt: function() {
        let dateAdded = this.addedOn;
        let dateAddedFormat = moment(dateAdded).fromNow();
        return dateAddedFormat;
    },
});

Template.messageArea.events({
    'click .sendMessageOut' (event) {
        event.preventDefault();

        sendMessageNow();
    },
    'keyup #messageInput' (event) {
        if (event.which == 13 || event.keyCode == 13) {
            sendMessageNow();
        }
    },
});

let sendMessageNow = function() {
    let myId = Meteor.userId();
    console.log("My Id = " + myId);
    let sender = Meteor.user().username;

    let messageText = $("#messageInput").val();
    if (typeof messageText == 'undefined' || messageText == null || messageText == "") {
        showSnackbar("Enter a message before trying to send.", "orange");
        return;
    }

    let convoId = Session.get("messageUserClicked");
    if (typeof convoId == 'undefined' || convoId == "" || convoId == null) {
        showSnackbar("You need to pick a user or group to chat with.", "orange");
        return;
    } else {
        console.log("Convo Id = " + convoId);
        console.log("Send button clicked.");

        let type = Session.get("convoType");

        if (myId == convoId) {
            showSnackbar("You can't message yourself.", "red");
        } else {
            let receiver = Session.get("receiverName");
            Meteor.call('message.insert', type, sender, myId, receiver, convoId, messageText, false, false, function(err, result) {
                if (err) {
                    console.log("Error sending message: " + err);
                    showSnackbar("Error Sending Message!", "red");
                    Meteor.call("Log.Errors", "messageArea.js", "click sendMessage", err);
                } else {
                    showSnackbar("Message Sent!", "green");
                    $("#messageInput").val('');
                }
            });
            return;
        }
    }
}

Tracker.autorun(function() {
    let convoUserId = Session.get("messageUserClicked");
    let myId = Meteor.userId();
    Messages.find({ $or: [{ senderId: myId, receiverId: convoUserId }, { receiverId: myId, senderId: convoUserId }]}).observeChanges({
        added: function(id, fields) {
            Tracker.afterFlush(function () {
                var objDiv = document.getElementById("messageViewing");
                objDiv.scrollTop = objDiv.scrollHeight;
            });
        },
        changed: function(id, fields) {
            Tracker.afterFlush(function () {
                var objDiv = document.getElementById("messageViewing");
                objDiv.scrollTop = objDiv.scrollHeight;
            });
        },
    });
});
