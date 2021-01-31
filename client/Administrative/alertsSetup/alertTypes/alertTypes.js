import { AlertTypes } from '../../../../imports/api/alertTypes.js';
import { AlertSeverity } from '../../../../imports/api/alertSeverity.js';
import { clearForm } from '../../adminGeneralFunctions.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

Template.alertTypes.onCreated(function() {
    this.subscribe('errorLogs');
    this.subscribe('entityAlertTypes');
    this.subscribe('entityAlertSeverity');
});

Template.alertTypes.onRendered(function() {
    setTimeout(function() {
        $('select').formSelect();
    }, 250);
    Session.set("alertTypeMode", "add");
});

Template.alertTypes.helpers({
    severityLevels: function() {
        return AlertSeverity.find({}); 
    },
    alertTypeMode: function() {
        return Session.get("alertTypeMode");
    },
    alertTypeData: function() {
        let mode = Session.get("alertTypeMode");
        if (mode == 'Edit') {
            let alertTypeId = Session.get("editAlertTypeId");
            return AlertTypes.findOne({ _id: alertTypeId });
        } else {
            return;
        }
    },
});

Template.alertTypes.events({
    'click #addAlertType' (event) {
        event.preventDefault();

        let typeName = $("#alertTypeName").val();
        let typeAssoc = $("#alertTypeAssoc").val();
        let typeSeverity = $("#typeSeverityLevel").val();
        let notifyType = $("#alertNotificationType").val();
        let notifySound = $("#alertNotificationSound").val();
        let isSystem = $("#systemAlertType").prop('checked');

        if (typeName == null || typeName == "") {
            showSnackbar("Alert Type Name is Required!", "red");
            $("#alertTypeName").focus();
            return;
        } else if (typeAssoc == null || typeAssoc == "") {
            showSnackbar("Alert Type Association is Required!", "red");
            $("#alertTypeAssoc").focus();
            return;
        } else if (typeSeverity == "" || typeSeverity == null) {
            showSnackbar("Alert Type Severity Level is Required!", "red");
            $("#typeSeverityLevel").focus();
            return;
        } else {
            Meteor.call('add.alertType', typeName, typeAssoc, typeSeverity, notifyType, notifySound, isSystem, function(err, result) {
                if (err) {
                    console.log('Error adding Alert Type: ' + err);
                    showSnackbar("Error Adding Alert Type!", "red");
                    Meteor.call("Log.Errors", "aertTypes.js", "click #addAlertType event", err, function(error, results) {
                        if (error) {
                            console.log("Error logging last error in the 'click #addAlertType event in alertTypes.js: " + error);
                        }
                    });
                } else {
                    showSnackbar("Alert Type Added Successfully!", "green");
                    clearForm();
                    setTimeout(function() {
                        $('select').formSelect();
                    }, 100);
                    Session.set("alertTypeMode", "add");
                }
            });
        }
    },
    'click #cancelAlertType' (event) {
        event.preventDefault();
        Session.set("alertTypeMode", "add");
        clearForm();
    },
    'click #saveEditAlertType' (event) {
        event.preventDefault();

        let typeId = Session.get("editAlertTypeId");
        let typeName = $("#alertTypeName").val();
        let typeAssoc = $("#alertTypeAssoc").val();
        let typeSeverity = $("#typeSeverityLevel").val();
        let notifyType = $("#alertNotificationType").val();
        let notifySound = $("#alertNotificationSound").val();
        let isSystem = $("#systemAlertType").prop('checked');

        if (typeName == null || typeName == "") {
            showSnackbar("Alert Type Name is Required!", "red");
            $("#alertTypeName").focus();
            return;
        } else if (typeAssoc == null || typeAssoc == "") {
            showSnackbar("Alert Type Association is Required!", "red");
            $("#alertTypeAssoc").focus();
            return;
        } else if (typeSeverity == "" || typeSeverity == null) {
            showSnackbar("Alert Type Severity Level is Required!", "red");
            $("#typeSeverityLevel").focus();
            return;
        } else {
            Meteor.call('update.alertType', typeId, typeName, typeAssoc, typeSeverity, notifyType, notifySound, isSytem, function(err, result) {
                if (err) {
                    console.log('Error adding Alert Type: ' + err);
                    showSnackbar("Error Adding Alert Type!", "red");
                    Meteor.call("Log.Errors", "aertTypes.js", "click #addAlertType event", err, function(error, results) {
                        if (error) {
                            console.log("Error logging last error in the 'click #addAlertType event in alertTypes.js: " + error);
                        }
                    });
                } else {
                    showSnackbar("Alert Type Added Successfully!", "green");
                    clearForm();
                    setTimeout(function() {
                        $('select').formSelect();
                    }, 100);
                    Session.set("alertTypeMode", "add");
                }
            });
        }
    },
    'click #copyAlertType' (event) {
        event.preventDefault();
        let myId = Meteor.userId();
        if (Roles.userIsInRole(myId, ['GlobalAdmin'])) {
            showSnackbar("You Appear to be a Global Admin. This function is not for Global Entity Use.", "orange");
            return;
        } else {
            let i = 0;
            Meteor.call("copy.alertTypes", i);
        }
    },
});