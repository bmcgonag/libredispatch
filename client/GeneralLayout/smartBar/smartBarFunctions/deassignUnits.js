import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';

deassignUnit = function(callSign, callInfo, unitInfo) {
    let unitId = unitInfo._id;
    let callId = callInfo._id;

    if (typeof unitInfo == 'undefined') {
        showSnackbar("Unable to change unit " + callSign + " in Units Grid!", "red");
    } else if (unitInfo.currentStatus == "AR") {
        showSnackbar("Unit " + callSign + " is Already On Scene and Can't be De-assigned!", "orange");
    } else {
        let unitCallNo = unitInfo.callNo;
        let callNo = callInfo.callNo;

        if ((typeof callInfo == 'undefined' || callInfo == "" || callInfo == null) && (typeof unitCallNo == 'undefined' || unitCallNo == null || unitCallNo == "")) {
            showSnackbar("Unit " + callSign + " doesn't appear to be on a call!", "red");
        } else if ((typeof callNo == 'undefined' || callNo == "" || callNo == null) && (unitCallNo != null || unitCallNo != "")) {
            Meteor.call('units.changeCurrentStatus', unitId, callSign, "Deassign", unitCallNo, function(err, result) {
                if (err) {
                    console.log("Error completing secondary method unit.changeCurrentStatus: " + err);
                } else {
                    $("#smartBar").val();
                    $("#smartBar").focus();
                    showSnackbar("Unit " + callSign + " appeared to be Stuck in Status!", "green");
                }
            });
        } else if ((typeof unitCallNo == 'undefined' || unitCallNo == null || unitCallNo == "") && (typeof callNo != 'undefined')) {
            Meteor.call('call.deassignUnit', callId, callSign, unitId, function(err, result) {
                if (err) {
                    showSnackbar("Error Completing Command " + "DA" + "!", "red");
                    // console.log("Error completing command " + "DA" + ": " + err);
                } else {
                    showSnackbar("Unit " + callSign + " appeared to be stuck on the Call!", "green");
                }
            });
        } else {
            // console.log("callNo: " + callNo);
            Meteor.call('units.changeCurrentStatus', unitId, callSign, "Deassign", callNo, function(err, result) {
                if (err) {
                    // console.log("Error completing secondary method unit.changeCurrentStatus: " + err);
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
                            } else {
                                showSnackbar("Deassign " + callSign + " Successful!", "green");
                            }
                        });
                    }
                }
            });
        }
    }
    hideSmartBar();
}
