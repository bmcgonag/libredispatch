import { Calls } from '../../../../imports/api/calls.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

fireOut = function(callSign, quickCallNo) {
    // first we'll find the _id of the call
    let callInfo = Calls.findOne({ quickCallNo: quickCallNo });

    if (callInfo) {
        let callId = callInfo._id;

        // we found the call by quick call number, so that's good, but is the unit giving the information
        // assigned to the call?  If not, we shouldn't add the information.
        let unitOnCall = Calls.findOne({ _id: callId, "units.unit": callSign });
        if (unitOnCall) {
            // now we'll set the time of fire out, and add a note to the call
            Meteor.call("set.fireOut", callId, callSign, function(err, result) {
                if (err) {
                    console.log("Error adding Fire Out status: " + err);
                    showSnackbar("Error Adding Fire Out Status to Call.");
                    Meteor.call("Log.Errors", "fireOut.js", "fireOUt function", err, function(error, results){
                        if (error) {
                            console.log("Error logging issue encountered while trying to add fire out status: " + error);
                        }
                    });
                } else {
                    showSnackbar("Fire Out Status Successfully Added!", "green");
                }
            });
        } else {
            showSnackbar("Unit Atributed with Fire Out is not Assigned to the Call!", "red");
            return;
        }
    } else {
        showSnackbar("No Active Calls with Quick Call Number " + quickCallNo + " found!", "red");
        return;
    }
}