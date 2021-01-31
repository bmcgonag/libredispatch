import { Calls } from '../../../../imports/api/calls.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { CallClickTracking } from '../../../../imports/api/callClickTracking.js';

Template.callNotesView.onCreated(function() {
    this.subscribe("activeCalls");
    this.subscribe("currentUserSettings");
    this.subscribe("errorLogs");
    this.subscribe("clickedCalls");
});

Template.callNotesView.onRendered(function() {
    Session.set("callIdClicked", "");
});

Template.callNotesView.helpers({
    getCallInfo: function() {
        // let callId = Session.get("callIdClicked"); <-- may be unnecessary now. Keeping for a bit to make sure.
        let clickTrackInfo = CallClickTracking.findOne({});
        if (clickTrackInfo) {
            let callId = clickTrackInfo.callId;
            return Calls.find({ _id: callId});
        }
    },
    notesForCall: function() {
        let clickTrackInfo = CallClickTracking.findOne({});
        if (clickTrackInfo) {
            let callId = clickTrackInfo.callId;
            let callInfo = Calls.findOne({ _id: callId});
            return callInfo.quickCallNo;
        }
    },
    noteAddedOn: function() {
        return moment(this.updatedOn).format("MM/DD/YY HH:mm:ss");
    },
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.callNotesView.events({
    'mouseover .infoRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        let settings = UserSettings.findOne({});
        if (settings) {
            myRow.style.background = settings.themeHighlight;
            myRow.style.color = settings.themeHighlightText;
        }
    },
    'mouseout .infoRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        myRow.style.background = "";
        myRow.style.color = "";
    },
    'click .splitNotesOut' (event) {
        Meteor.call('notesGrid.unpark', function(err, result) {
            if (err) {
                console.log("Error unparking notes grid from Dispatch view: " + err);
                showSnackbar("Unable to Unpark the Notes Grid!", "red");
                Meteor.call('Log.Errors', "callNotesView.js", "click .splitNotesOut", err, function(error, results) {
                    if (error) {
                        console.log("Unable to log the error encountered attempting to unpark the notes grid: " + error);
                    }
                });
            } else {
                showSnackbar("Notes Grid Separated from the View.", "green");
            }
        });
    },
    'click .parkNotes' (event) {
        Meteor.call('notesGrid.park', function(err, result) {
            if (err) {
                console.log("Error parking notes grid back into Dispatch view: " + err);
                showSnackbar("Unable to Park Notes back into Dispatch!", "red");
                Meteor.call("Log.Errors", "callNotesView.js", "click .parkNotes", err, function(error, results) {
                    if (error) {
                        console.log("Unable to log error about re-parking the notes grid into dispatch: " + error);
                    }
                });
            } else {
                showSnackbar("Notes Grid Parked Successfully", "green");
            }
        });
    },
});
