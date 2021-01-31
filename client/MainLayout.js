import { Entities } from '../imports/api/entities.js';
import { UserSettings } from '../imports/api/userSettings.js';

Template.MainLayout.onCreated(function() {
    this.subscribe("activeEntities");
    this.subscribe("activeUserSettings");
});

Template.MainLayout.helpers({
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Accounts.onLogin(function() {
    let myId = Meteor.userId();
    // console.log('User ID Found onLogin: ' + myId);

    // as we start up and log in, we need to see if my last setting
    // set the UI in a certain way with any dispatch widgets popped out.
    
    if (Roles.userIsInRole(myId, ['GlobalAdmin'])) {
        if (typeof Meteor.users.findOne(myId).profile == 'undefined' || Meteor.users.findOne(myId).profile.usersEntity == "") {
            setTimeout(function() {
                let myId = Meteor.userId();
                // console.log("myId = " + myId);
                if (typeof Meteor.users.findOne(myId).profile == 'undefined' || Meteor.users.findOne(myId).profile.usersEntity == "") {
                    FlowRouter.go('/user/selectAnAgency');
                } else {
                    let myEntity = Meteor.users.findOne(myId).profile.usersEntity;
                    // console.log("myEntity = " + myEntity);
                    let entityInfo = Entities.findOne({ entityName: myEntity });
                    // console.log(entityInfo);
                    let isGlobal = entityInfo.globalEntity;
                    // console.log('Global Entity for user: ' + isGlobal);
                    if (isGlobal == true) {
                        Session.set("myEntityGlobal", true);
                    } else {
                        Session.set("myEntityGlobal", false);
                    }
    
                    Session.set("myEntity", myEntity);
                    Session.set("myParentEntity", myParentEntity);
                    // console.log("Logged In Entity: " + myEntity);
                }
            }, 1000);
        } else {
            let myId = Meteor.userId();
            let myEntity = Meteor.users.findOne(myId).profile.usersEntity;
            // console.log("Users Entity = " + myEntity);
    
            setTimeout(function() {
                let entityInfo = Entities.findOne({ entityName: myEntity });
                // console.log(entityInfo);
                let myParentEntity = entityInfo.entityParent;
                let isGlobal = entityInfo.globalEntity;
                // console.log('Global Entity for user: ' + isGlobal);
                if (isGlobal == true) {
                    Session.set("myEntityGlobal", true);
                } else {
                    Session.set("myEntityGlobal", false);
                }
                Session.set("myEntity", myEntity);
                Session.set("myParentEntity", myParentEntity);
                // console.log("Logged In Entity: " + myEntity);
                return;
            }, 1000);
        }
    } else if (typeof Meteor.users.findOne(myId).profile == 'undefined' || Meteor.users.findOne(myId).profile.usersEntity == "") {
            setTimeout(function() {
                let myId = Meteor.userId();
                // console.log("myId = " + myId);
                if (typeof Meteor.users.findOne(myId).profile == 'undefined' || Meteor.users.findOne(myId).profile.usersEntity == "") {
                    FlowRouter.go('/user/selectAnAgency');
                } else {
                    let myEntity = Meteor.users.findOne(myId).profile.usersEntity;
                    // console.log("myEntity = " + myEntity);
                    let entityInfo = Entities.findOne({ entityName: myEntity });
                    // console.log(entityInfo);
                    let isGlobal = entityInfo.globalEntity;
                    // console.log('Global Entity for user: ' + isGlobal);
                    if (isGlobal == true) {
                        Session.set("myEntityGlobal", true);
                    } else {
                        Session.set("myEntityGlobal", false);
                    }
    
                    Session.set("myEntity", myEntity);
                    Session.set("myParentEntity", myParentEntity);
                    // console.log("Logged In Entity: " + myEntity);
                }
            }, 1000);
    } else {
        let myEntity = Meteor.users.findOne(Meteor.userId).profile.usersEntity;
        // console.log("Users Entity = " + myEntity);

        setTimeout(function() {
            let entityInfo = Entities.findOne({ entityName: myEntity });
            // console.log(entityInfo);
            let myParentEntity = entityInfo.entityParent;
            let isGlobal = entityInfo.globalEntity;
            // console.log('Global Entity for user: ' + isGlobal);
            if (isGlobal == true) {
                Session.set("myEntityGlobal", true);
            } else {
                Session.set("myEntityGlobal", false);
            }
            Session.set("myEntity", myEntity);
            Session.set("myParentEntity", myParentEntity);
            // console.log("Logged In Entity: " + myEntity);
            return;
        }, 500);
    }
});

Template.MainLayout.events({
    "click #main" (event) {
        $(".context-menu").hide();
        $('.dispo-menu').hide();
    },
});
