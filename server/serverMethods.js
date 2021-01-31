import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import shelljs from 'shelljs';
import { Addresses } from '../imports/api/addresses.js';
import { CallTypes } from '../imports/api/callTypes.js';
import { CallPriorities } from '../imports/api/callPriorities.js';
import { Dispos } from '../imports/api/dispositions.js';
import { OOVTypes } from '../imports/api/outOfVehicleTypes.js';
import { CapAndEquip } from '../imports/api/capAndEquip.js';
import { TransportTypes } from '../imports/api/transportTypes.js';
import { AlertTypes } from '../imports/api/alertTypes.js';
import { AlertSeverity } from '../imports/api/alertSeverity.js';
import { QuickNotes } from '../imports/api/quickNotes.js';
import { UnitTypes } from '../imports/api/unitTypes.js';
import { TenantSetup } from '../imports/api/tenantSetup.js';

Meteor.methods({
    'out.systemCollections' (outputPath, exportClicked) {
        check(outputPath, String);
        check(exportClicked, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not logged in, and not authorized to export system collections.');
        }

        console.log("supposed to export: " + exportClicked);

        switch(exportClicked) {
            case "exportCommands":
                // output the command line commands
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection commands --out ' + outputPath + '/commands.json');
                break;
            case "exportContextItems":
                // output the context menu options
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection contextItems --out ' + outputPath + '/contextItems.json');
                break;
            case "exportEntities":
                // export Entities
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection entities --out ' + outputPath + '/entities.json');
                break;
            case "exportStateCodes":
                // export state codes
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection stateCodes --out ' + outputPath + '/stateCodes.json');
                break;
            case "exportVehMakesAndModels":
                // export vehicle Makes and Models
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection vehMakesModels --out ' + outputPath + '/vehMakesModels.json');
                break;
            case "exportVehStyles":
                // export vehicle styles
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection vehStyles --out ' + outputPath + '/vehStyles.json');
                break;
            case "exportVehColors":
                // export vehicle colors
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection vehColors --out ' + outputPath + '/vehColors.json');
                break;
            case "exportTransportTypes":
                // export Transport Types
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection transportTypes --out ' + outputPath + '/transportTypes.json');
                break;
            case "exportAllSystemCollections":
                // output the command line commands
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection commands --out ' + outputPath + '/commands.json');

                // output the context menu options
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection contextItems --out ' + outputPath + '/contextItems.json');

                // export Entities
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection entities --out ' + outputPath + '/entities.json');

                // export state codes
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection stateCodes --out ' + outputPath + '/stateCodes.json');

                // export vehicle Makes and Models
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection vehMakesModels --out ' + outputPath + '/vehMakesModels.json');

                // export vehicle styles
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection vehStyles --out ' + outputPath + '/vehStyles.json');

                // export vehicle colors
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection vehColors --out ' + outputPath + '/vehColors.json');

                // export vehicle colors
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection transportTypes --out ' + outputPath + '/transportTypes.json');
                break;
        }
        return;
    },
    'out.clientCollections' (outputPath, exportClicked) {
        check(outputPath, String);
        check(exportClicked, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not logged in, and not authorized to export client collections.');
        }

        switch(exportClicked) {
            case "exportCallTypes":
                // export call types
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection callTypes --out ' + outputPath + '/callTypes.json');
                break;
            case "exportCallPriorities":
                // export call priorities
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection callPriorities --out ' + outputPath + '/callPriorities.json');
                break;
            case "exportDispositions":
                // export call dispositions
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection dispositions --out ' + outputPath + '/dispositions.json');
                break;
            case "exportQuickNotes":
                // export quick notes
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection quickNotes --out ' + outputPath + '/quickNotes.json');
                break;
            case "exportTransports":
                // export transports
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection transports --out ' + outputPath + '/transports.json');
                break;
            case "exportCADSetup":
                // export cadSetup information
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection cadSetup --out ' + outputPath + '/cadSetup.json');
                break;
            case "exportCalls":
                // export call information
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection calls --out ' + outputPath + '/calls.json');
                break;
            case "exportUnits":
                // export unit information
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection units --out ' + outputPath + '/units.json');
                break;
            case "exportUnitServiceTracking":
                // export unit service status information
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection unitServiceTracking --out ' + outputPath + '/unitServiceTracking.json');
                break;
            case "exportUserSettings":
                // export user settings
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection userSettings --out ' + outputPath + '/userSettings.json');
                break;
            case "exportAddresses":
                // export entity addresses
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection addresses --out ' + outputPath + '/addresses.json');
                break;
            case "exportUnitTypes":
                // expor the unit types for all units
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection unitTypes --out ' + outputPath + '/unitTypes.json');
                break;
            case "exportAllClientCollections":
                // export call types
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection callTypes --out ' + outputPath + '/callTypes.json');

                // export call priorities
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection callPriorities --out ' + outputPath + '/callPriorities.json');

                // export call dispositions
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection dispositions --out ' + outputPath + '/dispositions.json');

                // export quick notes
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection quickNotes --out ' + outputPath + '/quickNotes.json');

                // export transports
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection transports --out ' + outputPath + '/transports.json');

                // export cadSetup information
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection cadSetup --out ' + outputPath + '/cadSetup.json');

                // export call information
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection calls --out ' + outputPath + '/calls.json');

                // export unit information
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection units --out ' + outputPath + '/units.json');

                // export unit service status information
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection unitServiceTracking --out ' + outputPath + '/unitServiceTracking.json');

                // export user settings
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection userSettings --out ' + outputPath + '/userSettings.json');

                // export unit types
                shelljs.exec('mongoexport -h 127.0.0.1:3001 --db meteor --collection unitTypes --out ' + outputPath + '/unitTypes.json');
        }
        return;
    },
    'in.collections' (fromInputFile, pathToFile, serverName, port, collectionName) {
        check(fromInputFile, String);
        check(pathToFile, String);
        check(serverName, String);
        check(port, String);
        check(collectionName, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not logged in, and not authorized to import collections.');
        }

        shelljs.exec('mongoimport --host ' + serverName +  ' --port ' + port + ' --collection ' + collectionName + ' --db meteor --file ' + pathToFile + "/" + fromInputFile);
    },
    "AddEntityToUser" (entityName) {
        check(entityName, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not logged in, and not authorized to add entities for users..');
        }
        let userId = this.userId;

        let verified = false;

        if (entityName == "GlobalEntity") {
            verified = true;
        } else {
            verified = false;
        }

        return Meteor.users.update({ _id: userId }, {
            $set: {
                profile: {
                    usersEntity: entityName,
                    entityVerified: verified,
                }
            }
        });
    },
    "VerifyUserForEntity" (verifyId) {
        check(verifyId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not logged in, and not authorized to verify entities for users.');
        }

        return Meteor.users.update({ _id: verifyId }, {
            $set: {
                "profile.entityVerified": true,
            }
        });
    },
    "DenyUserToEntity" (denyId) {
        check(denyId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not logged in, and not authorized to deny entities for users..');
        }

        return Meteor.users.update({ _id: denyId }, {
            $set: {
                "profile.entityVerified": false,
                "profile.usersEntity": ""
            }
        });
    },
    'superAdmin.updateUserInfo' (userId, userFullName, userRole, userEntity) {
        check(userId, String);
        check(userFullName, String);
        check(userRole, String);
        check(userEntity, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not logged in, and not authorized to update user information.');
        }

        return Meteor.users.update({ _id: userId }, {
            $set: {
                "profile.userFullName": userFullName,
                "profile.usersEntity": userEntity,
                "roles": [
                    userRole,
                ],
            }
        });
    },
    'superAdmin.createNewUser'(fullName, emailAdd, role, entity){
        check(fullName, String);
        check(emailAdd,String);
        check(role, String);
        check(entity, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not logged in, and not authorized to add new user information.');
        }

        return Accounts.createUser({
          email: emailAdd,
          password: "U$er_Pa$$vvoRd!",
          profile: {
                entityVerified: false,
                usersEntity: entity,
                usersFullName: fullName,
          },
          roles: [
              role
          ]
        });
    },
    'changeUserPswd' (userId, newPswd) {
        check(userId, String);
        check(newPswd, String);

        return Accounts.setPassword(userId, newPswd);
    },
    'findMatchAddresses' (partialAddString) {
        check(partialAddString, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not logged in, and not authorized to update user information.');
        }

        let addressList = Addresses.find({ addressString: {$regex: partialAddString + '.*' }}, { sort: { _id: 1 }, limit: 20 }).fetch();
        return addressList;
    },
    "remove.userFromSystem" (userSelId) {
        return Meteor.users.remove(userSelId);
    },
    "copy.callTypes" (i) {
        // let's get the list of Call Types that are 'system' types.
        let callTypeInfo = CallTypes.find({ systemType: true }).fetch();

        // let's find out how many there are.
        let callTypeCount = callTypeInfo.length;

        // let's make sure we got results, and if so, start a loop to add each type for the non global agency.
        if (typeof callTypeInfo != 'undefined' && callTypeInfo != null && callTypeInfo != "") {
            if (i < callTypeCount) {
                makeACopyCallType(i, callTypeInfo);
            }
        } else {
            return;
        }
    },
    "copy.callPriorities" (i) {
        // let's get the list of Call priorities that are 'system' priorities
        let callPriorityInfo = CallPriorities.find({ systemPriority: true }).fetch();

        // let's found out how many there are
        let callPriCount = callPriorityInfo.length;

        // let's make sure we got results, and then move on.
        if (typeof callPriorityInfo != 'undefined' && callPriorityInfo != null && callPriorityInfo != "") {
            if (i < callPriCount) {
                makeCopyPriorities(i, callPriorityInfo);
            }
        } else {
            return;
        }
    },
    "copy.callDispos" (i) {
        // let's get the list of Call priorities that are 'system' priorities
        let callDispoInfo = Dispos.find({ systemDispo: true }).fetch();

        // let's found out how many there are
        let callDispoCount= callDispoInfo.length;

        // let's make sure we got results, and then move on.
        if (typeof callDispoInfo != 'undefined' && callDispoInfo != null && callDispoInfo != "") {
            if (i < callDispoCount) {
                makeCopyDispos(i, callDispoInfo);
            }
        } else {
            return;
        }
    },
    "copy.transportTypes" (i) {
        // let's get the list of Call priorities that are 'system' priorities
        let transTypeInfo = TransportTypes.find({ isSystem: true }).fetch();

        // let's found out how many there are
        let transTypeCount = transTypeInfo.length;

        // let's make sure we got results, and then move on.
        if (typeof transTypeInfo != 'undefined' && transTypeInfo != null && transTypeInfo != "") {
            if (i < transTypeCount) {
                makeCopyTrans(i, transTypeInfo);
            }
        } else {
            return;
        }
    },
    "copy.oovTypes" (i) {
        // let's get the list of Call priorities that are 'system' priorities
        let OOVTypeInfo = OOVTypes.find({ isSystem: true }).fetch();

        // let's found out how many there are
        let OOVTypeCount = OOVTypeInfo.length;

        // let's make sure we got results, and then move on.
        if (typeof OOVTypeInfo != 'undefined' && OOVTypeInfo != null && OOVTypeInfo != "") {
            if (i < OOVTypeCount) {
                makeCopyOOV(i, OOVTypeInfo);
            }
        } else {
            return;
        }
    },
    "copy.capAndEquip" (i) {
        // let's get the list of Call priorities that are 'system' priorities
        let capInfo = CapAndEquip.find({ isSystem: true }).fetch();

        // let's found out how many there are
        let capCount = capInfo.length;

        // let's make sure we got results, and then move on.
        if (typeof capInfo != 'undefined' && capInfo != null && capInfo != "") {
            if (i < capCount) {
                makeCopyCap(i, capInfo);
            }
        } else {
            return;
        }
    },
    "copy.unitTypes" (i) {
        // let's get the list of Call priorities that are 'system' priorities
        let unitInfo = UnitTypes.find({ isSystem: true }).fetch();

        // let's found out how many there are
        let unitCount = unitInfo.length;

        // let's make sure we got results, and then move on.
        if (typeof unitInfo != 'undefined' && unitInfo != null && unitInfo != "") {
            if (i < unitCount) {
                makeCopyUnits(i, unitInfo);
            }
        } else {
            return;
        }
    },
    "copy.quickNotes" (i) {
        // let's get the list of Call priorities that are 'system' priorities
        let qnInfo = QuickNotes.find({ systemNote: true }).fetch();

        // let's found out how many there are
        let qnCount = qnInfo.length;

        // let's make sure we got results, and then move on.
        if (typeof qnInfo != 'undefined' && qnInfo != null && qnInfo != "") {
            if (i < qnCount) {
                makeCopyQuickNotes(i, qnInfo);
            }
        } else {
            return;
        }
    },
    "copy.tenantSettings" (i) {
        // let's get the list of Call priorities that are 'system' priorities
        let tenantInfo = TenantSetup.find({ isSystem: true }).fetch();

        // let's found out how many there are
        let tenantCount = tenantInfo.length;

        // let's make sure we got results, and then move on.
        if (typeof tenantInfo != 'undefined' && tenantInfo != null && tenantInfo != "") {
            if (i < tenantCount) {
                makeCopyTenantSettings(i, tenantInfo);
            }
        } else {
            return;
        }
    },
    "copy.alertTypes" (i) {
        // let's get the list of Call priorities that are 'system' priorities
        let alertInfo = AlertTypes.find({ isSystem: true }).fetch();

        // let's found out how many there are
        let alertCount = alertInfo.length;

        // let's make sure we got results, and then move on.
        if (typeof alertInfo != 'undefined' && alertInfo != null && alertInfo != "") {
            if (i < alertCount) {
                makeCopyAlertTypes(i, alertInfo);
            }
        } else {
            return;
        }
    },
    "copy.alertSeverity" (i) {
        // let's get the list of Call priorities that are 'system' priorities
        let sevInfo = AlertSeverity.find({ isSystem: true }).fetch();

        // let's found out how many there are
        let sevCount = sevInfo.length;

        // let's make sure we got results, and then move on.
        if (typeof sevInfo != 'undefined' && sevInfo != null && sevInfo != "") {
            if (i < sevCount) {
                makeCopyAlertSeverity(i, sevInfo);
            }
        } else {
            return;
        }
    },
});

