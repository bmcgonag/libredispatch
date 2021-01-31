import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

enRouteToStation = function(callSign) {
    let unitInfo = Units.findOne({ callSign: callSign });
    let callInfo = Calls.findOne({ "units.unit": callSign, active: true });
    let callId = "";
    let unitId = "";
    let callNumber = "";
    let quickCallNumber = "";
    let currentStatus = "ERS";

    if (callInfo) {
        callId = callInfo._id;
        callNumber = callInfo.callNo;
        quickCallNumber = callInfo.quickCallNo;
    }

    if (unitInfo) {
        unitId = unitInfo._id;
    }

    let isArrived = unitInfo.currentStatus;
    if (isArrived != 'AR') {
        showSnackbar("You cannot go En Route to Station from a non-Arrived Status", "orange");
        return;
    } else {
        Meteor.call('call.enRouteUnitToStation',callId, unitId, function(err, result) {
            if (err) {
                console.log("Error moving unit " + callSign + " to En Route To Station status: " + err);
                showSnackbar("Error Putting " + callSign + " in En Route to Station in Calls!", "red");
                Meteor.call("Log.Errors", "enRouteToStation.js", "enRouteToStation function, call.enRouteUnitToStation methoc", err, function(error, results) {
                    if (error) {
                        console.log("Error logging the error from trying to enroute a unit to the station in Calls: " + error);
                    }
                });
            } else {
                // now let's move it to this status in the units collection
                Meteor.call('units.changeCurrentStatus', unitId, callSign, currentStatus, callNumber, function(err, result) {
                    if (err) {
                        console.log("Error moving unit " + callSign + " to En Route to Station status in units collection: " + err);
                        showSnackbar("Error Putting " + callSign + " in En Route to Station in Units!", "red");
                        Meteor.call("Log.Errors", "enRouteToStation.js", "enRouteToStation function, units.changeCurrentStatus method", err, function(error, results) {
                            if (error) {
                                console.log("Error logging the error from trying to enroute a unit to the station in Units: " + error);
                            }
                        });
                    } else {
                        showSnackbar("Unit " + callSign + " in En Route to Station", "green");
                    }
                });
            }
        });
    }
}