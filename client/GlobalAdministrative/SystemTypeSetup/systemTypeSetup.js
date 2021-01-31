import { SystemType } from '../../../imports/api/systemType.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';

Template.systemTypeSetup.onCreated(function() {
    this.subscribe("systemTypeInfo");
    this.subscribe("errorLogs");
});

Template.systemTypeSetup.onRendered(function() {
    $('select').formSelect();
});

Template.systemTypeSetup.helpers({
    currSystemType: function() {
        let currSysInfo = SystemType.findOne({});
        console.dir(currSysInfo);
        if (currSysInfo) {
            return currSysInfo;
        } else {
            return '';
        }
    },
});

Template.systemTypeSetup.events({
    'click #addSystemType' (event) {
        event.preventDefault();

        let systemType = $("#systemTypeSel").val();

        if (systemType == '' || systemType == null) {
            showSnackbar("System Type is a Required Field!", "red");
        } else {
            Meteor.call("setSystemType", systemType, function(err, result) {
                if (err) {
                    console.log("Error adding system type: " + err);
                    showSnackbar("Error Adding System Type!", "red");
                    Meteor.call("Log.Errors", "systemTypeSetup.js", "click #addSystemType", err);
                } else {
                    showSnackbar("System Type: " + systemType + " Added Successfully!", "green");
                }
            });
        }
    },
});