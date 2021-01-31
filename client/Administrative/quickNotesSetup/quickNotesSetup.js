import { QuickNotes } from '../../../imports/api/quickNotes.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.quickNotesSetup.onCreated(function() {
    this.subscribe('activeQuickNotes');
    this.subscribe('errorLogs');
    this.subscribe('activeUserSettings');
});

Template.quickNotesSetup.onRendered(function() {
    $('textarea#qNoteText').characterCounter();
    $('input#qNoteAbbrev').characterCounter();
    $('.tooltipped').tooltip();
    $('.modal').modal();
});

Template.quickNotesSetup.helpers({
    activeNotes: function() {
        return QuickNotes.find({});
    },
    isActive: function() {
        if (this.active == true) {
            return "checked";
        } else {
            return false;
        }
    },
    qnMode: function () {
        return Session.get("quickNoteMode");
    },
    qnEditInfo: function() {
        let mode = Session.get("quickNoteMode");

        if (mode == 'edit') {
            let qnId = Session.get("quickNoteEditId");
            return QuickNotes.findOne({ _id: qnId });
        }
    },
    addedOnDate: function() {
        let qnId = this._id;
        let quickNoteInfo = QuickNotes.findOne({ _id: qnId });
        let addedDate = quickNoteInfo.addedOn;
        let niceDate = moment(addedDate).format("YYYY-MM-DD");
        return niceDate;
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.quickNotesSetup.events({
    'click .cancelAddQuickNote' (event) {
        event.preventDefault();
        $("#qNoteAbbrev").val("");
        $("#qNoteText").val("");
        Session.set("quickNoteMode", 'add');
        $("#systemQuickNote").prop('checked', false);
    },
    'click .saveQuickNote' (event) {
        event.preventDefault();

        let abbrev = $("#qNoteAbbrev").val();
        let text = $("#qNoteText").val();
        let systemNote = $("#systemQuickNote").prop('checked');

        if (abbrev == null || abbrev == "" || text == null || text == "") {
            showSnackbar("Abbreviation and Note Text are Required!", "red");
        } else {
            Meteor.call("add.quickNote", abbrev, text, systemNote, function(err, result){
                if (err) {
                    showSnackbar("An Error Occurred Adding Quick Note!", "red");
                    console.log("Error adding quick note: " + err);
                    Meteor.call('Log.Errors', "quickNotesSetup.js", "click .saveQuickNote", err, function(error, results) {
                        if (error) {
                            console.log("Error saving log of error in quickNotesSetup.js: " + error);
                        }
                    });
                } else {
                    showSnackbar("Quick Note Added Successfully!", "green");
                    $("#qNoteAbbrev").val("");
                    $("#qNoteText").val("");
                    Session.set("quickNoteMode", 'add');
                    $("#systemQuickNote").prop('checked', false);
                }
            });
        }
    },
    'click .changeQuickNote' (event) {
        event.preventDefault();

        let abbrev = $("#qNoteAbbrev").val();
        let text = $("#qNoteText").val();
        let qnId = Session.get("quickNoteEditId");
        let systemNote = $("#systemQuickNote").prop('checked');

        if (abbrev == null || abbrev == "" || text == null || text == "") {
            showSnackbar("Abbreviation and Note Text are Required!", "red");
        } else {
            Meteor.call("change.quickNote", qnId, abbrev, text, systemNote, function(err, result){
                if (err) {
                    showSnackbar("An Error Occurred Adding Quick Note!", "red");
                    console.log("Error adding quick note: " + err);
                    Meteor.call('Log.Errors', "quickNotesSetup.js", "click .changeQuickNote", err, function(error, results) {
                        if (error) {
                            console.log("Error saving log of error in quickNotesSetup.js: " + error);
                        }
                    });
                } else {
                    showSnackbar("Quick Note Updated Successfully!", "green");
                    $("#qNoteAbbrev").val("");
                    $("#qNoteText").val("");
                    Session.set("quickNoteMode", 'add');
                    $("#systemQuickNote").prop('checked', false);
                }
            });
        }
    },
    'click .removeQuickNote' (event) {
        event.preventDefault();

        let quickNoteId = this._id;

        Session.set("confirmationDialogTitle", "Confirm - Delete Quick Note");
        Session.set("confirmationDialogContent", "You are about to delete the selected Quick Note from your system. Doing so WILL NOT remove this quick note from archived Calls for Service, nor active / current Calls for Service is is currently used on.  This will only remove the quick note as an option going forward. Do you wish to continue?");
        Session.set("eventConfirmCallBackFunction", "deleteThisQuickNote");
        Session.set("eventConfirmNecessaryId", quickNoteId);

        $("#confirmationDialog").modal('open');
    },
    'click .editQuickNote' (event) {
        event.preventDefault();
        let qnId = this._id;

        Session.set("quickNoteMode", 'edit');
        Session.set("quickNoteEditId", qnId);
    },
    'click #copySystemQuickNote' (event) {
        event.preventDefault();
        let myId = Meteor.userId();
        if (Roles.userIsInRole(myId, ['GlobalAdmin'])) {
            showSnackbar("You Appear to be a Global Admin. This function is not for Global Entity Use.", "orange");
            return;
        } else {
            let i=0;
            Meteor.call("copy.quickNotes", i);
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

deleteThisQuickNote = function(quickNoteId) {
    Meteor.call("delete.quickNote", quickNoteId, function(err, result) {
        if (err) {
            showSnackbar("Error Deleting Quick Note!", "red");
            console.log("Error Deleting Quick Note: " + err);
            Meteor.call('Log.Errors', "quickNotesSetup.js", "deleteThisQuickNote function", err, function(error, results) {
                if (error) {
                    console.log("Error saving log of error in quickNotesSetup.js: " + error);
                }
            });
        } else {
            showSnackbar("Quick Note Deleted Successfully", "green");
        }
    });
}