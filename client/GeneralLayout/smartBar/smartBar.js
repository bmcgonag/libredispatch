// This is called to display the snackbar notification
import { Commands } from '../../../imports/api/commands.js';
import { Calls } from '../../../imports/api/calls.js';
import { Units } from '../../../imports/api/units.js';
import { QuickNotes } from '../../../imports/api/quickNotes.js';
import { Dispos } from '../../../imports/api/dispositions.js';
import { TransportTypes } from '../../../imports/api/transportTypes.js';
import { OOVTypes } from '../../../imports/api/outOfVehicleTypes.js';
import { Addresses } from '../../../imports/api/addresses.js';

// the following argument indicators are used with various commands, with no list
// type attribute, but are instead some form of free text that should be validated

// m/ - mileage (transports or in / out of service)
// tl/ - to location (transports)
// n/ - note text (notes, note per unit x)


showSmartBar = function() {
    // console.log("SmartBar got Called!");
    var smartBarNotification = document.getElementById("smartBar");
    smartBarNotification.className = "show";
    setTimeout(function() {
        $("#smartBar").focus();
    }, 750)
}

hideSmartBar = function() {
    // console.log("SmartBar being Hidden.");
    var smartBarNotification = document.getElementById("smartBar");
    smartBarNotification.className = smartBarNotification.className.replace("show", "dontShow");
    $("#smartBar").val('');
}

Template.smartBar.onCreated(function() {
    this.subscribe('activeCommands');
    this.subscribe('activeCalls');
    this.subscribe('activeUnits');
    this.subscribe('activeQuickNotes');
    this.subscribe('activeDispostions');
    this.subscribe('activeTransTypes');
    this.subscribe('oovTypes');
});

Template.smartBar.helpers({
    settings: function() {
        return {
            position: "top",
            limit: 10,
            rules: [
                {
                    token: ':',
                    collection: Commands,
                    field: "cmd",
                    template: Template.cmdOptions,
                },
                {
                    token: 'u/',
                    collection: Units,
                    field: "callSign",
                    template: Template.unitOptions,
                },
                {
                    token: 'qn/',
                    collection: QuickNotes,
                    field: "qNoteAbbrev",
                    template: Template.quickNotesOptions,
                },
                {
                    token: 'qc/',
                    collection: Calls,
                    field: "quickCallNo",
                    template: Template.quickCallNoOptions,
                },
                {
                    token: 'cd/',
                    collection: Dispos,
                    field: "dispoAbbrev",
                    template: Template.disposOptions,
                },
                {
                    token: 'tt/',
                    collection: TransportTypes,
                    field: "transAbbrev",
                    template: Template.transTypesList,
                },
                {
                    token: 'ovt/',
                    collection: OOVTypes,
                    field: "oovTypeName",
                    template: Template.myOOVList,
                },
            ]
        };
    },
    titleTool: function() {
        let myCmdSel = Session.get("cmdSel");
        let cmdinfo = Commands.findOne({ command: myCmdSel });
        // console.log("command sent: " + cmdInfo.tooltip);
        return cmdInfo.tooltip;
    },
});

