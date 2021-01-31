import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';

assignUnit = function(quickCallNumber, callSign, unitInfo, callInfo) {
    let isUnitOOV = Session.get("isUnitOOV");

    let unitId = unitInfo._id;

    let callNo = callInfo.callNo;
    let callId = callInfo._id;
    let qcNo = callInfo.quickCallNo;

    let unitAlreadyAssigned = Calls.findOne({ _id: callInfo._id, "units.unit": callSign, "units.assignable": false });

    if (typeof unitAlreadyAssigned != 'undefined' && unitAlreadyAssigned != null && unitAlreadyAssigned != "") {
        showSnackbar("Unit " + callSign + " Already Assigned To This Call!", "orange");
    } else {
        Meteor.call('call.assignUnit', callId, callNo, unitId, callSign, function(err, result) {
            if (err) {
                console.log("Error Assigning Unit from SmartBar: " + err);
                showSnackbar("Error Assigning Unit from SmartBar","red");
                Meteor.call("Log.Errors", "assignUnits.js", "Assign Unit to Call", err);
            } else {
                Meteor.call('units.changeCurrentStatus', unitId, callSign, "AS", callNo, function(err, result){
                    if (err) {
                        console.log("Error Assigning Units Unit from SmartBar: " + err);
                        showSnackbar("Error Assigning Units Unit from SmartBar","red");
                        Meteor.call("Log.Errors", "assignUnits.js", "Assign Unit in Units", err);
                    } else {
                        showSnackbar("Unit Assigned Successfully!", "green");
                        Session.set("mobileContext", "assigned");
                        Session.set("mobileAssignedCall", qcNo);
                        Session.set("mobileAssignedCallId", callId);
                    }
                });
            }
        });
    }

}
