import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';

clearCall = function(quickCallNo, callInfo, disposition) {
    console.log("In Clr Call Function.")
    let callId = callInfo._id;
    let callNo = callInfo.callNo;

    // first, let's figure out how many units are on the call still.
    let unitCount = Units.find({ callNo: callNo }).count();
    // let unitCount = _.size(callInfo.units);
    console.log("Number of Units all Call to be cleared = " + unitCount);
    let unitInfo = Units.find({ callNo: callNo }).fetch();

    // now we can cycle through those units, and clear or de-assign them
    // 1 by 1 with the call disposition selected by the user.
    for (i = 0; i < unitCount; i++) {
        // while we are in here, we will also re-check each unit to make sure
        // another user hasn't cleared it. If they have, no big deal.
        let callSign = unitInfo[i].callSign;
        console.log("Call Sign to clear: " + callSign);
        let unitId = unitInfo[i]._id;
        if (unitInfo[i].callNo == null || unitInfo[i].callNo == "" || unitInfo[i].callNo != callNo) { // it should never be this line...duh we looked them up by callNo...
            // Unit is already clear take no action.
            showSnackbar("Unit is clear, or was not assigned to this call.", "orange");
            return;
        } else if (unitInfo[i].currentStatus == "AR" || unitInfo[i].currentStatus == "ARS") {
            let clearAndDispo = "Cleared " + disposition;
            // Clear this unit with disposition
            Meteor.call('units.changeCurrentStatus', unitId, callSign, clearAndDispo, callNo, function(err, result) {
                if (err) {
                    // console.log("Error completing Clear Call method unit.changeCurrentStatus: " + err);
                    showSnackbar("Error Clearing Call!", "red");
                    // TODO: call the method to log the error here

                } else {
                    $("#smartBar").val();
                    $("#smartBar").focus();
                    Meteor.call('call.clearUnit', unitId, callSign, disposition, function(err, result) {
                        if (err) {
                            showSnackbar("Error Completing Command " + "CLR" + "!", "red");
                            // console.log("Error completing command " + "CLR" + ": " + err);
                        }
                    });
                }
            });

        } else if (unitInfo[i].currentStatus == "AS" || unitInfo[i].currentStatus == "ER" ) {
            // de-assign this unit
            Meteor.call('units.changeCurrentStatus', unitId, callSign, "Deassign", callNo, function(err, result) {
                if (err) {
                     console.log("Error completing Clear Call unit.changeCurrentStatus: " + err);
                } else {
                    $("#smartBar").val();
                    $("#smartBar").focus();

                    if (typeof callInfo == 'undefined') {
                        callNo = "";
                        showSnackbar("Unit " + callSign + " is not Currently Assigned", "red");
                    } else {
                        Meteor.call('call.deassignUnit', callId, callSign, unitId, function(err, result) {
                            if (err) {
                                showSnackbar("Error Completing Command " + "DA" + "!", "red");
                                // console.log("Error completing command " + "DA" + ": " + err);
                            }
                        });
                    }
                }
            });

        } else if (unitInfo[i].currentStatus == "AR  / TR") {
            // unit is in transport and can't be cleared - error to user and continue call.
            showSnackbar("Unit " + unitInfo[i].callSign +  " is on Transport and can't be cleared.", "orange");
            return;
        } else if (unitInfo[i].currentStatus == "AS / Qd") {
            // unit may be arrived, or may be queued to this call, and we need to find out
            // which it is, and act accordingly.
            showSnackbar("This unit is QD - Need to handle this soon!", "orange");
            return;
        }
    }

}
