import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { CallPriorities } from './callPriorities.js';
import { Entities } from './entities.js';
import { Units } from './units.js';
import { ErrorLogs } from './errorLogs.js';

export const Calls = new Mongo.Collection('calls');

Calls.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
// ****************************************************************************************
//
// Create a New Call
//
// ****************************************************************************************
    'call.create' (callLocation, callNo, callType, callPriority, callers, notes, associations, subjects, vehicles, callSheetStartedAt, usersEntity, parentEntity) {
        check(callLocation, String);
        check(callNo, String);
        check(callType, String);
        check(callPriority, String);
        check(callers, [String]);
        check(notes, [String]);
        check(subjects, [String]);
        check(vehicles, [String]);
        check(callSheetStartedAt, Date);
        check(usersEntity, String);
        check(parentEntity, String)

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to create a call sheet.');
        }

        let qcNumber = "";

        let qcno = Calls.find({}, { sort: { sentToDispatchAt: -1 }, limit: 1 }).fetch();
        console.log("*** --- *** --- ***");
        console.dir(qcno);

        if (typeof qcno == 'undefined' || qcno == null || qcno == "") {
            console.log("*** Quick Call No was undefined ***");
            qcNumber = 1;
        } else if (qcno[0].quickCallNo == 9999 ) {
            console.log("Number reached 9999, reset!");
            qcNumber = 1;
        } else {
            console.log("quick Call from call: " + qcno[0].quickCallNo);
            let qcno_old = qcno[0].quickCallNo;
            qcNumber = qcno_old + 1;
        }

        console.log("************    qcNumber: " + qcNumber);

        var priorityInfo = CallPriorities.findOne({ callTypePriority: callPriority });
        var priorityColor = priorityInfo.priorityColor;

        return Calls.insert({
            quickCallNo: qcNumber,
            callNo: callNo,
            location: callLocation,
            type: callType,
            priority: callPriority,
            priorityColor: priorityColor,
            callers: callers,
            notes: notes,
            associations: associations,
            subjects: subjects,
            alerts: [],
            vehicles: vehicles,
            callUserEntity: usersEntity,
            callParentEntity: parentEntity,
            active: true,
            createdBy: Meteor.users.findOne(this.userId).username,
            sentToDispatchAt: new Date(),
        });
    },

    'call.update' (callId, callLocation, callNo, callType, callPriority, callers, notes, associations, subjects, vehicles, usersEntity, parentEntity) {
        check(callId, String);
        check(callLocation, String);
        check(callNo, String);
        check(callType, String);
        check(callPriority, String);
        check(callers, [String]);
        check(notes, [String]);
        check(subjects, [String]);
        check(vehicles, [String]);
        check(usersEntity, String);
        check(parentEntity, String)

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to create a call sheet.');
        }

        return Calls.update({ _id: callId }, {
            $set: {
                location: callLocation,
                type: callType,
                priority: callPriority,
                associations: associations,
                lastUpdatedBy: Meteor.users.findOne(this.userId).username,
                lastUpdatedAt: new Date(),
            }
        });
    },

// ****************************************************************************************
//
// Add a single note on a Call
//
// ****************************************************************************************
    'call.updateNote' (call_id, noteText) {
        check(call_id, String);
        check(noteText, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add call notes.');
        }

        Calls.update({ _id: call_id }, {
            $addToSet: {
                notes: {
                    note: noteText,
                    addedOn: new Date(),
                    addedBy: Meteor.users.findOne(this.userId).username,
                }
            }
        });
    },

// ****************************************************************************************
//
// Add Multiple Notes to a Call
//
// ****************************************************************************************
    'call.addNotes' (callId, noteArr) {
        check(callId, String);
        check(noteArr, [Object]);

        // console.log("got to add notes method.");
        // console.dir(noteArr);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add call notes.');
        }

        let notesLength = noteArr.length;
        // console.log("Notes Length: " + notesLength);
        // console.log("Adding: " + noteArr[2].note);

        for (len=0; len < notesLength; len++) {
            Calls.update({ _id: callId }, {
                $addToSet: {
                    notes: {
                        note: noteArr[len].note,
                        addedOn: noteArr[len].addedOn,
                        addedBy: noteArr[len].addedBy
                    },
                }
            });
        }

    },

