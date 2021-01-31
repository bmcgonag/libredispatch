import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

enrouteUnit = function(callSign, callInfo, unitInfo) {

    let callId = callInfo._id;
    let callNo = callInfo.callNo;
    let unitId = unitInfo._id;
    let currentStatus = "ER";
    console.log("Unit ID for ER: " + unitId);
    if (unitInfo.currentStatus == "ER" && callInfo.units[0].currentStatus == "ER") {
        showSnackbar("Unit " + callSign + " is Already En Route", "orange");
        return ("Alrready En Route.");
    } else {
        Meteor.call('call.enrouteUnit', callId, callNo, callSign, unitId, function(err, result) {
            if (err) {
                console.log("Error Putting Unit EnRoute on Call: " + err);
                showSnackbar("Error Putting Unit En Route", "red");
                Meteor.call("Log.Errors", "enrouteUnits.js", "En Route Unit to Call", err);
            } else {
                Meteor.call('units.changeCurrentStatus', unitId, callSign, currentStatus, callNo, function(err, result) {
                    if (err) {
                        console.log("Error putting unit EnRoute on Units: " + err);
                        showSnackbar("Error Putting Unit En Route", "red");
                        Meteor.call("Log.Errors", "enrouteUnits.js", "En Route Unit to Units", err);
                    } else {
                        showSnackbar("Unit " + callSign + " Set EnRoute!", "green");
                    }
                });
            }
        });
    }
}
