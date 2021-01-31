import { UserGroups } from '../../../imports/api/userGroups.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.userGroupGrid.onCreated(function() {
    let myId = Meteor.userId();
    this.subscribe('errorLogs');
    this.subscribe('activeUserGroups');
    this.subscribe('activeUserSettings');
    if (Roles.userIsInRole(myId, 'GlobalAdmin')) {
        this.subscribe('allUsers');
    } else {
        this.subscribe('localUsers');
    }
});

Template.userGroupGrid.onRendered(function() {
    $('.modal').modal();
});

Template.userGroupGrid.helpers({
    userGroupsActive: function() {
        return UserGroups.find({});
    },
    groupMembers: function() {
        let groupId = this._id;
        let groupMember = [];
        let groupInfo = UserGroups.findOne({ _id: groupId });
        let numberMembers = groupInfo.usersInGroup.length;
        for (i=0; i < numberMembers; i++) {
            let userInfo = Meteor.users.findOne({ _id: groupInfo.usersInGroup[i] });
            let name = userInfo.profile.userFullName;
            let uname = userInfo.username;
            let fullName = uname + " - " + name;
            groupMember.push(fullName);
        }
        return groupMember;
    },
    userPrefs: function() {
        let settings = UserSettings.findOne({});
        if (settings) {
            return settings;
        }
    },
});

Template.userGroupGrid.events({
    'click .removeGroup' (event) {
        event.preventDefault();
        let groupId = this._id;

        Session.set("confirmationDialogTitle", "Delete User Group");
        Session.set("confirmationDialogContent", "Deleting this group will remove the members, and cause it to no longer work properly with associated Call Types, as well as other functions which may rely on this group througout the system.  Are you sure you want to remove this group?");
        Session.set("eventConfirmCallBackFunction", "deleteGroupFunc");
        Session.set("eventConfirmNecessaryId", groupId);

        $("#confirmationDialog").modal('open');
    },
    'click .editGroup' (event) {
        event.preventDefault();
        // get the id of the record we want to edit.
        let groupId = this._id;

        // set some session variables to make this easier.
        Session.set("groupId", groupId);
        Session.set("userGroupMode", "edit");
    },
    'mouseover .infoRow' (event) {
        myRow = document.getElementById(event.currentTarget.id);
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

deleteGroupFunc = function(groupId) {
    Meteor.call("delete.userGroup", groupId, function(err, result) {
        if (err) {
            console.log("Error deleting user group: " + err);
            showSnackbar("Error Deleting User Gruop!", "red");
            Meteor.call("Log.Errors", "userGroupGrid.js", "click .removeGroup in deleteGroupFunc function", err, function(error, results) {
                if (error) {
                    console.log("Error logging the error to the log for deleting a user group.");
                }
            });
        } else {
            showSnackbar("Group Deleted Successfully!", "green");
        }
    })
}