// ****************************************************************************************
//
// Assign or Queue Units
//
// ****************************************************************************************
    'call.assignUnit' (callId, callNumber, unitId, callSign) {
        check(callId, String);
        check(callNumber, String);
        check(unitId, String);
        check(callSign, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to assign units to calls.');
        }

        let currentlyAssn = {};

        let unitInfo = Units.findOne({ _id: unitId });

        // ***********************************************************************************
        //
        // let's check to see if this unit is already assigned to this call
        //
        // ***********************************************************************************
        let assnThisCall = Calls.findOne({ _id: callId, "units.unitId": unitId });
        if (typeof assnThisCall != 'undefined' && assnThisCall != null && assnThisCall != "") {
            // console.log("already assigned to this call.");
            return "AlreadyOnCall";
            Meteor.call("Log.Errors", "/imports/api/calls.js", "call.assignUnit - unit already assigned.", err);
        }

        // ***********************************************************************************
        //
        // let's check to see if this unit is already assigned to any calls
        //
        // ***********************************************************************************
        if (unitInfo.oovRemAvail == true) {
            currentlyAssn = Units.findOne({ _id: unitId, currentStatus: { $in: [ "AS", "ER", "AR", "TR", "AS / Qd", "Hld / Re-AS" ] }});
        } else {
            currentlyAssn = Units.findOne({ _id: unitId, currentStatus: { $in: [ "AS", "ER", "AR", "TR", "OV", "OV / Qd", "AS / Qd", "Hld / Re-AS" ] }});
        }

        // console.log("******** -------- ******** -------- ********");
        // console.dir(currentlyAssn);

        // ***********************************************************************************
        //
        // let's find out if this is the first unit assigned to this call.  If it is, we'll
        // make it the primary unit for the call.
        //
        // ***********************************************************************************

        let isFirstUnitAssigned = Units.find({ callNo: callNumber }).count();
        if (isFirstUnitAssigned == 0) {
            var isPrimary = true;
        } else {
            var isPrimary = false;
        }

        // ***********************************************************************************
        //
        // if not assigned to a call, we'll assign it to this call.
        //
        // ***********************************************************************************
        if (typeof currentlyAssn == 'undefined' || currentlyAssn == null || currentlyAssn == "") {
            // console.log("----- Not currently assigned. -----");
            return Calls.update({ _id: callId }, {
                $addToSet: {
                    units: {
                        unitId: unitId,
                        unit: callSign,
                        currentStatus: "AS",
                        statusColor: "yellow",
                        textColor: "black",
                        assignable: false,
                        primaryUnit: isPrimary,
                        assignedBy: Meteor.users.findOne(this.userId).username,
                        assignedOn: new Date(),
                    },
                }
            });
        } else {
            // ***********************************************************************************
            //
            // if the unit is assigned to another call, we'll queue it instead
            // So first, let's get the current queue order, so we can increment it up.
            //
            // ***********************************************************************************
            currentQueueOrder = currentlyAssn.queueOrder;
            // console.log("currentQueueOrder = " + currentQueueOrder);
            if (typeof currentQueueOrder == 'undefined' || currentQueueOrder == null || currentQueueOrder == "") {
                queOrder = 1;
                // console.log("Que-ing as 1");
            } else {
                queOrder = currentQueueOrder + 1;
                // console.log("Queuing as " + queOrder);
            }

            return Calls.update({ _id: callId }, {
                $addToSet: {
                    units: {
                        unitId: unitId,
                        unit: callSign,
                        currentStatus: "AS / Qd",
                        statusColor: "grey darken-2",
                        textColor: "white",
                        queuedOrder: queOrder,
                        queuedBy: Meteor.users.findOne(this.userId).username,
                        queuedOn: new Date(),
                    },
                }
            });
        }
    },

