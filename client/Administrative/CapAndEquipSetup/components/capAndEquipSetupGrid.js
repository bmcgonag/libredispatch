import { CapAndEquip } from '../../../../imports/api/capAndEquip.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';

Template.capAndEquipSetupGrid.onCreated(function() {
    this.subscribe('errorLogs');
    this.subscribe('activeCapAndEquip');
    this.subscribe('activeUserSettings');
});

Template.capAndEquipSetupGrid.onRendered(function() {
    $('select').formSelect();
    $('.modal').modal();
});

Template.capAndEquipSetupGrid.helpers({
    capTypes: function() {
        return CapAndEquip.find({});
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.capAndEquipSetupGrid.events({
    'click .editCapGridActions' (event) {
        event.preventDefault();
        let capId = this._id;

        Session.set('capParentInfo', this.capParentEntity);
        Session.set("capEquipId", capId);
        Session.set("capMode", "Edit");
    },
    'click .deleteCapGridActions' (event) {
        event.preventDefault();
        let capId = this._id;

        Session.set("eventConfirmCallBackFunction", "deleteCapOrEquip");
        Session.set("eventConfirmNecessaryId", capId);
        Session.set("confirmationDialogTitle", "Delete Capability or Equipment");
        Session.set("confirmationDialogContent", "You are about to delete an active Capability or Equipment item from the system for your Entity.  Doing this could cause issues with Units or Personnel linked to this Capability or Equipment.  If you are certain you want to delete this item, click 'Confirm'.");

        $("#confirmationDialog").modal('open');
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

deleteCapOrEquip = function(capId) {
    Meteor.call("capEquip.delete", capId, function(err, result) {
        if (err) {
            console.log("Error deleting capability or equipment: " + err);
            showSnackbar("Error Deleting Capability or Equipment!", "red");
            Meteor.call("Error.Log", "capAndEquipmentGrid.js", "deleteCapOrEquip function", err); 
        } else {
            showSnackbar("Capability or Equipment Deleted Successfully!", "green");
        }
    });
}