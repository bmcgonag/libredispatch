import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { Meteor } from 'meteor/meteor';

addNoteToCall = function(quickCallNo, noteText) {
    let callInfo = Calls.findOne({ quickCallNo: quickCallNo, active: true });

    if (typeof callInfo == 'undefined' || callInfo == "" || callInfo == null) {
        showSnackbar("Quick Call Number: " + quickCallNo + " was not found to be an active call!", "red");
    } else {
        let call_id = callInfo._id;

        Meteor.call('call.updateNote', call_id, noteText, function(err, result) {
            if (err) {
                console.log("Error adding note to call number " + quickCallNo + ": " + err);
                showSnackbar("Error Adding Note to Call " + quickCallNo + "!", "red");
                Meteor.call("Log.Errors", "addNoteToCall.js", "addNoteToCall function from smartbar", err, function(error, results) {
                    if (error) {
                        console.log("Error logging error about adding note to call: " + error);
                    }
                });
            } else {
                showSnackbar("Note Added to Call " + quickCallNo + " Successfully!", "green");
            }
        });
    }
}