// ****************************************************************************************
//
// Put a Unit EnRoute
//
// ****************************************************************************************
    'call.enrouteUnit' (callId, callNumber, callSign, unitId) {
        check(callId, String);
        check(callNumber, String);
        check(callSign, String);
        check(unitId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to enroute units to calls.');
        }

        return Calls.update({ _id: callId, "units.unitId": unitId }, {
            $set: {
                    "units.$.statusColor": "#74eeea",
                    "units.$.textColor": "black",
                    "units.$.currentStatus": "ER",
                    "units.$.enrouteBy": Meteor.users.findOne(this.userId).username,
                    "units.$.enrouteOn": new Date(),
            },
        });
    },

// ****************************************************************************************
//
// Arrive a Unit On Scene
//
// ****************************************************************************************
    'call.arriveUnit' (callId, callNumber, callSign, unitId) {
        check(callId, String);
        check(callNumber, String);
        check(unitId, String);
        check(callSign, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to arrive units to calls.');
        }

        let arrivedUnitCount = Calls.find({ "units.currentStatus": "AR", _id: callId }).count();

        // ***********************************************************************************
        //
        // check if a first on Scene unit is already set, and if not, set it.
        //
        // ***********************************************************************************
        if (arrivedUnitCount == 0) {
            var firstOnScene = new Date();

            return Calls.update({ _id: callId, "units.unitId": unitId }, {
                $set: {
                    firstOnScene: firstOnScene,
                    "units.$.statusColor": "green",
                    "units.$.textColor": "white",
                    "units.$.currentStatus": "AR",
                    "units.$.arrivedBy": Meteor.users.findOne(this.userId).username,
                    "units.$.arrivedOn": new Date(),
                }
            });
        } else { // now set the rest of the units after first on scene arrival.
            return Calls.update({ _id: callId, "units.unitId": unitId }, {
                $set: {
                    "units.$.statusColor": "green",
                    "units.$.textColor": "white",
                    "units.$.currentStatus": "AR",
                    "units.$.arrivedBy": Meteor.users.findOne(this.userId).username,
                    "units.$.arrivedOn": new Date(),
                }
            });
        }
    },

// ****************************************************************************************
//
// DeAssign a Unit
//
// ****************************************************************************************
    'call.deassignUnit' (callId, callSign, unitId) {
        check(callId, String);
        check(callSign, String);
        check(unitId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to deassign units from calls.');
        }

        // ***********************************************************************************
        //
        // Let's find out if the unit is in the AS or ER state, and if so, we'll know we can
        // deassign it.  This also allows us to get the callId which is a unique id.
        //
        // ***********************************************************************************
        let assnCall = Calls.findOne({ callNo: callId, "units.unit": callSign, active: true, "units.currentStatus": { $in: [ "AS", "ER" ]} });
        let newCallSign = "DA " + callSign;
        let newUID = "DA " + unitId;

        // ***********************************************************************************
        //
        // Ok, let's deassign our unit from the current call since he doesn't appear to be queued
        //
        // ***********************************************************************************
        Calls.update({ _id: callId, "units.unitId": unitId }, {
            $set: {
                "units.$.unitId": newUID,
                "units.$.unit": newCallSign,
                "units.$.callSign": callSign,
                "units.$.UID": unitId,
                "units.$.statusColor": "grey lighten-2",
                "units.$.textColor": "black",
                "units.$.currentStatus": "DeAssigned",
                "units.$.assignable": true,
                "units.$.deAssignedBy": Meteor.users.findOne(this.userId).username,
                "units.$.deAssignedOn": new Date(),
            }
        });

        // ***********************************************************************************
        //
        // Next let's lookup the unit and see if it's queued on any other calls.
        //
        // ***********************************************************************************
        let queuedNow = Calls.find({ "units.unitId": unitId, "units.currentStatus": "AS / Qd" }).count();
        if (queuedNow > 0) {
            // ***********************************************************************************
            //
            // unit is queued, so let's make sure we get it assigned to the next call in order.
            //
            // ***********************************************************************************
            nextCallUp = Calls.find({ "units.unitId": unitId, "units.currentStatus": "AS / Qd" }, { $sort: { queueOrder: 1},  $limit: 1 }).fetch();
            nextCallNo = nextCallUp[0].callNo;
            nextCallId = nextCallUp[0]._id;

            // ***********************************************************************************
            //
            // Let's assign out unit to his / her next call
            //
            // ***********************************************************************************
            Calls.update({ _id: nextCallId, "units.unitId": unitId }, {
                $set: {
                    "units.$.statusColor": "yellow",
                    "units.$.textColor": "black",
                    "units.$.currentStatus": "AS",
                    "units.$.assignable": false,
                    "units.$.assignedBy": Meteor.users.findOne(this.userId).username,
                    "units.$.assignedOn": new Date(),
                }
            });
        }
    },

