import { AlertSeverity } from '../../../../imports/api/alertSeverity.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';

Template.severityGrid.onCreated(function() {
    this.subscribe('entityAlertSeverity');
    this.subscribe("errorLogs");
    this.subscribe('activeUseerSettings');
});

Template.severityGrid.onRendered(function() {
    $('.modal').modal();
});

Template.severityGrid.helpers({
    severityLevels: function() {
        return AlertSeverity.find({});
    },
    addedOnDate: function() {
        let thisDate = this.addedOn;
        let final = moment(thisDate).format('YYYY-MM-DD');
        return final;
    },
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.severityGrid.events({
    'click .editAlertSeverityType' (event) {
        let severityId = this._id;

        // edit the severity value stuff - use a session variable.
        // console.log("edit mode enabled");
        Session.set("severityMode", "Edit");
        Session.set("editSeverityId", severityId);
    },
    'click .deleteAlertSeverityType' (event) {
        event.preventDefault();
        let severityId = this._id;
        Session.set("severityMode", "Add")

        Session.set("confirmationDialogTitle", "Confirm - Potentially Destructive Action");
        Session.set("confirmationDialogContent", "You are about to delete an Alert Severity Level.  This WILL NOT remove the alert severity from existing Alert Types.  You must next update all alert types with the new severity you desire.  Do you wish to continue?");
        Session.set("eventConfirmCallBackFunction", "deleteAlertSeverity");
        Session.set("eventConfirmNecessaryId", severityId);

        $("#confirmationDialog").modal('open');
    },
    'mouseover .severityRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        let settings = UserSettings.findOne({});
        if (settings) {
            myRow.style.background = settings.themeHighlight;
            myRow.style.color = settings.themeHighlightText;
        }
    },
    'mouseout .severityRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        myRow.style.background = "";
        myRow.style.color = "";
        
    }
});

deleteAlertSeverity = function(alertSeverityId) {
    Meteor.call('delete.alertSeverity', alertSeverityId, function(err, result) {
        if (err) {
            console.log("Error deleting the severity level: " + err);
            showSnackbar("Error Deleting the Selected Severity Level!", "red");
            Meteor.call('Log.Errors', "severityGrid.js", "deleteAlertSeverity function", err, function(error, results) {
                if (error) {
                    console.log("Error adding Error to Error Log: " + error);
                }
            });
        } else {
            showSnackbar("Severity Level Deleted Successfully!", "green");
        }
    });
}