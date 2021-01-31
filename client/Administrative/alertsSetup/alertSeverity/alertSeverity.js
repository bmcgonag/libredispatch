import { AlertSeverity } from '../../../../imports/api/alertSeverity.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { clearForm } from '../../adminGeneralFunctions.js';

Template.alertSeverity.onCreated(function() {
    this.subscribe("entityAlertSeverity");
    this.subscribe("errorLogs");
});

Template.alertSeverity.onRendered(function() {
    Session.set("severityMode", "add");
    $('input#severityLevel').characterCounter();
});

Template.alertSeverity.helpers({
    severityMode: function() {
        return Session.get("severityMode");
    },
    editData: function() {
        let mode = Session.get("severityMode");
        if (mode == 'Edit') {
            let severityId = Session.get("editSeverityId");
            return AlertSeverity.findOne({ _id: severityId });
        } else {
            return;
        }
    },
});

Template.alertSeverity.events({
    'click #addSeverity' (event) {
        event.preventDefault();

        let severityName = $("#severityLevel").val();
        let severityColor = $("#severityColor").val();
        let textColor = $("#severityTextColor").val();
        let isSystem = $("#systemSeverity").prop('checked');

        if (severityColor == "" || severityColor == null) {
            severityColor = "#000000";
            textColor = "#ffffff";
        }

        if (severityName == "" || severityName == null) {
            showSnackbar("Severity Level Name is Required!", "red");
            return;
        } else {
            Meteor.call('addAlertSeverity', severityName, severityColor, textColor, isSystem, "production", function(err, result) {
                if (err) {
                    console.log("Error adding Severity Level: " + err);
                    showSnackbar("Error Adding Severity Level!", "red");
                    Meteor.call('Log.Errors', "alertSeverity.js", "addSeverity event", err, function(error, results) {
                        if (error) {
                            console.log("Error adding Error to Error Log! Doh! " + error);
                        }
                    });
                } else {
                    showSnackbar("New Severity Level Successfully Added!", "green");
                    $("#severityLevel").val("");
                    $("#severityColor").val("#000000");
                    $("#severityTextColor").val("#000000");
                    $("#systemSeverity").prop('checked', false);
                    setTimeout(function() {
                        $('select').formSelect();
                    }, 100);
                    Session.set("severityMode", "new");
                }
            });
        }
    },
    'click #saveEditSeverity' (event) {
        event.preventDefault();

        $(".severityActions").val("");

        let severityName = $("#severityLevel").val();
        let severityColor = $("#severityColor").val();
        let textColor = $("#severityTextColor").val();
        let severityId = Session.get("editSeverityId");
        let isSystem = $("#systemSeverity").prop('checked');

        if (severityColor == "" || severityColor == null) {
            severityColor = "#000000";
            textColor = "#ffffff";
        }

        if (severityName == "" || severityName == null) {
            showSnackbar("Severity Level Name is Required!", "red");
            return;
        } else {
            Meteor.call('changeAlertSeverity', severityId, severityName, severityColor, textColor, isSystem, "production", function(err, result) {
                if (err) {
                    console.log("Error adding Severity Level: " + err);
                    showSnackbar("Error Adding Severity Level!", "red");
                    Meteor.call('Log.Errors', "alertSeverity.js", "saveEditSeverity event", err, function(error, results) {
                        if (error) {
                            console.log("Error adding Error to Error Log! Doh! " + error);
                        }
                    });
                } else {
                    showSnackbar("New Severity Level Successfully Added!", "green");
                    $("#severityLevel").val("");
                    $("#severityColor").val("#000000");
                    $("#severityTextColor").val("#000000");
                    $("#systemSeverity").prop('checked', false);
                    setTimeout(function() {
                        $('select').formSelect();
                    }, 100);
                    Session.set("severityMode", "new");
                }
            });
        }
    },
    'click #cancelSeverity' (event) {
        event.preventDefault();
        Session.set("severityMode", "new");
        $("#systemSeverity").prop('checked', false);
        clearForm();
    },
    'click #copySystemSeverity' (event) {
        event.preventDefault();
        let myId = Meteor.userId();
        if (Roles.userIsInRole(myId, ['GlobalAdmin'])) {
            showSnackbar("You Appear to be a Global Admin. This function is not for Global Entity Use.", "orange");
            return;
        } else {
            let i = 0;
            Meteor.call("copy.alertSeverity", i);
        }
    },
});