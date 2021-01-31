import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';
import { Transports } from '../../../../imports/api/transports.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

endTransport = function(callSign, callInfo, unitInfo, callNo, callId, unitId, mileage) {

    let transInfo = Transports.findOne({ active: true, unitId: unitId });

    let miles = Number(mileage);


    // check if units show on transport, and if so, end it.
    if (unitInfo.currentStatus == "AR / TR") {
        showSnackbar("Unit " + callSign + " appears to be stuck in Transport Status.", "orange");
        unitEndTrans(callSign, miles);
    }

    // check if calls for the unit shows on transport, and if so, end it.
    if (callInfo) {
        console.log("I see the call info in endTransports.js");
        if (transInfo.startMileage > miles) {
            showSnackbar("End Mileage Can't be Less than Start Mileage!", "orange");
        } else {
            callsEndTrans(callNo, callSign);
        }
    }

    // end the transport on the transports collection if it exists.
    if (transInfo){
        if (transInfo.startMileage > miles) {
            showSnackbar("End Mileage Can't be Less than Start Mileage!", "orange");
        } else {
            // console.dir(transInfo.transport);
            destloc = transInfo.startDest;
            // console.log("Destination: " + destloc);
            transportEnd(callId, unitId, miles);
        }
    }
}

callsEndTrans = function(callNo, callSign, miles, destloc) {
    console.log("I'm about to call the method.");
    Meteor.call("calls.endTransport", callNo, callSign, miles, destloc, function(err, result) {
        if (err) {
            showSnackbar("Error Ending Transport!", "red");
            console.log("Error ending transport: " + err);
        }
    });
}

unitEndTrans = function(callSign, miles) {
    Meteor.call("units.endTransport", callSign, miles, function(err, result) {
        if (err) {
            showSnackbar("Error in Units Ending Transport", "red");
            console.log("Error in Units Ending Transport: " + err);
        }
    });
}

transportEnd = function(callId, unitId, endMileage) {
    Meteor.call("transport.end", callId, unitId, endMileage, function(err, result) {
        if (err) {
            console.log("Error ending Transport in Transports: " + err);
            showSnackbar("Error Ending Transport!", "red");
            Meteor.log("Log.Errors", "endTransports.js", "transportEnd function", err);
        } else {
            showSnackbar("Transport Ended Successfully!", "green");
        }
    })
}
