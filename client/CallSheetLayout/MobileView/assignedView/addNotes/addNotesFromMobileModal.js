import { Calls } from '../../../../../imports/api/calls.js';
import { Units } from '../../../../../imports/api/units.js';
import { UnitServiceTracking } from '../../../../../imports/api/unitServiceTracking.js';
import { ErrorLogs } from '../../../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../../../imports/api/userSettings.js';

Template.addNotesFromMobileModal.onCreated(function() {
    this.subscribe("activeUnits");
    this.subscribe("activeCalls");
    this.subscribe("currentUnitTracking");
    this.subscribe("errorLogs");
    this.subscribe("activeUserSettings");
});

Template.addNotesFromMobileModal.onRendered(function() {
    $('textarea#addNotesMobile').characterCounter();
});

Template.addNotesFromMobileModal.helpers({
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.addNotesFromMobileModal.events({
    'click .cancelAddNotes' (event) {
        event.preventDefault();
        $("#addNotesMobile").val("");
        $("#addNotesFromMobile").modal('close');
    },
    'click .saveAddNotes' (event) {
        event.preventDefault();
        let noteText = $("#addNotesMobile").val();
        // make sure they entered something
        if (noteText == '' || noteText == null) {
            showSnackbar("You must enter note text in order to add a note to this call.", "red");
            return;
        }
        $("#addNotesMobile").val("");
        addNoteFromMobile(noteText);
    },
    'keyup #addNotesMobile' (event) {
        event.preventDefault();
        let noteText = ($('#addNotesMobile').val()).trim();
        if (noteText == '' || noteText == null) {
            showSnackbar("You must enter note text in order to add a note to this call.", "red");
            return;
        } else {
            if (event.which == 13 || event.keyCode == 13) {
                addNoteFromMobile(noteText);
            }
        }
    },
});

addNoteFromMobile = function(noteText) {
    let myId = Meteor.userId();
    let username = Meteor.user().username;
    let myUnit = UnitServiceTracking.findOne({ userId: myId, current: true });
    if (myUnit) {
        let unitId = myUnit.unitId;
        let callInfo = Calls.findOne({ active: true, "units.unitId": unitId });

        let callId = callInfo._id;
        if (callInfo) {
            Meteor.call('call.updateNote', callId, noteText, function(err, result) {
                if (err) {
                    console.log("Error adding note from mobile assigned view: " + err);
                    showSnackbar("Error Adding the Note!", "red");
                    Meteor.call('Log.Errors', "addNotesFromMobileModal.js", "click .saveAddNotes", "err", function(error, results) {
                        if (error) {
                            console.log("Error logging the error generated from adding a note in Mobile: " + error);
                        }
                    });
                } else {
                    showSnackbar("Note Added Successfully!", "green");
                    $("#addNotesFromMobile").modal('close');
                }
            });
        } else {
            console.log("Couldn't get the associated call information.");
        }
    }
}