import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';
import { Transports } from '../../../../imports/api/transports.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

startTransport = function(callSign, callInfo, unitInfo, callNo, callId, unitId, transType, transDest, transDesc, mileage) {
    if (unitInfo.currentStatus != "AR" && unitInfo.currentStatus != "AR / Qd") {
        showSnackbar("Cannot Start Transport Until Unit " + callSign + " has Arrived!", "orange");
    } else {
        // make sure unit is assigned to this call,
        // make sure call is active, and
        // make sure unit is arrived on this call.
        let arrivedNow = Calls.findOne({ "units.unit": callSign, "units.currentStatus": "AR", active: true });

        // make sure unit is not already in a transport
        let inTrans = Calls.findOne({ "units.unit": callSign, "units.currentStatus": "AR / TR", active: true });
        let inTransUnit = Units.findOne({ callSign: callSign, serviceStatus: "InService", currentStatus: "AR / TR" });

        if (!arrivedNow) {
            console.log("Unit is not arrived on any active call.");
            showSnackbar("Unit " + callSign + " is not yet On Scene!", "orage");
            return ("Not On Scene");
        } else if (inTrans || inTransUnit) {
            console.log("Unit is already on a transport.");
            showSnackbar("Unit " + callSign + " is already in Transport Status!", "oragnge");
            return ("already in transport");
        } else {
            let startMileage = parseInt(mileage);
            let parentEntity = unitInfo.parentEntity;
            // ************************************************************
            // start the transport in the transports collection
            // ************************************************************
            Meteor.call('transport.start', callSign, unitId, callNo, callId, transType, transDest, transDesc, startMileage, parentEntity, function(err, result) {
                if (err) {
                    console.log("Error Starting Transport: " + err);
                    showSnackbar("Error Starting Transport!", "red");
                } else {
                    // ************************************************************
                    // show the transport in the units collection
                    // ************************************************************
                    Meteor.call('units.startTransport', callNo, callSign, unitId, function(error, result) {
                        if (error) {
                            console.log("Error starting transport for units collection.");
                            showSnackbar("Error Starting Transport in Units", "red");
                        } else {
                            // ************************************************************
                            // show the transport in the calls collection
                            // ************************************************************
                            Meteor.call('call.startTransport', callId, unitId, callNo, callSign, function(err, result) {
                                if (err) {
                                    console.log("Error starting Transport on Call: " + err);
                                    showSnackbar("Error Starting Transport", "red");
                                    Meteor.call('Log.Errors', "startTransports.js", "calls.startTransport method call", err);
                                } else {
                                    // need to empty modal fields and close modal here

                                    showSnackbar("Transport Started for " + callSign, "green");
                                }
                            });

                        }
                    });
                }
            });
        }
    }
}
