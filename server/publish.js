import { Calls } from '../imports/api/calls.js';
import { CADSetup } from '../imports/api/calls.js';
import { CallTypes } from '../imports/api/callTypes.js';
import { CallPriorities } from '../imports/api/callPriorities.js';
import { VehMakesModels } from '../imports/api/vehMakesModels.js';
import { VehStyles } from '../imports/api/vehStyles.js';
import { VehColors } from '../imports/api/vehColors.js';
import { StateCodes } from '../imports/api/stateCodes.js';
import { Entities } from '../imports/api/entities.js';
import { UnitTypes } from '../imports/api/unitTypes.js';
import { UnitTypesList} from '../imports/api/unitTypesList.js';
import { Units } from '../imports/api/units.js';
import { OOVTypes } from '../imports/api/outOfVehicleTypes.js';
import { Commands } from '../imports/api/commands.js';
import { QuickNotes } from '../imports/api/quickNotes.js';
import { ContextItems } from '../imports/api/contextItems.js';
import { Dispos } from '../imports/api/dispositions.js';
import { UserSettings } from '../imports/api/userSettings.js';
import { TransportTypes } from '../imports/api/transportTypes.js';
import { Transports } from '../imports/api/transports.js';
import { Messages } from '../imports/api/messages.js';
import { Addresses } from '../imports/api/addresses.js';
import { Jurisdiction } from '../imports/api/jurisdiction.js';
import { WreckerRotation } from '../imports/api/wreckerRotation.js';
import { TenantSetup } from '../imports/api/tenantSetup.js';
import { MainUnitType } from '../imports/api/mainUnitTypes.js';
import { StartupWizard } from '../imports/api/startupWizard.js';
import { EntityTypes } from '../imports/api/entityTypes.js';
import { AlertSeverity } from '../imports/api/alertSeverity.js';
import { AlertTypes } from '../imports/api/alertTypes.js';
import { ErrorLogs } from '../imports/api/errorLogs.js';
import { DND } from '../imports/api/dndTracking.js';
import { CapAndEquip } from '../imports/api/capAndEquip.js';
import { UnitServiceTracking } from '../imports/api/unitServiceTracking.js';
import { UserGroups } from '../imports/api/userGroups.js';
import { Calls911 } from '../imports/api/calls911.js';
import { Persons } from '../imports/api/persons.js';
import { PersonTitles } from '../imports/api/personTitles.js';
import { CallClickTracking } from '../imports/api/callClickTracking.js';
import { UnitGeoPos } from '../imports/api/unitGeoPosition.js';
import { SystemType } from '../imports/api/systemType.js';

