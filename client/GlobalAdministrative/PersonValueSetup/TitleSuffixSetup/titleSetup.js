import { PersonTitles } from '../../../../imports/api/personTitles.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { Meteor } from 'meteor/meteor';

Template.titleSetup.onCreated(function() {
    this.subscribe('acitvePersonTitles');
});

Template.titleSetup.onRendered(function() {
    Session.set("titleMode", "new");
    $('select').formSelect();
});

Template.titleSetup.helpers({
    titleMode: function() {
        let mode = Session.get("titleMode");
        if (mode) {
            return mode;
        } else {
            return;
        }
    },
    titleInfo: function() {
        let mode = Session.get("titleMode");
        if (mode == 'edit') {
            let titleSetupId = Session.get("titleId");
            return PersonTitles.findOne({ _id: titleSetupId });
        } else {
            return;
        }
    },
});

Template.titleSetup.events({
    'click #addTitle' (event) {
        event.preventDefault();
        let type = $("#tsType").val();
        let titleAbbrev = $("#titleAbbrev").val();
        let titleFull = $("#titleFull").val();
        let isSystem = $("#systemTitle").prop('checked');

        if (titleAbbrev == "" || titleAbbrev == null || titleFull == "" || titleFull == null) {
            showSnackbar("Title Abbreviation and Title Full are required fields!", "red");
            return;
        } else if (type == "" || type == null) {
            showSnackbar("Type is a Required Field!", "red");
            return;
        } else {
            Meteor.call('personTS.add', type, titleAbbrev, titleFull, isSystem, function(err, result) {
                if (err) {
                    console.log("Error adding personTitle: " + err);
                    showSnackbar("Error Adding the Person Title!", "red");
                    Meteor.call("Log.Errors", "titleSetup.js", "click #addTitle", err, function(error, results) {
                        console.log("Unable to log the error adding the title to person titles collection: " + error);
                    });
                } else {
                    showSnackbar("Title Successfully Added!", "green");
                    $("#tsType").val("");
                    $("#titleAbbrev").val("");
                    $("#titleFull").val("");
                    $("#systemTitle").prop('checked', false);
                    Session.set("titleMode", "new");
                    Session.set("titleId", "");
                }
            });
        }
    },
    'click #changeTitle' (event) {
        event.preventDefault();

        let titleId = Session.get("titleId");
        let type = $("#tsType").val();
        let titleAbbrev = $("#titleAbbrev").val();
        let titleFull = $("#titleFull").val();
        let isSystem = $("#systemTitle").prop('checked');

        if (titleAbbrev == "" || titleAbbrev == null || titleFull == "" || titleFull == null) {
            showSnackbar("Title Abbreviation and Title Full are required fields!", "red");
            return;
        } else if (type == "" || type == null) {
            showSnackbar("Type is a Required Field!", "red");
            return;
        } else {
            Meteor.call('personTS.change', titleId, type, titleAbbrev, titleFull, isSystem, function(err, result) {
                if (err) {
                    console.log("Error adding personTitle: " + err);
                    showSnackbar("Error Adding the Person Title!", "red");
                    Meteor.call("Log.Errors", "titleSetup.js", "click #addTitle", err, function(error, results) {
                        console.log("Unable to log the error adding the title to person titles collection: " + error);
                    });
                } else {
                    showSnackbar("Title Successfully Added!", "green");
                    $("#tsType").val("");
                    $("#titleAbbrev").val("");
                    $("#titleFull").val("");
                    $("#systemTitle").prop('checked', false);
                    Session.set("titleMode", "new");
                    Session.set("titleId", "");
                }
            });
        }
    },
    'click #cancelAddTitle' (event) {
        event.preventDefault();
        $("#tsType").val("");
        $("#titleAbbrev").val("");
        $("#titleFull").val("");
        $("#systemTitle").prop('checked', false);
        Session.set("titleMode", "new");
        Session.set("titleId", "");
    },
});