var makeACopyCallType = function(i, callTypeInfo) {
    let entityAssoc =[];
    let unitAssoc = [];
    let subTypeAssoc = [];
    let groupAssoc = [];
    Meteor.call('callTypes.insert', callTypeInfo[i].callTypeName, callTypeInfo[i].callTypeDescription, callTypeInfo[i].callTypePriority, callTypeInfo[i].priorityColor, false, entityAssoc, unitAssoc, subTypeAssoc, groupAssoc, false, function(err, result) {
        if (err) {
            console.log("Error copying call type " + callTypeInfo[i].callTypeName + " to the database: " + err);
        } else {
            i = i + 1;
            Meteor.call("copy.callTypes", i);
        }
    });
}

var makeCopyPriorities = function(i, callPriorityInfo) {
    let systemPriority = false;
    Meteor.call('priorities.insert', callPriorityInfo[i].callTypePriority, callPriorityInfo[i].priorityColor, systemPriority, function(err, result) {
        if (err) {
            console.log("Error copying call priority " + callPriorityInfo[i].callTypePriority + "  to the database: " + err);
        } else {
            i = i + 1;
            Meteor.call("copy.callPriorities", i);
        }
    });
}

var makeCopyQuickNotes = function(i, qnInfo) {
    let systemNote = false;
    Meteor.call("add.quickNote", qnInfo[i].qNoteAbbrev, qnInfo[i].qNoteText, systemNote, function(err, result) {
        if (err) {
            console.log("Error copying Quick Note " + qnInfo[i].qNoteAbbrev + " to the database: " + err);
        } else {
            i = i + 1;
            Meteor.call("copy.quickNotes", i);
        }
    });
}

