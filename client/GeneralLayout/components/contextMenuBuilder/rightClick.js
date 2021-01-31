import { ContextItems } from '../../../../imports/api/contextItems.js';
import { Units } from '../../../../imports/api/units.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Transports } from '../../../../imports/api/transports.js';

Template.rightClickMenu.onCreated(function() {
    this.subscribe("activeContextItems")
    this.subscribe("activeUnits");
    this.subscribe("activeCalls");
    this.subscribe("activeTransports");
});

Template.rightClickMenu.onRendered(function() {

});

Template.rightClickMenu.helpers({
    contextOptions: function() {
        let itemClicked = Session.get("itemClicked");

        return ContextItems.find({ itemType: itemClicked });
    },
    unitStatus: function() {
        let unitId = Session.get("unitIdRightClicked");
        if (unitId == "" || unitId == null) {
            // no unit right clicked.
        } else {
            let unitInfo = Units.findOne({ _id: unitId });
            return unitInfo.currentStatus;
        }
    },
});

Template.rightClickMenu.events({
    'click .context' (event) {
        let optionIdClicked = this._id;
        let optionClicked = this.contextOption;
        console.log("Context Option clicked: " + optionClicked);
        let itemType = Session.get("itemClicked");
        console.log("itemType = " + itemType);
        let idOfObjectClicked = Session.get("clickedItemId");
        console.log("idOfObjectClicked = " + idOfObjectClicked);

        $(".context-menu").hide();

        // now handle whatever option the user clicks. This may mean opening a dialog to get mroe info
        // before proceeding (e.g. Clear would require a disposition, etc)
        if (optionClicked == "De-assign") {
            if (itemType == "unitGrid") {
                // first check to see if the unit is already 'Arrived'
                let unitId = idOfObjectClicked;
                // console.log("Call Sign from cmd: " + callSign);
                let unitInfo = Units.findOne({ _id: unitId });
                let unitCallNo = unitInfo.callNo;
                let callSign = unitInfo.callSign;
                let callInfo = Calls.findOne({ "units.unit": callSign });

                if ((typeof callInfo == 'undefined' || callInfo == null || callInfo == "") && (unitCallNo == "" || unitCallNo == null)) {
                    showSnackbar("Unit " + callSign + " does not appear to be assigned to a call!", "red");
                } else {
                    deassignUnit(callSign, callInfo, unitInfo);
                }

                // console.log("Call Sign from cmd: " + callSign);
            } else if (itemType == "unitOnCallsGrid") {
                // first check to see if the unit is already 'Arrived'
                let callId = idOfObjectClicked;
                let callSign = Session.get("unitOnCallClicked");

                // console.log("Call Number from cmd: " + callId);

                let unitInfo = Units.findOne({ callSign: callSign });
                let callInfo = Calls.findOne({ "units.unit": callSign });

                if (typeof callInfo == 'undefined' || callInfo == null || callInfo == "") {
                    showSnackbar("Unit " + callSign + " does not appear to be assigned to a call!", "red");
                } else {
                    deassignUnit(callSign, callInfo, unitInfo);
                }

                // console.log("Call Sign from cmd: " + callSign);
            }
        } else if (optionClicked == "Clear") {
            if (itemType == "unitGrid") {
                let unitId = idOfObjectClicked;
                let unitInfo = Units.findOne({ _id: unitId });
                let callSign = unitInfo.callSign;
                let callInfo = Calls.findOne({ "units.unit": callSign });

                Session.set("unitIdClr", unitId);
                Session.set("callSignClr", callSign);
                Session.set("clrType", "Unit");

                if (typeof callInfo == 'undefined' || callInfo == null || callInfo == "") {
                    showSnackbar("Unit " + callSign + " does not appear to be assigned to a call!", "red");
                } else {
                    // call the modal template to allow user to select disposition, then return to here.
                    $('#dispoMenu').css({"top": event.pageY + "px", "left": event.pageX + "px"}).show();
                }
            } else if (itemType == "unitOnCallsGrid") {
                let callId = idOfObjectClicked;
                let callSign = Session.get("unitOnCallClicked");

                console.log("Picked Call Number from cmd: " + callId);
                console.log("Unit on Call Clicked: " + callSign);

                let unitInfo = Units.findOne({ callSign: callSign });

                let unitId = unitInfo._id;

                Session.set("unitIdClr", unitId);
                Session.set("callSignClr", callSign);
                Session.set("clrType", "Unit");

                $('#dispoMenu').css({"top": event.pageY + "px", "left": event.pageX + "px"}).show();
            } else if (itemType == "callsGrid") {
                let callId = idOfObjectClicked;

                console.log("Picked Call from Dispatch view: " + callId);

                Session.set("chosenCallId", callId);
                Session.set("clrType", "Call");

                $('#dispoMenu').css({"top": event.pageY + "px", "left": event.pageX + "px"}).show();
            }
        } else if (optionClicked == "Start Transport") {
            if (itemType == "unitGrid") {
                let unitId = idOfObjectClicked;
                let unitInfo = Units.findOne({ _id: unitId });
                let callSign = unitInfo.callSign;
                let callInfo = Calls.findOne({ "units.unit": callSign });

                if (unitInfo) {
                    let unitCurrStatus = unitInfo.currentStatus;

                    if (($.inArray(unitCurrStatus, ["Available", "AS", "ER", "ERS", "ARS"])) > -1) {
                        console.log("Can't go to Transport from current status.");
                        showSnackbar("Can't Start Transport from Current Status!", "red");
                    } else {
                        Session.set("unitIdTrn", unitId);
                        Session.set("callSignTrn", callSign);
                        if (callInfo) {
                            Session.set("callNoTrn", callInfo.callNo);
                            if (!callInfo) {
                                showSnackbar("Unit " + callSign + " does not appear to be assigned to a call!", "red");
                            } else {
                                // console.log("calling transport modal from unit grid");
                                // call the modal template to allow user to select disposition, then return to here.
                                $('#startTransportModal').modal('open');
                            }
                        } else {
                            showSnackbar("Can't get Call Information for Unit!", "orange");
                        }
                    }
                } else {
                    showSnackbar("Can't find Unit Information!", "orange");
                }
            } else if (itemType == "unitOnCallsGrid") {
                let callId = idOfObjectClicked;
                let callInfo = Calls.findOne({ _id: callId });
                let callNo = callInfo.callNo;
                let callSign = Session.get("unitOnCallClicked");

                let unitInfo = Units.findOne({ callSign: callSign });

                let unitId = unitInfo._id;

                Session.set("unitIdTrn", unitId);
                Session.set("callSignTrn", callSign);
                Session.set("callNoTrn", callNo);

                console.log("starting transport modal from calls grid");
                $("#startTransportModal").modal('open');
            }
        } else if (optionClicked == "End Transport") {
            if (itemType == "unitGrid") {
                let unitId = idOfObjectClicked;
                let unitInfo = Units.findOne({ _id: unitId });
                let callSign = unitInfo.callSign;
                let callInfo = Calls.findOne({ "units.unit": callSign, active: true, "units.currentStatus": "AR / TR" });
                let onTransport = Transports.findOne({ "active": true, "callSign": callSign, });

                Session.set("unitIdTrn", unitId);
                Session.set("callSignTrn", callSign);
                Session.set("callNoTrn", callInfo.callNo);

                if (typeof callInfo == 'undefined' || callInfo == null || callInfo == "") {
                    showSnackbar("Unit " + callSign + " does not appear to be on a Transport!", "orange");
                } else {
                    let location = onTransport.trnDest;
                    let startMileage = onTransport.startMileage;
                    Session.set("startMileageToEnd", startMileage);
                    Session.set("trnLocation", location);
                    console.log("calling end transport modal from unit grid");
                    // call the modal template to allow user to select disposition, then return to here.
                    $('#endTransportModal').modal('open');
                }
            } else if (itemType == "unitOnCallsGrid") {
                let callId = idOfObjectClicked;
                let callInfo = Calls.findOne({ _id: callId });
                let callNo = callInfo.callNo;
                let callSign = Session.get("unitOnCallClicked");

                let unitInfo = Units.findOne({ callSign: callSign });
                let onTransport = Transports.findOne({ "active": true, "callSign": callSign });
                console.log("found thie mileage: " + onTransport.startMileage);

                let unitId = unitInfo._id;

                Session.set("unitIdTrn", unitId);
                Session.set("callSignTrn", callSign);
                Session.set("callNoTrn", callNo);

                if (typeof callInfo == 'undefined' || callInfo == null || callInfo == "") {
                    showSnackbar("Unit " + callSign  + " does not appear to be on a Transport!", "orange");
                } else {
                    let location = onTransport.trnDest;
                    let startMileage = onTransport.startMileage;
                    // console.log("Start Mileage picked up: " + startMileage);
                    Session.set("startMileageToEnd", startMileage);
                    Session.set("trnLocation", location);
                    // console.log("starting end transport modal from calls grid");
                    $("#endTransportModal").modal('open');
                }
            }
        } else if (optionClicked == "Make Primary") {
            if (itemType == "unitGrid") {
                let unitId = idOfObjectClicked;
                let unitInfo = Units.findOne({ _id: unitId });
                let callSign = unitInfo.callSign;
                let callInfo = Calls.findOne({ "units.unitId": unitId, active: true, "units.currentStatus": { $in: [ "AS", "ER", "AR / TR", "AR", "HLD" ] }})
                let callNumber = callInfo.callNo;
                let callId = callInfo._id;

                if (unitInfo.primaryUnit == true) {
                    showSnackbar("This Unit is Already Primary!", "orange");
                    return;
                } else {
                    // let's make sure we can find the information we need to pass.
                    if (unitId == "" || unitId == null || callSign == "" || callSign == null || callId == "" || callId == null || callNumber == "" || callNumber == null) {
                        // if we can't find the information we need, aler tthe user with a snackbar notification.
                        showSnackbar("Cannot Find Necessary Information to Make this Change!", "red");
                        return;
                    } else {
                        makePrimary(unitId, callSign, callNumber, callId);
                    }
                }
            } else if (itemType == "unitOnCallsGrid") {
                let callId = idOfObjectClicked;
                let callInfo = Calls.findOne({ _id: callId });
                let callNo = callInfo.callNo;
                let callSign = Session.get("unitOnCallClicked");

                let unitInfo = Units.findOne({ callSign: callSign });
                let unitId = unitInfo._id;

                if (unitInfo.primaryUnit == true) {
                    showSnackbar("This Unit is Already Primary!", "orange");
                    return;
                } else {
                    // let's make sure we can find the information we need to pass.
                    if (unitId == "" || unitId == null || callSign == "" || callSign == null || callId == "" || callId == null || callNumber == "" || callNumber == null) {
                        // if we can't find the information we need, aler tthe user with a snackbar notification.
                        showSnackbar("Cannot Find Necessary Information to Make this Change!", "red");
                        return;
                    } else {
                        makePrimary(unitId, callSign, callNo, callId);
                    }
                }
            }
        } else if (optionClicked == 'Fire Control') {
            if (itemType == "unitOnCallsGrid") {
                let callId = idOfObjectClicked;
                let callInfo = Calls.findOne({ _id: callId });
                let quickCallNo = callInfo.quickCallNo;
                let callSign = Session.get("unitOnCallClicked");

                fireControl(callSign, quickCallNo);
            } else if (itemType = "unitGrid") {
                let unitId = idOfObjectClicked;
                let unitInfo = Units.findOne({ _id: unitId });
                let callSign = unitInfo.callSign;
                let callInfo = Calls.findOne({ "units.unitId": unitId, active: true, "units.currentStatus": { $in: [ "AS", "ER", "AR / TR", "AR", "HLD" ] }})
                let quickCallNo = callInfo.quickCallNo;
                let callId = callInfo._id;

                fireControl(callSign, quickCallNo);
            }
        } else if (optionClicked == 'Fire Out') {
            if (itemType == "unitOnCallsGrid") {
                let callId = idOfObjectClicked;
                let callInfo = Calls.findOne({ _id: callId });
                let quickCallNo = callInfo.quickCallNo;
                let callSign = Session.get("unitOnCallClicked");

                fireOut(callSign, quickCallNo);
            } else if (itemType == "unitGrid") {
                let unitId = idOfObjectClicked;
                let unitInfo = Units.findOne({ _id: unitId });
                let callSign = unitInfo.callSign;
                let callInfo = Calls.findOne({ "units.unitId": unitId, active: true, "units.currentStatus": { $in: [ "AS", "ER", "AR / TR", "AR", "HLD" ] }})
                let quickCallNo = callInfo.quickCallNo;
                let callId = callInfo._id;

                fireOut(callSign, quickCallNo);
            }
        } else if (optionClicked == 'Cancel Call') {
            if (itemType == "callsGrid") {

            }
        }
    },
});
