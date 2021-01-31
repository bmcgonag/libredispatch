import { AlertTypes } from '../../../../imports/api/alertTypes.js';
import { AlertSeverity } from '../../../../imports/api/alertSeverity.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { UserSettings} from '../../../../imports/api/userSettings.js';

Template.alertTypeGrid.onCreated(function() {
    this.subscribe('errorLogs');
    this.subscribe('entityAlertTypes');
    this.subscribe('entityAlertSeverity');
    this.subscribe('activeUserSettings');
});

Template.alertTypeGrid.onRendered(function() {

});

Template.alertTypeGrid.helpers({
    alertTypes: function() {
        return AlertTypes.find({});
    },
    addedOnDate: function() {
        let added = this.addedOn;
        let momentAdded = moment(added).format("YYYY-MM-DD");
        return momentAdded;
    },
    colorful: function() {
        let sev = this.alertTypeSeverity;
        let severity = AlertSeverity.findOne({ severityName: sev });
        return severity;
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.alertTypeGrid.events({
    'click .editAlertType' (event) {
        event.preventDefault();
        let alertTypeId = this._id;

        Session.set("alertTypeMode", "Edit");
        Session.set("editAlertTypeId", alertTypeId);
        setTimeout(function() {
            $('select').formSelect();
        }, 100);
    },
    'click .deleteAlertType' (event) {
        event.preventDefault();
        let alertTypeId = this._id;

        Session.set("alertTypeMode", "add");

        Session.set("confirmationDialogTitle", "Confirm - Potentially Destructive Action");
        Session.set("confirmationDialogContent", "You are about to delete an Alert Type.  This action can have profound affects on the ability of your system with respect to alerting your users properly as needed. Before continuing this action it is highly recommended that you first update any references to the alert type you want to remove in the other modules of the system.  Do you wish to continue?");
        Session.set("eventConfirmCallBackFunction", "deleteThisAlerttype");
        Session.set("eventConfirmNecessaryId", alertTypeId);

        $("#confirmationDialog").modal('open');
    },
});

deleteThisAlertType = function(alertTypeId) {
    Meteor.call("delete.alertType", alertTypeId, function(err, result) {
        if (err) {
            console.log("Error deleting alertType: " + err);
            showSnackbar("Error Deleting the Alert Type!", "red");
            Meteor.call("Log.Errors", "alertTypeGrid.js", "deleteThisAlertType function", err, function(error, result) {
                if (error) {
                    console.log("Error logging the error in delete action of alertTypeGrid.js! " + error);
                }
            });
        } else {
            showSnackbar("Alert Type Deleted Successfully!", "green");
        }
    });
}