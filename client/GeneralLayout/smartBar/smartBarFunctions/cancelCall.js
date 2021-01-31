import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

cancelCall = function(quickCallNo, clearReason) {
    let callInfo = Calls.findOne({ quickCallNo: quickCallNo });

    if (callInfo) {
        // first let's make sure there are no units assigned tot he call - queued or otherwise need to be removed.
        let callId = callInfo._id;
        let unitsAssigned = Calls.find({ _id: callId, "units.currentStatus": { $in: ["AS", "ER", "AR", "AR / TR" / "Qd"]}}).count();
        if (unitsAssigned > 0) {
            showSnackbar("Units Appear to Still be Assigned to this Call. Cannot Cancel.", "red");
            return;
        } else {
            // let's clear this call now with disposition of 'Canceled' and cancelReason
            
        }
    } else {
        showSnackbar("Call Not Found! Perhaps Closed By Another User.", "red");
        return;
    }
}
