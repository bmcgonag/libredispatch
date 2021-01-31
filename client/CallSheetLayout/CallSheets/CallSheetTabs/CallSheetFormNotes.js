import { Calls } from '../../../../imports/api/calls.js';

Template.callSheetFormNotes.onCreated(function() {
    this.subscribe("activeCalls");
});

Template.callSheetFormNotes.onRendered(function() {
    var noteArr = [];
    var notes = {};
    Session.set("notes", notes);
    Session.set("noteArr", noteArr);
    Session.set("noteTextEntered", false);
});

Template.callSheetFormNotes.helpers({
    canAddNotes: function() {
        return Session.get("noteTextEntered");
    },
});

Template.callSheetFormNotes.events({
    'click .addNote' (event) {
        event.preventDefault();

        // console.log("add note clicked for id: ");
        addNote();
    },
    'keyup #callNotesEntry' (event) {
        event.preventDefault();

        let note = $('#callNotesEntry').val();


        if (note == '' || note == null) {
            Session.set("noteTextEntered", false);
        } else {
            Session.set("noteTextEntered", true);
            if (event.which == 13 || event.keyCode == 13) {
                addNote();
            }
        }
    },
});

function addNote() {
    let noteText = $("#callNotesEntry").val();
    let callId = Session.get("callIdCreated");
    let mode = Session.get("mode");

    if (mode == "ViewCallDetail") {
        let callNum = Session.get("viewDetailFor");
        Meteor.call("call.updateNote", callId, noteText, function(err, result) {
            if (err) {
                showSnackbar("Error adding notes.", "red");
                // console.log("Error adding notes: " + err);
            } else {
                showSnackbar("Note Added Successfully!", "green");
                $("#callNotesEntry").val('');
                $("#callNotesEntry").focus();
                Session.set("noteTextEntered", false);
            }
        });
    } else {
        // treat as a new / unsaved call sheet
        let username = Meteor.user().username;
        let notes = Session.get("notes");
        let noteArr = Session.get("noteArr");
        // console.log("Note Text: " + noteText);
        notes["note"] = noteText;
        notes["addedOn"] = new Date();
        notes["addedBy"] = username;
        // console.log("added by: " + username);
        noteArr.push(notes);
        Session.set("notes", notes);
        Session.set("noteArr", noteArr);
        $("#callNotesEntry").val('');
        $("#callNotesEntry").focus();
        Session.set("noteTextEntered", false);
    }
}