Template.smartBar.events({
    'keydown input#smartBar' (event) {

        if (event.keyCode == 13) {
            let myEntity = Session.get("myEntity");
            let myParentEntity = Session.get("myParentEntity");

            // console.log("Enter press detected.");
            var cmdSentence = $("#smartBar").val();

            // break down the command

            // take that command and get the key / value pairs out of it
            let cmdObj = cmdSentence.split(/\s*(\S+)\/\s*/).reduceRight( (acc, v) => {
                if (acc.default === undefined) {
                    acc.default = v;
                } else {
                    acc[v] = acc.default;
                    acc.default = undefined;
                }
                return acc;
            }, {});

            let cmd = cmdObj.default;

            if (cmd == ":DA") {
                // first check to see if the unit is already 'Arrived'
                // :DA u/{call sign / unit number}
                let callSign = cmdObj.u.trim();
                // console.log("Call Sign from cmd: " + callSign);
                let unitInfo = Units.findOne({ callSign: callSign });
                let callInfo = Calls.findOne({ "units.unit": callSign });

                deassignUnit(callSign, callInfo, unitInfo);

            } else if (cmd == ':CLR') {
                // Clear unit from call
                // :CLR u/{call sign / unit number} cd/{disposition}

                let callSign = cmdObj.u.trim();
                let disposition = cmdObj.cd.trim();

                let unitInfo = Units.findOne({ callSign: callSign });
                let callInfo = Calls.findOne({ "units.unit": callSign, active: true });

                // console.log("Unit " + callSign + " is in status " + unitInfo.currentStatus);

                clrUnit(callSign, callInfo, unitInfo, disposition);

            } else if (cmd == ':CLC') {
                // clear all units from call
                // :CLC q/{quick call number} cd/{call disposition}

                let quickCallNo = parseInt(cmdObj.q);
                let disposition = cmdObj.cd.trim();

                let callInfo = Calls.findOne({ quickCallNo: quickCallNo, active: true });

                // console.log("Unit " + callSign + " is in status " + unitInfo.currrentStatus);

                clearCall(quickCallNo, callInfo, disposition);

            } else if (cmd == ':AS') {
                // Assign unit to call
                // :AS u/{call sign / unit number} q/{quick call number}

                let callSign = cmdObj.u.trim();
                let quickCallNo = parseInt(cmdObj.q);

                let unitInfo = Units.findOne({ callSign: callSign });
                let callInfo = Calls.findOne({ quickCallNo: quickCallNo, active: true });

                // check to see if unit is OOV.  If it is, handle that situation
                // in the assignment function
                // *** this needs to be done in context menu as well.
                isUnitOOV(unitInfo._id);

                // console.log(callInfo);

                // console.log("Assinging " + callSign + " to Quick Call " + quickCallNo);

                assignUnit(quickCallNo, callSign, unitInfo, callInfo);

            } else if (cmd == ':ER') {
                // Enn Route unit to call
                // :ER u/{call sign / unit number}

                let callSign = cmdObj.u.trim();

                let unitInfo = Units.findOne({ callSign: callSign });
                let callInfo = Calls.findOne({ "units.unit": callSign, active: true });

                // console.log(callInfo);

                // console.log("Call Sign to En route: " + callSign);
                enrouteUnit(callSign, callInfo, unitInfo);

            } else if (cmd == ':AR') {
                // Arrive unit at call
                // :AR u/{call sign / unit number}

                let callSign = cmdObj.u.trim();

                let unitInfo = Units.findOne({ callSign: callSign });
                let callInfo = Calls.findOne({ "units.unit": callSign, active: true });

                // console.log(callInfo);

                // console.log("Call Sign to Arrive: " + callSign);
                arriveUnit(callSign, callInfo, unitInfo);

            } else if (cmd == ':TR') {
                // Start a unit on transport
                // :TR u/{call sign} tt/{transport type} tl/{destination} td/{transport description} m/{mileage}

                let callSign = cmdObj.u;
                let transType = cmdObj.tt;
                let transDest = cmdObj.tl;
                let mileage = cmdObj.m;
                let transDesc = cmdObj.td;

                // check that all required fields are filled in.
                if (callSign == "{call sign}" || callSign == null || callSign == "") {
                    showSnackbar("Call Sign is Required for Transport!", "red");
                    return;
                }

                if (transType == "{transport type}" || transType == null || transType == "") {
                    showSnackbar("Transport Type is Required!", "red");
                    return;
                }

                if (transDest == "{transport location}" || transDest == null || transDesc == "") {
                    showSnackbar("Transport Location is Required!", "red");
                    return;
                }

                if (mileage == "" || mileage == "{mileage}") {
                    mileage = 0;
                }

                if (transDesc == "{transport description}" || transDesc == "" || transDesc == null) {
                    transDesc = "";
                }


                let unitInfo = Units.findOne({ callSign: callSign, currentStatus: "AR" });
                if (!unitInfo) {
                    showSnackbar("Unit must be arrived for transport.", "red");
                } else {
                    let callNo = unitInfo.callNo;
                    let callInfo = Calls.findOne({ callNo: callNo });

                    let callId = callInfo._id;
                    let unitId = unitInfo._id;

                    startTransport(callSign, callInfo, unitInfo, callNo, callId, unitId, transType, transDest, transDesc, mileage);
                }
            } else if (cmd == ':ETR') {
                // end a unit's transport
                // :ETR u/{call sign} m/{mileage}

                let callSign = (cmdObj.u).trim();
                let mileage = (cmdObj.m).trim();

                let unitInfo = Units.findOne({ callSign: callSign, currentStatus: "AR / TR" });

                if (unitInfo) {
                    // console.log("going to units side.");
                    let callNo = unitInfo.callNo;
                    let callInfo = Calls.findOne({ callNo: callNo });
                    let callId = callInfo._id;
                    let unitId = unitInfo._id;
                    endTransport(callSign, callInfo, unitInfo, callNo, callId, unitId, mileage);
                } else {
                    // console.log("going to calls side.");
                    let callInfo = Calls.findOne({ active: true, "units.currentStatus": "AR / TR", "units.unit": callSign });
                    let callNo = callInfo.callNo;
                    let callId = callInfo._id;
                    let unitInfo = Units.findOne({ callSign: callSign });
                    let unitId = unitInfo._id;
                    endTransport(callSign, callInfo, unitInfo, callNo, callId, unitId, mileage);
                }

            } else if (cmd == ':CN') {
                // get case number for unit
                // :CN u/{call sign / unit number}
                let callSign = (cmdObj.u).trim();


            } else if (cmd == ':N') {
                // add note to call
                // :N q/{quick call number} n/{note text}

                let quickCallNo = parseInt((cmdObj.q).trim());
                let noteText = cmdObj.n.trim();

                addNoteToCall(quickCallNo, noteText);

            } else if (cmd == ':QN') {
                // add a quick note to a call
                // :QN q/{quick call number} qn/{quick note abbreviations}

                let quickCall = cmdObj.q.trim();
                let quickNoteAbbrev = cmdObj.qn.trim();

                if (quickCall == "" || quickCall == null) {
                    showSnackbar("Quick Call Number is Required to Add a Quick Note!", "red");
                    return;
                } else {
                    if (quickNoteAbbrev == "" || quickNoteAbbrev == null) {
                        showSnackbar("Quick Note is Required to Add a Quick Note to a Call!", "red");
                        return;
                    } else {
                        addQuickNote(quickCall, quickNoteAbbrev);
                    }
                }
            } else if (cmd == ":MP") {
                // make unit primary on call
                // :MP q/{quick call number} u/{call sign}

                let quickCall = cmdObj.q.trim();
                let unitNo = cmdObj.u.trim();
                let quickCallNo = parseInt(quickCall);

                let callInfo = Calls.findOne({ quickCallNo: quickCallNo, "units.unit": unitNo });
                let unitInfo = Units.findOne({ callSign: unitNo });

                let unitId = unitInfo._id;
                let callId = callInfo._id;
                let callNo = callInfo.callNo;

                makePrimary(unitId, unitNo, callNo, callId);
            } else if (cmd == ":OV") {
                // Set a unit in out of vehicle status
                // :OV u/{call sign or unit number} ovt/{out of vehicle type} a/{address or oov location}

                let unitNo = cmdObj.u;
                let ovt = cmdObj.ovt;
                let loc = cmdObj.a;

                let unitInfo = Units.findOne({ callSign: unitNo });

                let outType = OOVTypes.findOne({ active: true, oovTypeName: ovt });

                let locReq = outType.requiresLocation;
                let remainAvail = outType.unitStillAvail;

                if (locReq == true && (loc == "" || loc == null || loc == " " || loc == "{address or location}")) {
                    // location must be set, but isn't.
                    showSnackbar("This Out of Vehicle Type Requires a Location!", "red");
                    return;
                } else if (locReq == false) {
                    locReq = "";
                }

                putOutOfVehicle(unitNo, unitInfo, ovt, loc, remainAvail);
            } else if (cmd == ":BV") {
                // set a unit back in vehicle from OOV
                // :BV u/{call sign or unit number}

                let unitNo = (cmdObj.u).trim();
                console.log("Unit No for BV: "+ unitNo);

                let unitInfo = Units.findOne({ callSign: unitNo });

                if (unitInfo.currentStatus != "OV"  && unitInfo.currentStatus != "OV / Qd") {
                    showSnackbar("Unit " + unitNo + " is not currently OOV!", "red");
                    return;
                } else {
                    putBackInVehicle(unitNo, unitInfo);
                }
            } else if (cmd == ":IER") {
                // immediate en route (straight from unassigned)
                // :IER u/{call sign or unit number} q/{quick call number}
                let callSign = (cmdObj.u).trim();
                let qNo = parseInt((cmdObj.q).trim());

                if (callSign == "" || callSign == null) {
                    showSnackbar("Call Sign is Required for Immediate En Route!", "red");
                    return;
                } else if (qNo == "" || qNo == null) {
                    showSnackbar("Quick Call Number is Required for Immediate En Route!", "red");
                } else {
                    enrouteImmediately(callSign, qNo);
                }
            } else if (cmd == ":IAR") {
                // Imeediate Arrive Unit directly from unassigned status
                // :IAR u/{call sign or unit number} q/{quick call number}
                let callSign = (cmdObj.u).trim();
                let qNo = parseInt((cmdObj.q).trim());

                if (callSign == "" || callSign == null) {
                    showSnackbar("Call Sign is Required for Immediate Arrivals!", "red");
                    return;
                } else if (qNo == "" || qNo == null) {
                    showSnackbar("Quick Call Number is Required for Immediate Arrivals!", "red");
                    return;
                } else {
                    arriveImmediately(callSign, qNo);
                }
            } else if (cmd == ':IS') {
                // In Service unit:  :IS u/{call sign or unit number}
                let callSign = (cmdObj.u).trim();
                if (callSign == "" || callSign == null) {
                    showSnackbar("Call Sign is Required for In Service", "red");
                    return;
                } else {
                    let unitInfo = Units.findOne({ callSign: callSign });
                    if (unitInfo) {
                        let unitId = unitInfo._id;
                        let currentStatus = unitInfo.currentStatus;
                        let serviceStatus = unitInfo.serviceStatus;

                        changeUnitServiceStatus(unitId, serviceStatus, currentStatus);
                    }
                }
            } else if (cmd == ':OS') {
                // Out of Service unit:  :OS u/{call sign or unit number}
                let callSign = (cmdObj.u).trim();
                if (callSign == "" || callSign == null) {
                    showSnackbar("Call Sign is Required for Out of Service", "red");
                    return;
                } else {
                    let unitInfo = Units.findOne({ callSign: callSign });
                    if (unitInfo) {
                        let unitId = unitInfo._id;
                        let currentStatus = unitInfo.currentStatus;
                        let serviceStatus = unitInfo.serviceStatus;

                        changeUnitServiceStatus(unitId, serviceStatus, currentStatus);
                    }
                }
            } else if (cmd == ':ERS') {
                // En Route to Station:  :ERS u/{call sign or unit number}
                let callSign = (cmdObj.u).trim();
                if (callSign == "" || callSign == null) {
                    showSnackbar("Call Sign is Required for En Route to Station!", "red");
                    return;
                } else {
                    enRouteToStation(callSign);
                }
            } else if (cmd == ':ARS') {
                // Arrived at Station:   :ARS u/{call sign or unit number}
                let callSign = (cmdObj.u).trim();
                if (callSign == "" || callSign == null) {
                    showSnackbar("Call Sign is Required for Arrived at Station!", "red");
                    return;
                } else {
                    arrivedAtStation(callSign);
                }
            } else if (cmd == ':CC') {
                // Cancel Call:  :CC q/{quick call number} cr/{clear reason}
                let quickCallNo = parseInt((cmdObj.u).trim());
                let clearReason = (cmdObj.cc).trim();

                if (quickCallNo == null || typeof quickCallNo == 'undefined') {
                    showSnackbar("You must provide a Quick Call Number to Cancel a Call!", "red");
                    return;
                } else if (clearReason == "" || clearReason == null) {
                    showSnackbar("You must provide a reason for cancelling a call!", "red");
                    return;
                } else {
                    cancelCall(quickCallNo, clearReason);
                }
            } else if (cmd == ':FO') {
                // Mark fire as completely out:  :FO q/{quick call number} u/{call sign or unit number}
                let callSign = (cmdObj.u).trim();
                let quickCallNo = parseInt((cmdObj.q).trim());
                if (callSign == "" || callSign == null) {
                    showSnackbar("Call Sign is required for the FIre Out Command!", "red");
                    return;
                } else if (quickCallNo == "" || quickCallNo == null) {
                    showSnackbar("Quick Call Number is required for the Fire Out Command!", "red");
                    return;
                } else {
                    fireOut(callSign, quickCallNo);
                }

            } else if (cmd == ':FC') {
                // Mark fire under control:  :FC q/{quick call number} u/{call sign or unit number}
                let callSign = (cmdObj.u).trim();
                let quickCallNo = parseInt((cmdObj.q).trim());
                if (callSign == "" || callSign == null) {
                    showSnackbar("Call Sign is required for the Fire Control Command!", "red");
                    return;
                } else if (quickCallNo == "" || quickCallNo == null) {
                    showSnackbar("Quick Call Number is Required for the Fire Control Command!", "red");
                    return;
                } else {
                    fireControl(callSign, quickCallNo);
                }
            } else if (cmd == ':CL') {
                // Change units location on a call or in oov status:  :CL u/{call sign or unit number} a/{location}

            } else if (cmd == ':AP') {
                // Assign unit to Post Location:   :AP u/{call sign or unit number} pl/{post location}

            }
        } else if (event.keyCode == 9) {
            // tab just pressed
            event.preventDefault();
            let cmd = $("#smartBar").val();

            let cmdsplit = cmd.split('/');
            // console.log("split command length after tab = " + cmdsplit.length);

            if (cmdsplit.length == 1) {
                // good we have a command
                // now determine what to show for help text from the commands collectioin
                let cmd = cmdsplit[0].substring(1).trim();

                // console.log("Command entered is " + cmd);

                let fullCmd = Commands.findOne({ cmd: cmd });

                let myTotalCmd = ":" + cmd + " " + fullCmd.cmdArgsStruct;
                $("#smartBar").val(":" + cmd + " " + fullCmd.cmdArgsStruct).css("textColor: $f00;");
                let start_pos = fullCmd.cmdArgsStruct.indexOf('{');
                let end_pos = fullCmd.cmdArgsStruct.indexOf('}',start_pos) + 1;
                let text_to_get = fullCmd.cmdArgsStruct.substring(start_pos,end_pos)
                // console.log("Start at: " + start_pos);
                // console.log("End at: " + end_pos);
                // console.log(text_to_get);

                let field = document.getElementById('smartBar');
                let sel_start = myTotalCmd.indexOf('{');
                let sel_end = myTotalCmd.indexOf('}') + 1;
                field.setSelectionRange(sel_start, sel_end);

            } else if (cmdsplit.length > 1) {
                // now we have a new tab in our command line, find the next 'hint' text in the line, and move to it
                let currentCmd = $("#smartBar").val();
                let field = document.getElementById('smartBar');
                let sel_start = currentCmd.indexOf('{');
                let sel_end = currentCmd.indexOf('}') + 1;
                field.setSelectionRange(sel_start, sel_end);
            }
        }
    },
    'keyup input' (event) {
        if (event.keyCode == 27) {
            hideSmartBar();
        }
    },
    'focusout #smartBar' (event) {
        hideSmartBar();
    },
    "autocompleteselect input" (event, template, doc) {
        Session.set("cmdSel", doc.command);
    },
})
