import { CallPriorities } from '../../../imports/api/callPriorities.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';
import { clearForm } from '../adminGeneralFunctions.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.callPrioritySetup.onCreated(function() {
    this.subscribe('callPriorities');
    Session.set("priorityMode", "add");
    this.subscribe("errorLogs");
    this.subscribe('activeUserSettings');
});

Template.callPrioritySetup.onRendered(function() {
    $('.modal').modal();
    setTimeout(function() {
        $('select').formSelect();
    }, 1100);
    if ((Session.get("mode")) == "edit") {
        Materialize.updateTextFields();
    }
    $('.tooltipped').tooltip();
});

Template.callPrioritySetup.helpers({
    callPriorities: function() {
        return CallPriorities.find({});
    },
    priorityMode: function() {
        return Session.get("priorityMode");
    },
    editPriData: function() {
        let mode = Session.get("priorityMode");

        if (mode == 'edit') {
            let priId = Session.get("priorityId");
            return CallPriorities.findOne({ _id: priId });
        }
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.callPrioritySetup.events({
    'click #addCallPriority' (event) {
        event.preventDefault();

        let priorityName = $("#callPriorityName").val();
        let priorityColor = $("#callPriorityColor").val();
        let systemPriority = $("#prioritySystem").prop('checked');

        console.log("call Priority is: " + priorityName);
        // console.log("call priority color is:  " + priorityColor);

        if (priorityName == '' || priorityName == null) {
            showSnackbar("Priority Name is Required!", "red");
            var callPriorityName = document.getElementById("callPriority");
            callPriorityName.style.borderColor = "red";
        }  else {
            Meteor.call('priorities.insert', priorityName, priorityColor, systemPriority, function(err, result){
                if(err) {
                    showSnackbar("Error adding priority.", "red");
                //    // console.log("Error Adding Priority: " + err);
                } else {
                    showSnackbar("Priority Added Successfully!", "green");
                    Session.set("priorityMode", "add");
                    clearForm();
                }
            });
        }
    },
    'click #saveEditCallPriority' (event) {
        event.preventDefault();

        let priorityId = Session.get("priorityId");
        let priorityName = $("#callPriorityName").val();
        let priorityColor = $("#callPriorityColor").val();
        let systemPriority = $("#prioritySystem").prop('checked');

        // console.log("call Priority is: " + priorityName);
        // console.log("call priority color is:  " + priorityColor);

        if (priorityName == '' || priorityName == null) {
            showSnackbar("Priority Name is Required!", "red");
            var callPriorityName = document.getElementById("callPriority");
            callPriorityName.style.borderColor = "red";
        }  else {
            Meteor.call('callPriority.edit', priorityId, priorityName, priorityColor, systemPriority, function(err, result){
                if(err) {
                    showSnackbar("Error adding priority.", "red");
                    console.log("Error Editing Priority: " + err);
                    Meteor.call('Log.Errors', "callPrioritySetup.js", "click #saveEditCallPriority", err, function(error, results) {
                        if (error) {
                            console.log("Error logging the errors when saving Call Priority: " + error);
                        }
                    });
                } else {
                    showSnackbar("Priority Edited Successfully!", "green");
                    Session.set("priorityMode", "add");
                    clearForm();
                }
            });
        }
    },
    'click .editCallPriority' (event) {
        event.preventDefault();

        var priorityId = this._id;
        // console.log("Priority Id clicked: " + priorityId);

        Session.set("priorityId", priorityId);
        Session.set("priorityMode", "edit");
        Materialize.updateTextFields();
    },
    'click .deleteCallPriority' (event) {
        event.preventDefault();
        Session.set("priorityMode", "add");

        var priorityId = this._id;
        Session.set("confirmationDialogTitle", "Confirm - Potentially Destructive Action");
        Session.set("confirmationDialogContent", "You are about to delete a Call Prioirty.  This will not affect the priority setting of archived calls, nor any active call already using this priority setting.  If you wish to update any active calls using this priotiy, you will need to do so manually through the Dispatch software.  Do you wish to continue?");
        Session.set("eventConfirmCallBackFunction", "deleteThisCallPriority");
        Session.set("eventConfirmNecessaryId", priorityId);

        $("#confirmationDialog").modal('open');
    },
    'click #cancelCallPriority' (event) {
        event.preventDefault();
        Session.set("priorityMode", "add");
        clearForm();
    },
    'click #copySystemPriorities' (event) {
        event.preventDefault();
        let myId = Meteor.userId();
        if (Roles.userIsInRole(myId, ['GlobalAdmin'])) {
            showSnackbar("You Appear to be a Global Admin. This function is not for Global Entity Use.", "orange");
            return;
        } else {
            let i=0;
            Meteor.call("copy.callPriorities", i);
        }
    },
    'mouseover .infoRow' (event) {
        let myRow = document.getElementById(this._id);
        let settings = UserSettings.findOne({});
        if (settings) {
            myRow.style.background = settings.themeHighlight;
            myRow.style.color = settings.themeHighlightText;
        }
    },
    'mouseout .infoRow' (event) {
        let myRow = document.getElementById(this._id);
        myRow.style.background = "";
        myRow.style.color = "";
    },
});

deleteThisCallPriority = function(callPriorityId) {
    Meteor.call('callPriority.delete', callPriorityId, function(err, result) {
        if (err) {
            showSnackbar("Error Deleting Priority!", "red");
            console.log("Error Deleting Priority: " + err);
            Meteor.call('Log.Errors', "callPrioritySetup.js", "deleteThisCallPriority function", err, function(error, results) {
                if (error) {
                    console.log("Error logging the errors when deleting a Call Priority: " + error);
                }
            });
        } else {
            showSnackbar("Call Priority Successfully Deleted!", "green");
            clearForm();
        }
    });
}
