import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';

arriveImmediately = function(callSign, quickCallNo) {
    // first make sure unit is not already assigned to another call or on hold
    let callInfo = Calls.findOne({ quickCallNo: quickCallNo, active: true });
    let unitInfo = Units.findOne({ callSign: callSign });

    let assigned = Calls.find({ "units.unit": callSign, active: true, "units.currentStatus": { $in: ['AS', 'ER', 'AR', 'AR / TR', 'AS / HLD', 'AS / Qd'] }}).fetch();

    if (typeof assigned == 'undefined' || assigned == null || assigned == "") {
        // not assigned - move forward
        // set the assigne and en route times as well
        Meteor.call('call.assignUnit', callInfo._id, callInfo.callNo, unitInfo._id, callSign, function (err, result) {
            if (err) {
                console.log("Error Assigning Unit for Immed Arrival: " + err);
                showSnackbar("Error Assigning Unit for Immediate Arrival!", "red");
            } else {
                Meteor.call('units.changeCurrentStatus', unitInfo._id, callSign, 'AS', callInfo.callNo, function(err, result) {
                    if (err) {
                        console.log("Unit Assignment for Immediate Arrival failed: " + err);
                        showSnackbar("Error Assigning the unit for immediate arrival.", "red");
                    }
                });
                // enroute it
                Meteor.call("call.enrouteUnit", callInfo._id, callInfo.callNo, callSign, unitInfo._id, function(err, result) {
                    if (err) {
                        console.log("Error en-routing unit for immed arrival: " + err);
                        showSnackbar("Error EnRouting Unit for Immediate Arrival!", "red");
                    } else {
                        Meteor.call('units.changeCurrentStatus', unitInfo._id, callSign, 'ER', callInfo.callNo, function(err, result) {
                            if (err) {
                                console.log("Unit Assignment for Immediate Arrival failed: " + err);
                                showSnackbar("Error Assigning the unit for immediate arrival.", "red");
                            }
                        });
                        Meteor.call('units.changeCurrentStatus', unitInfo._id, callSign, 'AR', callInfo.callNo, function(err, result) {
                            if (err) {
                                console.log("Unit Assignment for Immediate Arrival failed: " + err);
                                showSnackbar("Error Assigning the unit for immediate arrival.", "red");
                            }
                        });

                        // arrive it
                        Meteor.call("call.arriveUnit", callInfo._id, callInfo.callNo, callSign, unitInfo._id, function(err, result) {
                            if (err) {
                                console.log("Error arriving unit for immed arrival: " + err);
                                showSnackbar("Error Arriving Unit for Immediate Arrival!", "red");
                            } else {
                                showSnackbar("Unit " + callSign + " set as Arrived!", "green");
                            }
                        });
                    }
                });
            }
        });
    } else {
        // assigned - doh - let's tell the user
        showSnackbar("Unit " + callSign + " is already on a Call. This function is not available.", "red");
        return;
    }
}

enrouteImmediately = function(callSign, quickCallNo) {
    // first make sure unit isn't already assigned to another call
    console.log("Call Sign and QCNo are: " + callSign + " and " + quickCallNo);
    let callInfo = Calls.findOne({ quickCallNo: quickCallNo, active: true });
    let unitInfo = Units.findOne({ callSign: callSign });

    let assigned = Calls.find({ "units.unit": callSign, active: true, "units.currentStatus": { $in: ['AS', 'ER', 'AR', 'AR / TR', 'AS / HLD', 'AS / Qd'] }}).fetch();

    if (typeof assigned == 'undefined' || assigned == null || assigned == "") {
        // not assigned good to go.
        // Need to set the Assign time as well
        Meteor.call('call.assignUnit', callInfo._id, callInfo.callNo, unitInfo._id, callSign, function(err, result) {
            if (err) {
                showSnackbar("Error Assigning Unit " + callSign, "res");
                console.log("Error Assigning Unit: " + err);
            } else {
                Meteor.call('units.changeCurrentStatus', unitInfo._id, callSign, 'AS', callInfo.callNo, function(err, result) {
                    if (err) {
                        console.log("Unit Assignment for Immediate Arrival failed: " + err);
                        showSnackbar("Error Assigning the unit for immediate arrival.", "red");
                    }
                });

                // now en route the unit.
                Meteor.call("call.enrouteUnit", callInfo._id, callInfo.callNo, callSign, unitInfo._id, function(err, result) {
                    if (err) {
                        showSnackbar("Error EnRouting Unit " + callSign, "red");
                        console.log("Error EnRouting Unit: " + err);
                    } else {
                        Meteor.call('units.changeCurrentStatus', unitInfo._id, callSign, 'ER', callInfo.callNo, function(err, result) {
                            if (err) {
                                console.log("Unit Assignment for Immediate Arrival failed: " + err);
                                showSnackbar("Error Assigning the unit for immediate arrival.", "red");
                            }
                        });
                        showSnackbar("Immediate EnRoute of " + callSign + " Successful!", "green");
                    }
                });
            }
        });
    } else {
        // assigned, let's balk at this request.
        showSnackbar("Unit " + callSign + " is already on a Call. This function is not available.", "red");
        return;
    }
}
