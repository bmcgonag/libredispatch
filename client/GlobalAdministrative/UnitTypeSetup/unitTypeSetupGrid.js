import { MainUnitType } from '../../../imports/api/mainUnitTypes.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.unitTypeSetupGrid.onCreated(function() {
    this.subscribe("globalUnitTypes");
    this.subscribe('activeUserSettings');
});

Template.unitTypeSetupGrid.onRendered(function() {
    $('.modal').modal();
});

Template.unitTypeSetupGrid.helpers({
    unitTypeNames: function() {
        return MainUnitType.find({});
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.unitTypeSetupGrid.events({
    'click .deleteUnitType' (event) {
        event.preventDefault();

        let unitTypeId = this._id;
        Session.set("eventConfirmNecessaryId", unitTypeId);
        Session.set("eventConfirmCallBackFunction", "deleteUnitType");

        // console.log("Unit ID clicked to delete: " + unitTypeId);

        Session.set("confirmationDialogTitle", "Delete Unit Type");
        Session.set("confirmationDialogContent", "Warning: This action can have serious, negative effects on system operation. Please ensure all references to the chosen Unit Type are removed before proceeding.  To confirm deletion of this Unit Type, click the 'Confirm' button below.");

        $("#confirmationDialog").modal('open');

    },
    'click .editUnitType' (event) {
        event.preventDefault();

        let unitTypeId = this._id;
        console.log("Unit ID clicked for edit: " + unitTypeId);
        Session.set("unitTypeEditMode", "edit");
        Session.set("unitTypeEditId", unitTypeId);
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

deleteUnitType = function(typeId) {
    Meteor.call("mainUnitType.delete", typeId, function(err, result) {
        if (err) {
            console.log("Error deleting unit type: " + err);
            showSnackbar("Error Deleting Unit Type!", "red");
        } else {
            showSnackbar("Unit Type Deleted Successfully!", "green");
        }
    });
}
