import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

arrivedAtStation = function(callSign) {
    let unitInfo = Units.findOne({ callSign: callSign });
    let callInfo = Calls.findOne({ "units.unit": callSign, active: true });
    let callId = "";
    let unitId = "";
    let callNumber = "";
    let quickCallNumber = "";
    let currentStatus = "ARS";

    if (callInfo) {
        callId = callInfo._id;
        callNumber = callInfo.callNo;
        quickCallNumber = callInfo.quickCallNo;
    }

    if (unitInfo) {
        unitId = unitInfo._id;
    }

    let isERS = unitInfo.currentStatus;
    if (isERS != 'ERS') {
        showSnackbar("You cannot Arrive at Station from a non-ERS Status", "orange");
        return;
    } else {
        Meteor.call('call.arriveUnitAtStation',callId, unitId, function(err, result) {
            if (err) {
                console.log("Error moving unit " + callSign + " to Arrived at Station status: " + err);
                showSnackbar("Error Putting " + callSign + " in Arrived at Station in Calls!", "red");
                Meteor.call("Log.Errors", "arrivedAtStation.js", "arrivedAtStation function, call.arriveUnitAtStation method", err, function(error, results) {
                    if (error) {
                        console.log("Error logging the error from trying to arrive a unit at the station in Calls: " + error);
                    }
                });
            } else {
                // now let's move it to this status in the units collection
                Meteor.call('units.changeCurrentStatus', unitId, callSign, currentStatus, callNumber, function(err, result) {
                    if (err) {
                        console.log("Error moving unit " + callSign + " to Arrived at Stationn status in units collection: " + err);
                        showSnackbar("Error Putting " + callSign + " in Arrived at Station in Units!", "red");
                        Meteor.call("Log.Errors", "arrivedAtStation.js", "arrivedAtStation function, units.changeCurrentStatus method", err, function(error, results) {
                            if (error) {
                                console.log("Error logging the error from trying to arrive a unit at the station in Units: " + error);
                            }
                        });
                    } else {
                        showSnackbar("Unit " + callSign + " is Arrived at Station", "green");
                    }
                });
            }
        });
    }
}