var makeCopyDispos = function(i, callDispoInfo) {
    let systemDispo = false;
    Meteor.call('disposition.add', callDispoInfo[i].dispoAbbrev, callDispoInfo[i].dispoText, systemDispo, function(err, result) {
        if (err) {
            console.log("Error copying Disposition " + callDispoInfo.dispoAbbrev + " to the database: " + err);
        } else {
            i = i + 1;
            Meteor.call("copy.callDispos", i);
        }
    });
}

var makeCopyTrans = function(i, transTypeInfo) {
    let isSystem = false;
    Meteor.call('transportTypes.insert', transTypeInfo[i].transAbbrev, transTypeInfo[i].transDesc, isSystem, function(err, result) {
        if (err) {
            console.log("Error copying Transport Type " + transTypeInfo[i].transAbbrev + " to the database: " + err);
        } else {
            i = i + 1;
            Meteor.call("copy.transportTypes", i);
        }
    });
}

var makeCopyOOV = function(i, OOVTypeInfo) {
    let isSystem = false;
    Meteor.call('oovType.insert', OOVTypeInfo[i].oovTypeName, OOVTypeInfo[i].oovDescription, OOVTypeInfo[i].unitStillAvail, OOVTypeInfo[i].appliesToUnitTypes, OOVTypeInfo[i].requiresLocation, isSystem, function(err, result) {
        if (err) {
            console.log("Error copying the OOV Type " + OOVTypeInfo[i].oovTypeName + " to the database: " + err);
        } else {
            i = i + 1;
            Meteor.call("copy.oovTypes", i);
        }
    });
}

