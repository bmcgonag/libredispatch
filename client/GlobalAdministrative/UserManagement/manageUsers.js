import { Entities } from '../../../imports/api/entities.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.manageUsers.onCreated(function() {
    this.autorun(() => {
        this.subscribe('allUsers');
        this.subscribe('activeEntities');
        this.subscribe('activeUserSettings');
    });
});

Template.manageUsers.onRendered(function() {
    $('.modal').modal();
    $('select').formSelect();
    Session.set("editUserMode", false);
    $('ul.tabs').tabs();
});

Template.manageUsers.helpers({
    verifiedUsersList: function(){
        return Meteor.users.find({ "profile.entityVerified": true });
    },
    unverifiedUsersList: function() {
        return Meteor.users.find({ "profile.entityVerified": false });
    },
    nonEntityUsersList: function() {
        return Meteor.users.find({ "profile.usersEntity": "" })
    },
    usersFullName: function() {
        return this.profile.userFullName;
    },
    userEmail: function() {
        return this.emails[0].address;
    },
    isAdmin: function() {
        return Roles.getRolesForUser( this._id );
    },
    entities: function() {
        return Entities.find();
    },
    usersAssignedEntity: function() {
        return this.profile.usersEntity;
    },
    editUser: function() {
        console.log("Got edit as true for user info.");
        let userToEdit = Session.get("editUserById");
        setTimeout(function() {
            $('select').formSelect();
        }, 250);
        return Meteor.users.find({ _id: userToEdit });
    },
    editModeTrue: function() {
        let editUserNow = Session.get("editUserMode");
        // console.log("got edit as" + editUserNow + " for mode.");
        return editUserNow;
    },
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.manageUsers.events({
    'click .editUser' (event) {
        event.preventDefault();

        let userId = this._id;
        console.log("User Id in edit mode: " + userId);
        Session.set("editUserById", userId);
        Session.set("editUserMode", true);
    },
    'click .editUserInfo' (event) {
        event.preventDefault();

        let userId = this._id;
        console.log("userId edited will be " + userId);
        let userFullName = $("#userFullName").val();
        let userRole = $("#userRole").val();
        let userEntity = $("#assignEntity").val();

        Meteor.call('superAdmin.updateUserInfo', userId, userFullName, userRole, userEntity, function(err, result) {
            if (err) {
                console.log("Error updating User Info: " + err);
                showSnackbar("Error Updating User Info!", "red");
                Meteor.call("Log.Errors", "manageUsers.js", "click .editUserInfo", err);
            } else {
                showSnackbar("User Info Updated Successfully!", "green");
            }
        });
    },
    'click .changePasswordForUser' (event) {
        event.preventDefault();

        let newPswd = $("#newUserPassword").val();
        let secNewPswd = $("#newUserPassRpt").val();
        let userId = Session.get("editUserById");

        if (newPswd != secNewPswd) {
            showSnackbar("Passwords Do Not Match!", "orange");
            $("#newUserPassword").addClass("red");
            $("#newUserPassRpt").addClass("red");
            $("#newUserPassword").val('');
            $("#newUserPassRpt").val('');
            $("#newUserPassword").focus();
            return;
        } else {
            Meteor.call("changeUserPswd", userId, newPswd, function(err, result){
                if (err) {
                    console.log("Error updating user password: " + err);
                    showSnackbar("Error Updating Password!", "red");
                    Meteor.call("Log.Errors", "manageUsers.js", "click .changePasswordForUser", err);
                } else {
                    showSnackbar("Password Updated for User!", "green");
                }
            });
        }
    },
    'keyup #newUserPassword' (event) {
        event.preventDefault();

        $("#newUserPassword").removeClass("red");
    },
    'keyup #newUserPassRpt' (event) {
        event.preventDefault();

        let newPswd = $("#newUserPassword").val();
        let secNewPswd = $("#newUserPassRpt").val();

        if (newPswd != secNewPswd) {
            $("#newUserPassword").addClass("red");
            $("#newUserPassRpt").addClass("red");
        } else {
            $("#newUserPassword").removeClass("red");
            $("#newUserPassRpt").removeClass("red");
        }
    },
    'click .deleteUser' (event) {
        let userclickedId = this._id;

        console.log("User Id to delete: " + userclickedId);
        Session.set("eventConfirmNecessaryId", userclickedId);
        Session.set("eventConfirmCallBackFunction", "deleteUser");

        // console.log("Unit ID clicked to delete: " + userclickedId);

        Session.set("confirmationDialogTitle", "Delete User From System");
        Session.set("confirmationDialogContent", "Warning: You are about to delete this user.  After being deleted from the system, the user will no longer have access to any function, nor be able to log into the system. To confirm deletion of this User, click the 'Confirm' button below.");

        $("#confirmationDialog").modal('open');
    },
    'click #addUser' (event) {
        event.preventDefault();
        let fullName = $("#userFullName").val();
        let username = $("#userEmail").val();
        let userRole = $("#userRole").val();
        let theirEntity = $("#assignEntity").val();

        if (username == "" || username == null) {
            showSnackbar("Username is a required field.", "red");
            return;
        } else if (userRole == "" || userRole == null) {
            showSnackbar("Role is a required field.", "red");
            return;
        } else if (theirEntity == "" || theirEntity == null) {
            showSnackbar("Users Entity is a required field!", "red");
            return;
        } else {
            // now call the method to add the user.
            Meteor.call('superAdmin.createNewUser', fullName, username, userRole, theirEntity, function(err, result) {
                if (err) {
                    console.log("Error adding user: " + err);
                    showSnackbar("Error Adding New User!", "red");
                } else {
                    showSnackbar("User Added with default Password!", "green");
                }
            });
        }
    },
    'mouseover .infoRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        let settings = UserSettings.findOne({});
        if (settings) {
            myRow.style.background = settings.themeHighlight;
            myRow.style.color = settings.themeHighlightText;
        }
    },
    'mouseout .infoRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        myRow.style.background = "";
        myRow.style.color = "";
    },
});

deleteUser = function(userclickedId) {
    Meteor.call("remove.userFromSystem", userclickedId, function(err, result) {
        if (err) {
            console.log("Error deleting user: " + err);
            showSnackbar("Error Deleting User!", "red");
        } else {
            showSnackbar("User Deleted Successfully!", "green");
        }
    });
}
