import { TransportTypes } from '../../../imports/api/transportTypes.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.transTypeSetup.onCreated(function() {
    this.subscribe('activeTransTypes');
    this.subscribe("errorLogs");
    this.subscribe('activeUserSettings');
});

Template.transTypeSetup.onRendered(function() {
    $('.tooltipped').tooltip();
    $('.modal').modal();
});

Template.transTypeSetup.helpers({
    transTypes: function() {
        let myEntity = Session.get("myEntity");
        let myParentEntity = Session.get("myParentEntity");
        if (myEntity == "GlobalEntity") {
            return TransportTypes.find({});
        } else if (myEntity == myParentEntity) {
            return TransportTypes.find({ parentEntity: myParentEntity });
        } else {
            return TransportTypes.find({ unitEntity: myEntity });
        }
    },
    transTypeMode: function() {
        return Session.get("transTypeMode");
    },
    transTypeEditInfo: function() {
        let mode = Session.get("transTypeMode");
        if (mode == 'edit') {
            let transId = Session.get("transTypeEditId");
            return TransportTypes.findOne({ _id: transId });
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

Template.transTypeSetup.events({
    'click .cancelSaveTransType' (event) {
        event.preventDefault();

        $("#typeAbbrev").val("");
        $("#typeDesc").val("");
        $("#isSystem").prop('checked', false);
        Session.set("transTypeMode", 'new');
        return;
    },
    'click .saveTransType' (event) {
        event.preventDefault();

        let thisuser = Meteor.user();

        let transAbbrev = $("#typeAbbrev").val();
        let transDesc = $("#typeDesc").val();
        let isSystem;
        if (Roles.userIsInRole(thisuser, 'GlobalAdmin')) {
            isSystem = $("#isSystem").is(':checked');
        } else {
            isSystem = false;
        }

        if (transAbbrev == null || transAbbrev == "" || transDesc == null || transDesc == "") {
            showSnackbar("Transport Abbreviation and Description are Required!", "red");
        } else {
            Meteor.call('transportTypes.insert', transAbbrev, transDesc, isSystem, function(err, result) {
                if (err) {
                    console.log("Error adding Transport Type: " + err);
                    showSnackbar("Error Adding Transport Type!", "red");
                } else {
                    showSnackbar("Traport Type Added Successfully!", "green");
                    // clear fields
                    $("#typeAbbrev").val("");
                    $("#typeDesc").val("");
                    $("#isSystem").prop('checked', false);
                    Session.set("transTypeMode", 'new');
                }
            });
        }
    },
    'click .updateTransType' (event) {
        event.preventDefault();

        let transId = Session.get("transTypeEditId");

        let thisuser = Meteor.user();

        let transAbbrev = $("#typeAbbrev").val();
        let transDesc = $("#typeDesc").val();
        let isSystem;
        if (Roles.userIsInRole(thisuser, 'GlobalAdmin')) {
            isSystem = $("#isSystem").is(':checked');
        } else {
            isSystem = false;
        }

        if (transAbbrev == null || transAbbrev == "" || transDesc == null || transDesc == "") {
            showSnackbar("Transport Abbreviation and Description are Required!", "red");
        } else {
            Meteor.call('transportTypes.edit', transId, transAbbrev, transDesc, isSystem, function(err, result) {
                if (err) {
                    console.log("Error adding Transport Type: " + err);
                    showSnackbar("Error Adding Transport Type!", "red");
                    Meteor.call("Log.Errors", "transTypeSetup.js", "click .updateTransType method", err, function(error, results) {
                        if (error) {
                            console.log("Error logging the error for inability to update transport type: " + error);
                        }
                    });
                } else {
                    showSnackbar("Traport Type Added Successfully!", "green");
                    // clear fields
                    $("#typeAbbrev").val("");
                    $("#typeDesc").val("");
                    $("#isSystem").prop('checked', false);
                    Session.set("transTypeMode", 'new');
                }
            });
        }
    },
    'click .editTransType' (event) {
        event.preventDefault();

        let transTypeId = this._id;

        Session.set("transTypeMode", "edit");
        Session.set("transTypeEditId", transTypeId);
    },
    'click .removeTransType' (event) {
        event.preventDefault();

        let transTypeId = this._id;

        Session.set("confirmationDialogTitle", "Delete Transport Type");
        Session.set("confirmationDialogContent", "You are about to delete the selected Tranasport Type from the system. This type of action can have negative effects if done mistakenly. Are you sure you want to delete this item?");
        Session.set("eventConfirmCallBackFunction", "removeTransportType");
        Session.set("eventConfirmNecessaryId", transTypeId);

        $("#confirmationDialog").modal('open');
    },
    'click .copySystemTransTypes' (event) {
        event.preventDefault();
        let myId = Meteor.userId();
        if (Roles.userIsInRole(myId, ['GlobalAdmin'])) {
            showSnackbar("You Appear to be a Global Admin. This function is not for Global Entity Use.", "orange");
            return;
        } else {
            let i = 0;
            Meteor.call("copy.transportTypes", i);
        }
    },
    'mouseover .infoRow' (event) {
        let myRow = document.getElementById(this._id);
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
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

removeTransportType = function(transTypeId) {
    // console.log("Removing Transport Type with Id: " + transTypeId);

    Meteor.call('transportType.delete', transTypeId, function(err, result) {
        if (err) {
            console.log("Error deleting the selected transport type: " + err);
            showSnackbar("Error Deleting the Selected Transport Type!", "red");
            Meteor.call("Log.Errors", "transTypeSetup.js", "removeTransportType function", err, function(error, results) {
                if (error) {
                    console.log("Error logging the error for inability to remove transport type: " + error);
                }
            });
        } else {
            showSnackbar("Transport Type Successfully Deleted!", "green");
        }
    });
}