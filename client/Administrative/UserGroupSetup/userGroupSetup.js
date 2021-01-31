import { UserGroups } from '../../../imports/api/userGroups.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';
import { Meteor } from 'meteor/meteor';
import { resolveSoa } from 'dns';

Template.userGroupSetup.onCreated(function() {
    let myId = Meteor.userId();
    this.subscribe('errorLogs');
    if (Roles.userIsInRole(myId, 'GlobalAdmin')) {
        this.subscribe('allUsers');
    } else {
        this.subscribe('localUsers');
    }
    this.subscribe('activeUserGroups');
});

Template.userGroupSetup.onRendered(function() {
    $('select').formSelect();
});

Template.userGroupSetup.helpers({
    myLocalUsers: function() {
        return Meteor.users.find({});
    },
    groupMode: function() {
        return Session.get("userGroupMode");
    },
    groupData: function() {
        let mode = Session.get("userGroupMode");
        if (mode == 'edit') {
            let groupId = Session.get("groupId");
            let groupInfo = UserGroups.findOne({ _id: groupId });
            if (groupInfo) {
                return groupInfo;
            }
        }
    },
    isActive: function() {
        let listId = this._id;
        let groupId = Session.get("groupId");
        let groupUser = UserGroups.find({ usersInGroup: listId, active: true, _id: groupId }).count();
        if (groupUser > 0) {
            setTimeout(function() {
                $('select').formSelect();
            }, 200);
            console.log(listId + " should be active");
            return true;
        } else {
            setTimeout(function() {
                $('select').formSelect();
            }, 200);
            console.log(listId + "  not active");
            return false;
        }
    }
});

Template.userGroupSetup.events({
    'click .saveGroup' (event) {
        event.preventDefault();
        let groupName = $("#userGroupName").val();
        let groupUsers = $("#pickGroupUsers").val();

        if (groupName == "" || groupName == null) {
            showSnackbar("Group Name is Required!", "red");
            return;
        } else if (groupUsers == "" || groupUsers == null) {
            showSnackbar("At Least 1 Group Member is Required!", "red");
            return;
        } else {
            Meteor.call("add.userGroup", groupName, groupUsers, function(err, result) {
                if (err) {
                    console.log("Error adding user group: " + err);
                    showSnackbar("Error Adding User Gruop!", "red");
                    Meteor.call("Log.Errors", "userGroupSetup.js", "click .saveGroup", err, function(error, results) {
                        if (error) {
                            console.log("Error logging the error to the log for adding a new user group.");
                        }
                    });
                } else {
                    showSnackbar("User Group " + groupName + " Added Successfully!", "green");
                    $("#userGroupName").val("");
                    $("#pickGroupUsers").val("");
                    $('select').formSelect();
                    Session.set("userGroupMode", "new");
                }
            });
        }
    },
    'click .updateGroup' (event) {
        event.preventDefault();
        let groupId = Session.get("groupId");
        let groupName = $("#userGroupName").val();
        let groupUsers = $("#pickGroupUsers").val();

        if (groupName == "" || groupName == null) {
            showSnackbar("Group Name is Required!", "red");
            return;
        } else if (groupUsers == "" || groupUsers == null) {
            showSnackbar("At Least 1 Group Member is Required!", "red");
            return;
        } else {
            Meteor.call("update.userGroup", groupId, groupName, groupUsers, function(err, result) {
                if (err) {
                    console.log("Error updating user group: " + err);
                    showSnackbar("Error Updating User Gruop!", "red");
                    Meteor.call("Log.Errors", "userGroupSetup.js", "click .updateGroup", err, function(error, results) {
                        if (error) {
                            console.log("Error logging the error to the log for updating a user group.");
                        }
                    });
                } else {
                    showSnackbar("User Group " + groupName + " Added Successfully!", "green");
                    $("#userGroupName").val("");
                    $("#pickGroupUsers").val("");
                    $('select').formSelect();
                    Session.set("userGroupMode", "new");
                }
            });
        }
    },
    'click .cancelSaveGroup' (event) {
        event.preventDefault();
        $("#userGroupName").val("");
        $("#pickGroupUsers").val("");
        $('select').formSelect();
        Session.set("userGroupMode", "new");
    },
});