// ****************************************************************************************
//
// Clear a single Unit from a Call
//
// ****************************************************************************************
    'call.clearUnit' (unitId, callSign, disposition) {
        check(unitId, String);
        check(callSign, String);
        check(disposition, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to clear units from calls.');
        }

        // ***********************************************************************************
        //
        // We need to trim the disposition we sent to make sure there are no trailing / leading
        // spaces on it...just for neatness sake.
        //
        // ***********************************************************************************
        let trimDispo = disposition.trim();
        let assnCall = Calls.findOne({ "units.unit": callSign, "units.currentStatus": { $in: [ "AR", "AR / Qd" ]} });
        let callId = assnCall._id;
        let callNo = assnCall.callNo;
        let newCallSign = "CLR " + callSign;
        let newUID = "CLR " + unitId;

        // ***********************************************************************************
        //
        // Now we want to find out how many units are assigned to this call. If this unit is
        // the only one, then we need to clear the call, not just the unit.
        //
        // ***********************************************************************************
        let unitsOnCall = Units.find({ callNo: callNo }).fetch();

        let unitsCount = unitsOnCall.length;
        // console.log("units on call for clear: " + unitsCount);
        if (unitsCount >= 1) {
            // ***********************************************************************************
            //
            // first we clear just 1 unit, but not the last unit on the call
            // so we don't set the call disposition yet.
            //
            // ***********************************************************************************
            Calls.update({ _id: callId, "units.unitId": unitId }, {
                $set: {
                    "units.$.unitId": newUID,
                    "units.$.unit": newCallSign,
                    "units.$.callSign": callSign,
                    "units.$.UID": unitId,
                    "units.$.statusColor": "grey lighten-2",
                    "units.$.textColor": "black",
                    "units.$.currentStatus": "Cleared",
                    "units.$.assignable": true,
                    "units.$.clearedBy": Meteor.users.findOne(this.userId).username,
                    "units.$.clearedOn": new Date(),
                    "units.$.disposition": trimDispo,
                    "units.$.primaryUnit": false,
                }
            });
        } else {
            // ***********************************************************************************
            //
            // here we are clearing the last unit on the call, so we clear the entire call.
            //
            // ***********************************************************************************
            Calls.update({ _id: callId, "units.unitId": unitId }, {
                $set: {
                    active: false,
                    callDisposition: trimDispo,
                    "units.$.unitId": newUID,
                    "units.$.unit": newCallSign,
                    "units.$.callSign": callSign,
                    "units.$.UID": unitId,
                    "units.$.statusColor": "grey lighten-2",
                    "units.$.textColor": "black",
                    "units.$.currentStatus": "Cleared",
                    "units.$.assignable": true,
                    "units.$.clearedBy": Meteor.users.findOne(this.userId).username,
                    "units.$.clearedOn": new Date(),
                    "units.$.disposition": trimDispo,
                }
            });

            Meteor.call('transport.callNotActive', callId);
        }

        // ***********************************************************************************
        //
        // Next let's lookup the unit and see if it's queued on any other calls.
        //
        // ***********************************************************************************
        let queuedNow = Calls.find({ "units.unit": callSign, "units.currentStatus": "AS / Qd" }).count();
        if (queuedNow > 0) {
            // ***********************************************************************************
            //
            // unit is queued, so let's make sure we get it assigned to the next call in order.
            //
            // ***********************************************************************************
            nextCallUp = Calls.find({ "units.unit": callSign, "units.currentStatus": "AS / Qd" }, { $sort: { queueOrder: 1},  $limit: 1 }).fetch();
            nextCallNo = nextCallUp[0].callNo;
            nextCallId = nextCallUp[0]._id;

            // ***********************************************************************************
            //
            // Let's assign out unit to his / her next call
            //
            // ***********************************************************************************
            Calls.update({ _id: nextCallId, "units.unit": callSign }, {
                $set: {
                    "units.$.statusColor": "yellow",
                    "units.$.textColor": "black",
                    "units.$.currentStatus": "AS",
                    "units.$.assignable": false,
                    "units.$.assignedBy": Meteor.users.findOne(this.userId).username,
                    "units.$.assignedOn": new Date(),
                }
            });
        }
    },

