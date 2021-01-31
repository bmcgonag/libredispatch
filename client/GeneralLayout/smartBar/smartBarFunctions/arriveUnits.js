import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

arriveUnit = function(callSign, callInfo, unitInfo) {

    let callId = callInfo._id;
    let callNo = callInfo.callNo;
    let unitId = unitInfo._id;
    let currentStatus = "AR";

    if (unitInfo.currentStatus == "AR" && callInfo.units[0].currentStatus == "AR") {
        showSnackbar("Unit " + callSign + " is Already On Scene", "orange");
        return ("Alrready On Scene.");
    } else {
        Meteor.call('call.arriveUnit', callId, callNo, callSign, unitId, function(err, result) {
            if (err) {
                console.log("Error Arriving Unit on Call: " + err);
                showSnackbar("Error Arriving Unit on Call", "red");
                Meteor.call("Log.Errors", "arriveUnits.js", "Arriving Unit to Call", err);
            } else {
                Meteor.call('units.changeCurrentStatus', unitId, callSign, currentStatus, callNo, function(err, result) {
                    if (err) {
                        console.log("Error Arriving Unit on Units: " + err);
                        showSnackbar("Error Arriving Unit on Units", "red");
                        Meteor.call("Log.Errors", "arriveUnits.js", "Arrive Unit to Units", err);
                    } else {
                        showSnackbar("Unit " + callSign + " Arrived!", "green");
                    }
                });
            }
        });
    }
}