var makeCopyCap = function(i, capInfo) {
    let isSystem = false;
    Meteor.call('capEquip.insert', capInfo[i].type, capInfo[i].description, capInfo[i].abbrev, capInfo[i].unitOrPerson, isSystem, function(err, result) {
        if (err) {
            console.log("Error copying the Capability " + capInfo[i].type + " to the database: " + err);
        } else {
            i = i + 1;
            Meteor.call("copy.capAndEquip", i);
        }
    });
}

var makeCopyUnits = function(i, unitInfo) {
    let isSystem = false;
    Meteor.call('unitSubType.copy', unitInfo[i].unitType, unitInfo[i].unitSubType, unitInfo[i].unitSubTypeColorCode, unitInfo[i].unitDivisions, isSystem, function(err, result) {
        if (err) {
            console.log("Error copying Unit Type " + unitInfo[i].unitType + " with SubType " + unitInfo[i].unitSubType + " to the database: " + err);
        } else {
            i = i + 1;
            Meteor.call("copy.unitTypes", i);
        }
    });
}

var makeCopyAlertSeverity = function(i, sevInfo) {
    let isSystem = false;
    let mode = "production";
    Meteor.call('addAlertSeverity', sevInfo[i].severityName, sevInfo[i].severityColor, sevInfo[i].severityText, isSystem, mode, function(err, result) {
        if (err) {
            console.log("Error copying Alert Severity " + sevInfo[i].severityName + " to the database: " + err);
        } else {
            i = i + 1;
            Meteor.call("copy.alertSeverity", i);
        }
    });
}

var makeCopyAlertTypes = function(i, alertInfo) {
    let isSystem = false;
    let mode = "production";
    Meteor.call('add.alertType', alertInfo[i].alertTypeName, alertInfo[i].alertTypeAssoc, alertInfo[i].alertTypeSeverity, alertInfo[i].alertNotifyType, alertInfo[i].alertNotifySound, isSystem, function(err, result) {
        if (err) {
            console.log("Error copying Alert Type " + alertInfo[i].alertTypeName + " to the database: " + err);
        } else {
            i = i + 1;
            Meteor.call("copy.alertTypes", i);
        }
    });
}

var makeCopyTenantSettings = function(i, tenantInfo) {
    let isSystem = false;
    Meteor.call('set.tenantSettings', tenantInfo[i].navBarColor, tenantInfo[i].ISMileReq, tenantInfo[i].transMileReq, tenantInfo[i].alwaysRunNo, tenantInfo[i].assignSelf, tenantInfo[i].deAssignSelf, isSystem, function(err, result) {
        if (err) {
            console.log("Error copying Tenant Setting " + tenantInfo[i].navColor + " to the database: " + err);
        } else {
            i = i + 1;
            Meteor.call("copy.tenantSettings", i);
        }
    });
}