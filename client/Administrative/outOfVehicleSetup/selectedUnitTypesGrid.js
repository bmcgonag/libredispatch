import { OOVTypes } from '../../../imports/api/outOfVehicleTypes.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.selectedUnitTypesGrid.onCreated(function() {
    this.subscribe("oovTypes");
    this.subscribe('oovTypes');
    this.subscribe("activeUserSettings");
});

Template.selectedUnitTypesGrid.onRendered(function() {

});

Template.selectedUnitTypesGrid.helpers({
    oovTypesInfo: function() {
        return OOVTypes.find({});
    },
    requireLocationChecked: function() {
        return this.requiresLocation;
    },
    unitAvailChecked: function() {
        return this.unitStillAvail;
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.selectedUnitTypesGrid.events({
    'click .editOOVTypes' (event) {
        event.preventDefault();
        let oovTypeId = this._id;

        Session.set("oovTypeMode", 'edit');
        Session.set("oovEditId", oovTypeId);
    },
    'click .deleteOOVTypes' (event) {
        event.preventDefault();
        let oovTypeId = this._id;

        Session.set("confirmationDialogTitle", "Confirm - Delete Out Of Vehicle Type");
        Session.set("confirmationDialogContent", "You are about to delete an Out of Vehicle Type from the system.  Once deleted, this option will no longer be available for use by any user in your Entity, including users of any child Entities.  Are you sure you want to continue?");
        Session.set("eventConfirmCallBackFunction", "deleteOOVType");
        Session.set("eventConfirmNecessaryId", oovTypeId);

        $("#confirmationDialog").modal('open');
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

deleteOOVType = function(oovTypeId) {
    // console.log("OOV Type Id to be deleted is: " + oovTypeId);

    Meteor.call('oovType.delete', oovTypeId, function(err, result) {
        if (err) {
            console.log("Error deleting OOV Type: " + err);
            showSnackbar("Error Deleting the Selected OOV Type!", "red");
            Meteor.call("Error.Log", "selectedUnitTypesGrid.js (OOV Types Setup)", "deleteOOVType function", err, function(error, results) {
                if (error) {
                    console.log("Error encountered trying to log the error for deleting an OOV Type: " + error);
                }
            });
        } else {
            showSnackbar("OOV Type Deleted Successfully!", "green");
        }
    });
}
