import { Messages } from '../../../../imports/api/messages.js';
import { Entities } from '../../../../imports/api/entities.js';


Template.messageUsersList.onCreated(function() {
    this.subscribe("messageUsers");
    this.subscribe("activeEntites");
    this.subscribe("myMessages");
});

Template.messageUsersList.onRendered(function() {
    $('.collapsible').collapsible();
});

Template.messageUsersList.helpers({
    msgUsers: function() {
        console.log("Entity Name: " + this.entityName);
        return Meteor.users.find({ "profile.usersEntity": this.entityName });
    },
    entityList: function() {
        return Entities.find({});
    },
    newMessage: function() {

    },
});

Template.messageUsersList.events({
    'click .msgUserName' (event) {
        event.preventDefault();

        let userClicked = this._id;
        console.log("User Clicked: " + userClicked);
        Session.set("messageUserClicked", userClicked);
    },
});

Tracker.autorun(function() {
    let convoUserId = Session.get("messageUserClicked");
    let myId = Meteor.userId();
    Messages.find({ receiverId: myId }).observeChanges({
        added: function(id, fields) {
            console.log("You have a new message.");

            // now add a notification next to the senders id,
            // next to the header the sender is under, and
            // in the header bar.
            
        },
        changed: function(id, fields) {
            console.log("You have a changed message.");
        },
    });
});
