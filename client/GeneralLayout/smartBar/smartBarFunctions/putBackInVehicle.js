import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';

putBackInVehicle = function(unitNo, unitInfo) {
    // we just checked, but let's recheck to make sure the vehicle is
    // in an Out of Vehicle status.

    if (unitInfo.currentStatus != "OV" && unitInfo.currentStatus != "OV / Qd") {
        // unit is not in proper status to go Back In Vehicle (BV)
        showSnackbar("Unit " + unitNo + " is Not in OOV Status!", "red");
        return;
    } else {
        // now call the units change current status method
        let unitId = unitInfo._id;

        Meteor.call("units.changeCurrentStatus", unitId, unitNo, "BV", "", function(err, result) {
            if (err) {
                console.log("Error with Back In Vehicle command: " + err);
                showSnackbar("Error Putting Unit " + unitNo + " Back In Vehicle!", "red");
                Meteor.call("Log.Errors", "putBackInVehicle.js", "putBackInVehicle function", err);
            } else {
                showSnackbar("Unit " + unitNo + " Put Back In Vehicle!", "green");
            }
        });
    }
}
