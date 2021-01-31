import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';

clrUnit = function(callSign, callInfo, unitInfo, disposition) {
    let unitId = unitInfo._id;
    let callId = callInfo._id;

    if (callSign == null || callSign == "" || disposition == null || disposition == "") {
        showSnackbar("Call Sign and Disposition are required for CLR!", "red");
        return;
    }

    console.log("Unit " + callSign + " is in status " + unitInfo.currentStatus);

    if (typeof unitInfo == 'undefined') {
        showSnackbar("Unable to clear unit " + callSign + " in Units Grid!", "red");
    } else if (unitInfo.currentStatus != "AR" && unitInfo.currentStatus != "AR / TR" && unitInfo.currentStatus != "AR / Qd" && unitInfo.currentStatus != "ARS") {
        showSnackbar("Unit " + callSign + " is not yet On Scene and Can't be cleared!", "orange");
    } else if ((unitInfo.currentStatus != "AR / TR" && unitInfo.currentStatus != "AR" && unitInfo.currentStatus != "AR / Qd") && (callInfo.currentStatus == "AR" || callInfo.currentStatus == "ARS")) {
        // need to add the clear from Call here
        $("#smartBar").val("");
        $("#smartBar").focus();
        Meteor.call('call.clearUnit', callSign, disposition, function(err, result) {
            if (err) {
                showSnackbar("Error Completing Command " + "CLR" + "!", "red");
                // console.log("Error completing command " + "CLR" + ": " + err);
            } else {
                showSnackbar("Command " + "CLR" + " Successfully Completed!", "green");
                Session.set("mobileContext", "home");
            }
        });
    } else if (unitInfo.currentStatus == "AR / TR") {
        showSnackbar("Unit " + callSign + " Appears to be on Transport and Can't be Cleared!", "orange");
    } else {
        var callNo = callInfo.callNo;
        // console.log("callNo: " + callNo);

        let clearAndDispo = "Cleared " + disposition;

        Meteor.call('units.changeCurrentStatus', unitId, callSign, clearAndDispo, callNo, function(err, result) {
            if (err) {
                // console.log("Error completing secondary method unit.changeCurrentStatus: " + err);
            } else {
                $("#smartBar").val();
                $("#smartBar").focus();
                Meteor.call('call.clearUnit', unitId, callSign, disposition, function(err, result) {
                    if (err) {
                        showSnackbar("Error Completing Command " + "CLR" + "!", "red");
                        // console.log("Error completing command " + "CLR" + ": " + err);
                    } else {
                        showSnackbar("Command " + "CLR" + " Successfully Completed!", "green");
                        Session.set("mobileContext", "home");
                    }
                });
            }
        });
    }
    hideSmartBar();
}
