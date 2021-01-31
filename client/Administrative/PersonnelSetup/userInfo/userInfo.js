import { Entities } from '../../../../imports/api/entities.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';

Template.userInfo.onCreated(function() {
    this.autorun(() => {
        this.subscribe('allUsers');
        this.subscribe('activeEntities');
        this.subscribe('errorLogs');
        this.subscribe('activeUserSettings');
    });
});

Template.userInfo.onRendered(function() {
    $('.tooltipped').tooltip({delay: 50});
    setTimeout(function() {
        $('select').formSelect();
    }, 500);
    if ((Session.get("mode")) == "edit") {
        Materialize.updateTextFields();
    }
});

Template.userInfo.helpers({
    userAwaitingVerification: function(){
        let myEntity = Session.get("myEntity");
        let isGlobalEntity = Session.get("myEntityGlobal");
        let myParentEntity = Session.get("myParentEntity");
        let entityArray = [];

        let entityInfo = Entities.find({ entityParent: myParentEntity }).fetch();
        if (typeof entityInfo != 'undefined' && entityInfo != null && entityInfo != "") {
            let entityCount = entityInfo.length;
            for (i = 0; i < entityCount; i++) {
                entityArray.push(entityInfo[i].entityName);
            }
        }

        // console.log('Personnel Global finding: ' + isGlobalEntity);
        if (typeof myEntity == 'undefined' || myEntity == null || myEntity == "") {
            return Meteor.users.find({});
        } else {
            if (isGlobalEntity == true) {
                return Meteor.users.find({ "profile.entityVerified": false });
            } else {
                return Meteor.users.find({ "profile.usersEntity": { $in: entityArray }, "profile.entityVerified": false });

            }
        }
    },
    userEmail: function() {
        return this.emails[0].address;
    },
    isAdmin: function() {
        return Roles.getRolesForUser( this._id );
    },
    myEntityIs: function() {
        return Session.get("myEntity");
    },
    myEntityIsGlobal: function() {
        let isGlobal = Session.get("myEntityGlobal");
        if (isGlobal == true) {
            return true;
        } else {
            return false;
        }
    },
    currVerifyMode: function() {
        return Session.get("verifyMode")
    },
    entitiesList: function() {
        return Entities.find({});
    },
    userPrefs: function() {
        let settings = UserSettings.findOne({});
        if (settings) {
            return settings;
        }
    },
});

Template.userInfo.events({
    'change .userEntityActions' (event) {
        let selAction = event.currentTarget.value;
        console.log('Action was: ' + selAction);

        if (selAction == 'edit') {
            Session.set("verifyMode", "edit");
            Meteor.setTimeout(function() {
                $('select').formSelect();

                Materialize.updateTextFields();
            }, 150)
        } else if (selAction == "saveChanges") {
            Session.set("verifyMode", "new");
            console.log('Changed to New');
            let entityName = Session.get("usersEntitySel");
            console.log('Entity Set will be: ' + entityName);

            // now add what to do when something is changed, and save
            Meteor.call('AddEntityToUser', entityName, function(err, result) {
                if (err) {
                    console.log("Error updating entity: "+ err);
                    showSnackbar("Error Updating Your Entity!", "red");
                } else {
                    showSnackbar("Entity Updated for Your User!", "green");
                }
            });

        } else if (selAction == "verify") {
            let verifyId = this._id

            Meteor.call("VerifyUserForEntity", verifyId, function(err, result) {
                if (err) {
                    console.log("Error verifying user for entity: " + err);
                    showSnackbar("Error Verifying User!", "red");
                    Meteor.call("Log.Errors", "userInfo.js", "click .verify", err);
                } else {
                    showSnackbar("User Verified for Entity!", "green");
                }
            });
        } else if (selAction == 'deny') {
            let denyId = this._id;

            Meteor.call("DenyUserToEntity", denyId, function(err, result) {
                if (err) {
                    console.log("Error denying user to entity: " + err);
                    showSnackbar("Error Denying User to Entity!", "red");
                    Meteor.call("Log.Errors", "userInfo.js", "click .deny", err)
                } else {
                    showSnackbar("User Denied Access to Entity!", "green");
                }
            });
        }
     },
     'change .setUsersEntity' (event) {
         let entitySel = event.target.value;
         Session.set("usersEntitySel", entitySel);
         console.log('User Entity Sel: ' + entitySel);
     },
     'mouseover .infoRow' (event) {
         let myRow = document.getElementById(event.currentTarget.id);
         let settings = UserSettings.findOne({});
         if (settings) {
             myRow.style.background = settings.themeHighlight;
             myRow.style.color = settings.themeHighlightText;
         }
     },
     'mouseout .inforRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        myRow.style.background = "";
        myRow.style.color = "";
     },
});