// ****************************************************************************************
//
// Clear all units from a call and close the call
//
// ****************************************************************************************
    'call.clearCall' (callId, disposition) {
        check(callId, String);
        check(disposition, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to clear units from calls.');
        }

        let callSigns = []; // <-- we'll use this in a minute
        let currCallInfo = Calls.find({ _id: callId }).fetch();

        // ***********************************************************************************
        //
        // get the number of units on the call and clear them with a loop - we are setting the
        // call disposition each time but it's the same dispo over and over, and just an update to
        // the same field.
        //
        // ***********************************************************************************

        let unitsCount = currCallInfo.units.length;

        // ***********************************************************************************
        //
        // assign the unit numbers on the call to an array
        //
        // ***********************************************************************************

        for (t = 0; t < unitsCount; t++) {
            if (currCallInfo.units[t].currentStatus == "Cleared" || currCallInfo.units[t].currentStatus == "DeAssigned") {
                // don't count
            } else {
                callSigns.push(currCallInfo.units[t].unit);
            }
        }

        for (u = 0; u < unitsCount; u++) {
            if (currCallInfo.units[t].currentStatus == "Cleared" || currCallInfo.units[t].currentStatus == "DeAssigned") {
                // don't count
            } else {
                Calls.update({ _id: callId }, {
                    $set: {
                        callDisposition: disposition,
                        "units[u].$.statusColor": "grey lighten-2",
                        "units[u].$.textColor": "black",
                        "units[u].$.currentStatus": "Cleared",
                        "units[u].$.clearedBy": Meteor.users.findOne(this.userId).username,
                        "units[u].$.clearedOn": new Date(),
                        "units[u].$.disposition": disposition,
                    }
                });
            }
        }

        // ***********************************************************************************
        //
        // Now we want to run the loop again, but this time, we need to see if any of these
        // units are queued for other calls, and if so, we need to move them to those next
        // calls automatically in the background for the user.
        //
        // ***********************************************************************************
        for (v = 0; v < unitsCount; v++) {

            // ***********************************************************************************
            //
            // Next let's lookup the unit and see if it's queued on any other calls.
            //
            // ***********************************************************************************
            let queuedNow = Calls.find({ "units.unit": callSigns[v], "units.currentStatus": "AS / Qd" }).count();
            if (queuedNow > 0) {

                // ***********************************************************************************
                //
                // unit is queued, so let's make sure we get it assigned to the next call in order.
                //
                // ***********************************************************************************
                nextCallUp = Calls.find({ "units.unit": callSigns[v], "units.currentStatus": "AS / Qd" }, { $sort: { queueOrder: 1},  $limit: 1 }).fetch();
                nextCallNo = nextCallUp[0].callNo;
                nextCallId = nextCallUp[0]._id;

                // ***********************************************************************************
                //
                // Let's assign our unit to his / her next call
                //
                // ***********************************************************************************
                Calls.update({ _id: nextCallId, "units.unit": callSigns[v] }, {
                    $set: {
                        "units.$.statusColor": "yellow",
                        "units.$.textColor": "black",
                        "units.$.currentStatus": "AS",
                        "units.$.assignable": false,
                        "units.$.assignedBy": Meteor.users.findOne(this.userId).username,
                        "units.$.assignedOn": new Date(),
                    }
                });
            }
        }

        Meteor.call('transport.callNotActive', callId);
    },
