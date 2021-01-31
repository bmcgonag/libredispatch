import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';

putOutOfVehicle = function(unitNo, unitInfo, ovt, loc, remainAvail) {
    let unitId = unitInfo._id;
    console.log("-------- !!!!!! -------- !!!!!! --------");
    console.log("got to the out of vehicle function. ");

    // now make sure the unit isn't currently assigned to a call.

    let currStatus = unitInfo.currentStatus;

    if (currStatus == "Available" || currStatus == "OV") {
        // unit can be put in OOV status with given location
        console.log("Unit No: " + unitNo);
        console.log("OOV Type: " + ovt);
        console.log("OOV Loc: " + loc);
        console.log("Available: " + remainAvail);

        let statusColor = "grey darken-2"; // <-- this is the color for OOV
        let textColor = "white"; // this is the text color for OOV

        let concatStatus = "OV/" + ovt + "/" + loc + "/" + remainAvail;

        // now let's call a method to set our unit in Out Of Vehicle status (OV)
        Meteor.call("units.changeCurrentStatus", unitId, unitNo, concatStatus, "", function(err, result) {
            if (err) {
                console.log("Error changing unit to OOV: " + err);
                showSnackbar("Error Setting Unit " + unitNo + "to OOV!", "red");
                Meteor.call("Log.Errors", "putOutOfVehicle.js", "change Status to OOV function", err);
            } else {
                showSnackbar(unitNo + " Successfully Put in OOV Status!", "green");
            }
        });
    } else {
        showSnackbar("Unit " + unitNo + " is in " + currStatus + " and Cannot Go OOV!", "red");
        return;
    }
}