Meteor.publish('activePersons', function() {
    try {
        return Persons.find({ current: true });
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('systemTypeInfo', function() {
    try {
        return SystemType.find({});
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activePersonTitles', function() {
    try {
        return PersonTitles.find({ active: true });
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('unitGeoPosInfo', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return UnitGeoPos.find({ current: true });
        } else {
            return UnitGeoPos.find({ parentGeoEntity: myParentEntity, current: true });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeCalls', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return Calls.find({ active: true });
        } else {
            return Calls.find({ active: true, callParentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('clickedCalls', function() {
    try {
        let myId = this.userId;
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;

        return CallClickTracking.find({ clickBy: myId });
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('active911Calls', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return Calls911.find({ cfsActive: true });
        } else {
            return Calls911.find({ cfsActive: true, call911ParentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('entityAddresses', function(addString) {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (addString == "" || addString == null) {
            return;
        } else {
            if (isGlobal == true) {
                // console.log("Add String is: " + addString);
                return Addresses.find({ addressString: {$regex: addString + '.*', $options: 'i' }}, { sort: { _id: 1 }, limit: 20 });
            } else {
                // console.log("Add String normal is: " + addString);
                // return Addresses.find({ addressString: {$regex: addString + '.*' }}, { sort: { _id: 1 }, limit: 20 });
                return Addresses.find({ addressParentEntity: myParentEntity, addressString: {$regex: addString + '.*' }}, { sort: { _id: 1 }, limit: 20 });
            }
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('entityLandmarks', function(landmarkString) {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (landmarkString == "" || landmarkString == null) {
            return;
        } else {
            if (isGlobal == true) {
                return Addresses.find({ landMark: { $regex: landmarkString + '.*', $options: 'i' }}, { sort: { _id: 1 }, limit: 20 });
            } else {
                return Addresses.find({ addressParentEntity: myParentEntity, landMark: { $regex: landmarkString + '.*' }}, { sort: { _id: 1}, limit: 20 });
            }
        }
    } catch (err) {
        // console.log("--------------------------****---------------------------------");
        // console.log(err);
    }
});

Meteor.publish('entityAddressesFull', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal = true) {
            let globalEntityName = Entities.findOne({ globalEntity: true }).entityName;
            return Addresses.find({});
        } else {
            // console.log("Add String normal is: " + addString);
            return Addresses.find({ addressParentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('entityTenantSetup', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        // console.log("myParentEntity Tenant: " + myParentEntity);
        if (isGlobal == true) {
            let globalEntityName = Entities.findOne({ globalEntity: true }).entityName;
            return TenantSetup.find({ userEntity: globalEntityName });
        } else {
            // console.log("tenant parent entity is: " + myParentEntity);
            return TenantSetup.find({ parentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('entityJurisdictions', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return Jurisdiction.find({});
        } else {
            return Jurisdiction.find({ jurisParentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('entityAlertSeverity', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return AlertSeverity.find({});
        } else {
            return AlertSeverity.find({ severityEntityParent: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('entityAlertTypes', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return AlertTypes.find({});
        } else {
            return AlertTypes.find({ alertTypeEntityParent: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeCallTypes', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return CallTypes.find({ active: true, deleted: false });
        } else {
            return CallTypes.find({ active: true, deleted: false, parentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeEntities', function() {
    try {
        return Entities.find({ active: true });
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('globalUnitTypes', function() {
    try {
        return MainUnitType.find({});
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeEntityTypes', function() {
    try {
        return EntityTypes.find({ active: true });
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('callPriorities', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return CallPriorities.find({});
        } else {
            return CallPriorities.find({ parentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeVehMakesModels', function() {
    return VehMakesModels.find({ active: true, "make_info.active": true });
});

Meteor.publish('activeVehStyles', function() {
    return VehStyles.find({ active: true });
});

Meteor.publish('activeVehColors', function() {
    return VehColors.find({ active: true });
});

Meteor.publish('states', function() {
    return StateCodes.find({});
});

Meteor.publish("allUsers", function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: myEntity });
        let myParentEntity = entityInfo.entityParent;
        let parentEntityInfo = Entities.find({ entityParent: myParentEntity }).fetch();
        let entityArray = [];
        if (typeof parentEntityInfo != 'undefined' && parentEntityInfo != null && parentEntityInfo != "") {
            let entityCount = parentEntityInfo.length;
            for (i = 0; i < entityCount; i++) {
                entityArray.push(parentEntityInfo[i].entityName);
            }
        }
        if (Roles.userIsInRole(this.userId, 'GlobalAdmin')) {
            return Meteor.users.find({});
        } else if (Roles.userIsInRole(this.userId, ['LocalAdmin','DispatchAdmin','DispatchUser'])) {
            return Meteor.users.find({ "profile.usersEntity": { $in: entityArray }});
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish("startup", function() {
    if (Roles.userIsInRole(this.userId, 'GlobalAdmin')) {
        return StartupWizard.find({});
    }
});

Meteor.publish("messageUsers", function() {
        return Meteor.users.find({}, {
            fields: {
                username: 1,
                "profile.usersEntity": 1,
                "status.online": 1,
            }
        });
});

Meteor.publish("myMessages", function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: myEntity });
        let myParentEntity = entityInfo.entityParent;
        let entityId = entityInfo._id;
        let parentEntityInfo = Entities.findOne({ entityName: entityInfo.entityParent });
        let parentEntityId = parentEntityInfo._id;
        return Messages.find({});
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish("localUsers", function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (Roles.userIsInRole(this.userId, 'LocalAdmin')) {
            return Meteor.users.find({ userEntity: myEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeUserGroups', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return UserGroups.find({ active: true });
        } else {
            return UserGroups.find({ active: true, groupParentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeSubTypes', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        if (myEntity) {
            let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
            let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
            if (isGlobal == true) {
                return UnitTypes.find({ active: true });
            } else {
                return UnitTypes.find({ active: true, parentEntity: myParentEntity });
            }
        } 
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('unitTypeNames', function() {
    try {
        return UnitTypesList.find({});
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeUnits', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        if (myEntity) {
            let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
            let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
            if (isGlobal == true) {
                return Units.find({ active: true });
            } else {
                return Units.find({ active: true, parentEntity: myParentEntity });
            }
        } 
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('currentUnitTracking', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return UnitServiceTracking.find({});
        } else {
            return UnitServiceTracking.find({ ustParentEntity: myParentEntity, current: true });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('oovTypes', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return OOVTypes.find({ active: true });
        } else if (myEntity == myParentEntity) {
            return OOVTypes.find({ active: true, parentEntity: myParentEntity });
        } else {
            return OOVTypes.find({ active: true, unitEntity: myEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeCommands', function() {
    try {
        return Commands.find({});
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeQuickNotes', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return QuickNotes.find({ active: true });
        } else {
            return QuickNotes.find({ active: true, parentEntity: myParentEntity});
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeWreckerRotation', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return WreckerRotation.find({});
        } else {
            console.log("Wrecker Rotation Entity Searched: " + myParentEntity);
            return WreckerRotation.find({ rotationParentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeContextItems', function() {
    try {
        return ContextItems.find({});
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeDispostions', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return Dispos.find({ active: true });
        } else {
            return Dispos.find({ active: true, parentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeUserSettings', function() {
    return UserSettings.find({ active: true, userId: this.userId });
});

Meteor.publish('activeTransTypes', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return TransportTypes.find({ active: true });
        } else {
            return TransportTypes.find({ active: true, parentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeTransports', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return Transports.find({ active: true });
        } else {
            return Transports.find({ active: true, parentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeCFSTransports', function(activeCallNumber) {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return Transports.find({ callStillActive: true });
        } else {
            return Transports.find({ parentEntity: myParentEntity, callStillActive: true });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeCapAndEquip', function() {
    try {
        let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let isGlobal = Entities.findOne({ entityName: myEntity }).globalEntity;
        let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;
        if (isGlobal == true) {
            return CapAndEquip.find({ active: true });
        } else {
            return CapAndEquip.find({ active: true, capParentEntity: myParentEntity });
        }
    } catch (err) {
        // console.log("--- !!! ----------------------------------------------- !!! ---");
        // console.log(err);
    }
});

Meteor.publish('activeDND', function() {
    try {
        let myId = this.userId;
        return DND.find({ dndBy: myId, complete: false }, { sort: { dndStartOn: -1 }, limit: 1 });
    } catch (err) {
        console.log("--- !!! ----------------------------------------------- !!! ---");
        console.log(err);
    }
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true }, { fields: { username: 1, "profile.usersEntity": 1 } });
});

Meteor.publish("errorLogs", function() {
    return ErrorLogs.find({}, { limit: 1 });
});