// ******************************************************************************
//
// Cancel a call without completing the unit dispatches on it.
//
// ******************************************************************************
    'call.cancel' (callId, cancelReason) {
        check(callId, String);
        check(cancelReason, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to start unit transport on call.');
        }

        Meteor.call('transport.callNotActive', callId);

        return Calls.update({ _id: callId }, {
            $set: {
                callDisposition: "Cancelled",
                cancelReason: cancelReason,
                cancelledBy: Meteor.users.findOne(this.userId).username,
                cancelledOn: new Date(),
                active: false,
            }
        });
    },
// ******************************************************************************
//
// Start Transport for Unit on Call
//
// ******************************************************************************
    'call.startTransport' (callId, unitId, callNo, callSign) {
        check(callNo, String);
        check(unitId, String);
        check(callSign, String);
        check(callNo, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to start unit transport on call.');
        }

        // make sure unit is assigned to this call,
        // make sure call is active, and
        // make sure unit is arrived on this call.
        let arrivedNow = Calls.findOne({ "units.unit": callSign, "units.currentStatus": "AR", active: true });
        if (!arrivedNow) {
            console.log("Unit is not arrived on any active call.");
            return ("not arrived");
        }

        // make sure unit is not already in a transport
        let inTrans = Calls.findOne({ "units.unit": callSign, "units.currentStatus": "AR / TR", active: true });

        if (inTrans) {
            console.log("Unit is already on a transport.");
            return ("already in transport");
        }

        // start unit transport on call
        Calls.update({ callNo: callNo, "units.unit": callSign }, {
            $set: {
                "units.$.currentStatus": "AR / TR",
                "units.$.statusColor": "#00CC00",
                "units.$.textColor": "white",
            }
        });
    },
// ******************************************************************************
//
// End Transport for Unit on Call
//
// ******************************************************************************
    'calls.endTransport' (callNo, callSign) {
        check(callNo, String);
        check(callSign, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to end a unit transport on call.');
        }

        Calls.update({ callNo: callNo, "units.unit": callSign, active: true }, {
            $set: {
                "units.$.currentStatus": "AR",
                "units.$.statusColor": "green",
                "units.$.textColor": "white",
            }
        });
    },
// ******************************************************************************
//
// Add lat and long from an address for a call
//
// ******************************************************************************
    'call.addLatLong' (callId, latitude, longitude) {
        check(callId, String);
        check(latitude, Number);
        check(longitude, Number);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add lat and long on a call.');
        }

        Calls.update({ _id: callId }, {
            $set: {
                latitude: latitude,
                longitude: longitude,
            }
        });
    },
