import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';
import { Calls } from './calls.js';

export const Units = new Mongo.Collection("units");

Units.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    // *****************************************************************************
    //
    // Add units for an entity / agency to the system
    //
    // *****************************************************************************
    'add.serviceUnits' (unitCallSigns, unitEntity, unitType, unitSubType, unitPriDiv, unitSecDiv) {
        check(unitCallSigns, [{tag: String}]);
        check(unitEntity, String);
        check(unitType, String);
        check(unitSubType, String);
        check(unitPriDiv, String);
        check(unitSecDiv, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add new service units.');
        }

        let callSignCount = unitCallSigns.length;

        let entities = Entities.findOne({ entityName: unitEntity });
        let parentEntity = entities.entityParent;
        if (parentEntity == null) {
            parentEntity = unitEntity;
        }

        // units can have a service status of 'InService', 'OutOfService', or 'OnCall'

        for (i=0; i<callSignCount; i++) {
            Units.insert({
                callSign: unitCallSigns[i].tag,
                unitEntity: unitEntity,
                parentEntity: parentEntity,
                type: unitType,
                subType: unitSubType,
                primaryDivision: unitPriDiv,
                secondaryDivision: unitSecDiv,
                active: true,
                serviceStatus: "OutOfService",
                currentStatus: "Available",
                oovType: "",
                oovLocation: "",
                oovRemAvail: "",
                addedBy: Meteor.users.findOne(this.userId).username,
                addedOn: new Date(),
            });
        }
    },
    // *****************************************************************************
    //
    // Change a unit's status on a call
    //
    // *****************************************************************************
    'units.changeCurrentStatus' (unitId, callSign, currentStatus, callNo) {
        check(unitId, String);
        check(currentStatus, String);
        check(callSign, String);
        check(callNo, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to change units current status.');
        }

        // set a few variables we'll use below
        let callId = "";
        let disposition = "";
        let statusColor = "";
        let textColor = "";
        let setStatus = "";
        let statusSent = "";
        let ovt = "";
        let ovLoc = "";
        let ovType = "";
        let ovLocation = "";
        let remAvail = true;
        let isAvail = true;

        let statusOV = currentStatus.split('/');
        if (statusOV[0] == "OV") {
            currentStatus = statusOV[0];
            ovt = statusOV[1];
            ovLoc = statusOV[2];
            remAvail = statusOV[3];
            if (remAvail == "true") {
                remAvail = true;
            } else {
                remAvail = false;
            }
        } else {
            statusSent = currentStatus.split(' ');
            currentStatus = statusSent[0];
            // console.log("status sent: " + currentStatus + " and from " + statusSent[0]);
            if (statusSent[1]) {
                // console.log("statusSent[1]: " + statusSent[1]);
                disposition = statusSent[1];
            }
        }

        // check if unit is already assigned, en route, arrived, etc. on a call, and if so, queue the unit instead.
        let unitAssnNow = Units.findOne({ _id: unitId, currentStatus: { $in: ["AS", "AS / Qd", "ER", "AR", "AR / TR", "Welfare", "AS / HLD", "OV", "OV / Qd"] }});
        let currentQueueOrder = 0;
        let newQueueOrder = 0;

        // should the unit be queued if it's in OV status, or just thrown onto that call.
        let unitStatusOV = Units.findOne({ _id: unitId });
        if (unitStatusOV.currentStatus == "OV") {
            if (unitStatusOV.oovRemAvail == true) {
                // we can just assign the unit normally.
                ovStatus = "OV-Assignable";
            } else {
                // we need to queue the unit, and it will be assigned, when set Back In Vehicle.
                ovStatus = "OV-Queue";
            }
        }

        // use the information from above to check if unit is assigned...if it's not our query should give 'undefined'
        // but we'll check fur null and empty string anyway.
        if (typeof unitAssnNow != 'undefined' && unitAssnNow != null && unitAssnNow != "") {
            if (unitAssnNow.callNo != callNo) {
                // now check to see if the call number we dropped the unit on, is the same as the call number it's
                // already assigned to, and if it isn't queue it on this call.
                var currStatus = unitAssnNow.currentStatus;
                if (typeof ovStatus == "undefined") {
                    currentStatus = "AS";
                } else if (ovStatus == "OV-Queue") {
                    currentStatus = "OV / Qd";
                    ovt = unitStatusOV.oovType;
                    ovLoc = unitStatusOV.oovLocation;
                } else {
                    currentStatus = "AS / Qd";
                }

                currentQueueOrder = unitAssnNow.queueOrder;
                newQueueOrder = currentQueueOrder + 1;
            } else if (currentStatus == "AS") {
                // check if the unit is supposed to be assigned to the call even though the call number is the same
                // and if so, return that it's already assigned.   We catch this client side, so we shouldn't get here.
                // console.log("Unit Already Assigned to this Call");
                return "Already Assigned To this Call";
            } else if (currentStatus == "Cleared" || currentStatus == "DeAssigned" || currentStatus == "BV") {
                // now we need to check if we are clearing this unit from a call or de-assigning it.
                // if so, then we need to move it to the next queued call in the list.
                queueCount = Calls.find({ "units.unit": callSign, $or: [ { "units.currentStatus": "AS / Qd" }, { "units.currentStatus": "OV / Qd" } ] }).count();
                // console.log("Queue Count: " + queueCount);
                if (queueCount > 1) {
                    currentStatus = "CLR Move Queue";
                    nextQueueUp = Calls.find({ "units.unit": callSign, "units.currentStatus": "AS / Qd" }, { $sort: { queueOrder: 1},  $limit: 1 }).fetch();
                    callNo = nextQueueUp[0].callNo;
                    callId = nextQueueUp[0].callId;
                } else if (queueCount == 1) {
                    let nextQueueUp = Calls.findOne({ "units.unit": callSign, "units.currentStatus": "AS / Qd" });
                    callNo = nextQueueUp.callNo;
                    callId = nextQueueUp.callId;
                    currentStatus = "Qd";
                } else {
                    // no queue waiting
                    currentStatus = "Available";
                }
            }
        }

        switch(currentStatus) {
            case "CLR Move Queue":
                setStatus = "AS / Qd";
                statusColor = "green darken-2";
                textColor = "white";
                isPrimary = false;
                isAvail = true;
                break;
            case "Qd":
                setStatus = "AS / Qd";
                statusColor = "yellow";
                textColor = "black";
                isAvail = false;
                break;
            case "AS":
                setStatus = "AS";
                statusColor = "yellow";
                textColor = "black";
                isAvail = false;
                break;
            case "ER":
                setStatus = "ER";
                statusColor = "#74eeea";
                textColor = "black";
                isAvail = false;
                break;
            case "ERS":
                setStatus = "ERS";
                statusColor = "#FFA500";
                textColor = "black";
                isAvail = true;
                break;
            case "AR":
                setStatus = "AR";
                statusColor = "green";
                textColor = "white";
                isAvail = false;
                break;
            case "ARS":
                setStatus = "ARS";
                statusColor = "#228B22"
                textColor = "white";
                isAvail = true;
                break;
            case "AR / TR":
                setStatus = "AR / TR";
                isAvail = false;
                break;
            case "Welfare":
                setStatus = currStatus;
                statusColor = "red";
                textColor = "white";
                isAvail = false;
                break;
            case "AS / Hld":
                setStatus = "AS / Hld";
                statusColor = "#9300ff";
                textColor = "white";
                isAvail = false;
                break;
            case "Available":
                setStatus = "Available";
                statusColor = "grey lighten-2";
                textColor = "black";
                callNo = "";
                isPrimary = false;
                isAvail = true;
                break;
            case "Deassign":
                setStatus = "Available";
                statusColor = "grey lighten-2";
                textColor = "black";
                callNo = "";
                isAvail = true;
                break;
            case "AS / Qd":
                setStatus = "AS / Qd";
                queueOrder = newQueueOrder;
                statusColor = "grey darken-2";
                textColor = "white";
                ovType = "";
                ovLocation = "";
                isAvail = false;
                break;
            case "Cleared":
                setStatus = "Available";
                statusColor = "grey lighten-2";
                textColor = "black";
                callNo = "";
                isPrimary = false;
                isAvail = true;
                ovType = "";
                ovLocation = "";
                break;
            case "OV":
                setStatus = "OV";
                ovType = ovt;
                ovLocation = ovLoc;
                statusColor = "grey darken-4";
                textColor = "white";
                callNo = "";
                isAvail = remAvail;
                break;
            case "OV / Qd":
                setStatus = "OV / Qd";
                ovType = ovt;
                ovLocation = ovLoc;
                statusColor = "grey darken-4";
                textColor = "blue";
                callNo = "";
                isAvail = false;
                break;
            case "BV":
                setStatus = "Available";
                ovType = "";
                ovLocation = "";
                isAvail = true;
                callNo = "";
                statusColor = "grey lighten-2";
                textColor = "black";
                isPrimary = false;
                break;
            default:
                setStatus = currStatus;
                statusColor = "grey lighten-2";
                textColor = "black";
                callNo = "";
                isPrimary = false;
                isAvail = true;
                break;
        }

        // lets make sure to leave the current primary unit as primary
        // when changing status, and we'll make sure to change it back
        // when the unit is cleared, de-assigned, etc.
        let assnCount = Units.find({ callNo: callNo }).count();
        if (setStatus == "AS") {
            if (assnCount == 0) {
                var isPrimary = true;
            } else {
                var isPremary = false;
            }
        } else if (setStatus == "Available") {
            var isPrimary = false;
        } else {
            let thisUnit = Units.findOne({ _id: unitId });
            if (thisUnit.primaryUnit == true) {
                var isPrimary = true;
            } else {
                var isPrimary = false;
            }
        }

        return Units.update({ _id: unitId }, {
            $set: {
                currentStatus: setStatus,
                queueOrder: newQueueOrder,
                callNo: callNo,
                statusColor: statusColor,
                textColor: textColor,
                primaryUnit: isPrimary,
                oovType: ovt,
                oovLocation: ovLocation,
                oovRemAvail: isAvail,
                statusChangeBy: Meteor.users.findOne(this.userId).username,
                statusChangeOn: new Date(),
            }
        });
    },
    // *****************************************************************************
    //
    // Put a unit in or out of service
    //
    // *****************************************************************************
    'changeServiceStatus.unit' (unitId, serviceStatus) {
        check(unitId, String);
        check(serviceStatus, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to change units service status.');
        }

        return Units.update({ _id: unitId }, {
            $set: {
                statusColor: "grey lighten-2",
                textColor: "black",
                serviceStatus: serviceStatus,
                currentStatus: "Available",
                statusChangeBy: Meteor.users.findOne(this.userId).username,
                statusChangeOn: new Date(),
            }
        });
    },
    // *****************************************************************************
    //
    // Start a transport a unit is currently on
    //
    // *****************************************************************************
    'units.startTransport' (callNo, callSign, unitId) {
        check(unitId, String);
        check(callNo, String);
        check(callSign, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to start a transport on the unit.');
        }

        // check once more that we are about to start a transport on the unit for the call
        // that the unit is currently on and arrived at.

        let unitOnRightCall = Units.findOne({ _id: unitId, currentStatus: "AR", callNo: callNo });
        if (!unitOnRightCall) {
            return ("Unit Not On this Call");
        } else {
            return Units.update({ _id: unitId }, {
                $set: {
                    statusColor: "#ee00ee",
                    textColor: "white",
                    currentStatus: "AR / TR",
                    transportStartBy: Meteor.users.findOne(this.userId).username,
                    transportStartOn: new Date(),
                }
            });
        }
    },
    // *****************************************************************************
    //
    // End the transport a unit is currenlty on.
    //
    // *****************************************************************************
    "units.endTransport" (callSign, mileage) {
        check(callSign, String);
        check(mileage, Number);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to start a transport on the unit.');
        }

        return Units.update({ callSign: callSign }, {
            $set: {
                statusColor: "green",
                textColor: "white",
                currentStatus: "AR",
                transportEndedBy: Meteor.users.findOne(this.userId).username,
                transportEndedOn: new Date(),
            }
        });
    },
    // *****************************************************************************
    //
    // Make a different unit on a call the primary unit
    //
    // *****************************************************************************
    'unit.makePrimary' (unitIdOrig, unitIdNew) {
        check(unitIdOrig, String);
        check(unitIdNew, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to change primary unit.');
        }

        if (unitIdOrig != "None") {
            Units.update({ _id: unitIdOrig }, {
                $set: {
                    primaryUnit: false,
                }
            });
        }

        return Units.update({ _id: unitIdNew }, {
            $set: {
                primaryUnit: true,
            }
        });
    },
    'unit.updateCapabilityAndEquipment' (unitId, callSign, capability, equipment, priDivision, secDivision, type, subtype, entity) {
        check(unitId, String);
        check(callSign, String);
        check(capability, String);
        check(equipment, String);
        check(priDivision, String);
        check(secDivision, String);
        check(type, String);
        check(subType, String);
        check(entity, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to update unit capabilities or equipment.');
        }

        Units.update({ _id: unitId }, {
            $set: {
                callSign: callSign,
                unitEntity: entity,
                type: type,
                subType: subType,
                primaryDivision: priDivision,
                secondaryDivision: secDivision,
                updatedBy: Meteor.users.findOne(this.userId).username,
                updatedOn: new Date(),
            }
        });

        return Units.update({ _id: unitId }, {
            $addToSet: {
                Capabilities: {
                    capability: capability,
                },
                Equipment: {
                    equipment: equipment,
                },
            }
        });
    },
});
