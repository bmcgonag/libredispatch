import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { QuickNotes } from '../../../../imports/api/quickNotes.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { Meteor } from 'meteor/meteor';

addQuickNote = function(quickCallNo, quickNoteAbbrev) {
    // first let's get the call Id of the quick call number.
    let qno = parseInt(quickCallNo);
    let callInfo = Calls.findOne({ quickCallNo: qno, active: true });
    let call_id = callInfo._id;

    // now let's get the full note text for the quick note.
    let noteInfo = QuickNotes.findOne({ qNoteAbbrev: quickNoteAbbrev });
    let noteText = noteInfo.qNoteText;

    Meteor.call('call.updateNote' ,call_id, noteText, function(err, result) {
        if (err) {
            console.log("Error Adding Quick Note to Call: " + err);
            showSnackbar("Error Adding Quick Note to Call!", "red");
            Meteor.call("Log.Errors", "addQuickNote.js", "Adding Quick Note to Call", err);
        } else {
            showSnackbar("Note Successfully Added to " + quickCallNo + "!", "green");
        }
    });
}