// ******************************************************************************
//
// Change the Primary Unit on Call
//
// ******************************************************************************
    'call.changePrimary' (callId, unitNo) {
        check(callId, String);
        check(unitNo, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to change primary unit.');
        }

        // ****    get the original Call Information and call number based on the callId passed.
        let callInfo = Calls.findOne({ _id: callId });
        let callNo = callInfo.callNo;

        // ****    get the unit _id of the unit that should be primary now
        let priInfo = Units.findOne({ callSign: unitNo });
        let priInfoNew = priInfo._id;

        // ****    first we need to find the unit on the call that is currently primary
        // ****    so we can remove their primary status once we update the status of the
        // ****    selected unit.
        let priUnitOrig = Units.findOne({ callNo: callNo, primaryUnit: true });

        let unitIdOrig = "";

        if (typeof priUnitOrig != 'undefined' && priUnitOrig != null && priUnitOrig != "") {
            unitIdOrig = priUnitOrig._id;

            // now let's remove the primary flag from that unit.
            Calls.update({ _id: callId, "units.unitId": unitIdOrig }, {
                $set: {
                    "units.$.primaryUnit": false,
                }
            });
        } else {
            unitIdOrig = "None";
        }

        console.log("---- **** Original Primary Unit ID is set to: " + unitIdOrig);

        Calls.update({ _id: callId, "units.unitId": priInfoNew }, {
            $set: {
                "units.$.primaryUnit": true,
            }
        });

        Meteor.call('unit.makePrimary', unitIdOrig, priInfoNew, function(err, result) {
            if (err) {
                console.log("Error changing primary in Units: " + err);
            } else {
                console.log("Primary changed in Units successfully!");
            }
        });
    },
// ******************************************************************************
//
// Set Unit in En Route to Station Status
//
// ******************************************************************************
    'call.enRouteUnitToStation' (callId, unitId) {
        check(callId, String);
        check(unitId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to enroute units to calls.');
        }

        return Calls.update({ _id: callId, "units.unitId": unitId }, {
            $set: {
                    "units.$.statusColor": "#FFA500",
                    "units.$.textColor": "black",
                    "units.$.currentStatus": "ERS",
                    "units.$.ERS-By": Meteor.users.findOne(this.userId).username,
                    "units.$.ERS-On": new Date(),
            },
        });
    },
// ******************************************************************************
//
// Set Unit in Arrive At Station Status
//
// ******************************************************************************
    'call.arriveUnitAtStation' (callId, unitId) {
        check(callId, String);
        check(unitId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to enroute units to calls.');
        }

        return Calls.update({ _id: callId, "units.unitId": unitId }, {
            $set: {
                    "units.$.statusColor": "#228B22",
                    "units.$.textColor": "black",
                    "units.$.currentStatus": "ARS",
                    "units.$.ERS-By": Meteor.users.findOne(this.userId).username,
                    "units.$.ERS-On": new Date(),
            },
        });
    },
    'set.fireControl' (callId, callSign){
        check(callId, String);
        check(callSign, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to set Fire Control status.');
        }

        let fireControlTime = new Date();
        let noteMsg = "Fire Control reported at " + fireControlTime + " by unit " + callSign + ".";
        return Calls.update({ _id: callId }, {
            $set: {
                fireControlTime: fireControlTime,
                fireControlReportedBy: callSign,
                fireControlEnteredBy: Meteor.users.findOne(this.userId).username,
            },
            $addToSet: {
                notes: {
                    note: noteMsg,
                    addedOn: new Date(),
                    addedBy: Meteor.users.findOne(this.userId).username,
                }
            },
        });
    },
    'set.fireOut' (callId, callSign){
        check(callId, String);
        check(callSign, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to set Fire Out status.');
        }

        let fireOutTime = new Date();
        let noteMsg = "Fire Out reported at " + fireOutTime + " by unit " + callSign + ".";
        return Calls.update({ _id: callId }, {
            $set: {
                fireControlTime: fireOutTime,
                fireControlReportedBy: callSign,
                fireControlEnteredBy: Meteor.users.findOne(this.userId).username,
            },
            $addToSet: {
                notes: {
                    note: noteMsg,
                    addedOn: new Date(),
                    addedBy: Meteor.users.findOne(this.userId).username,
                }
            },
        });
    },
});
