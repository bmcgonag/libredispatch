import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const CallTypes = new Mongo.Collection('callTypes');

CallTypes.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    "callTypes.insert" (callTypeName, callTypeDescription, callTypePriority, priorityColor, allowViewAssocOverride, entityCallTypeAssoc, unitTypeCallTypeAssoc, subtypeCallTypeAssoc, userGroupCallAssoc, systemType) {
        check(callTypeDescription, String);
        check(callTypeName, String);
        check(callTypePriority, String);
        check(priorityColor, String);
        check(allowViewAssocOverride, Boolean);
        check(entityCallTypeAssoc, [String]);
        check(unitTypeCallTypeAssoc, [String]);
        check(subtypeCallTypeAssoc, [String]);
        check(userGroupCallAssoc, [String]);
        check(systemType, Boolean);


        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add Call Types, please ensure you are logged in, and have appropriate permissions.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return CallTypes.insert({
            callTypeName: callTypeName,
            callTypeDescription: callTypeDescription,
            callTypePriority: callTypePriority,
            priorityColor: priorityColor,
            active: true,
            allowViewAssocOverride: allowViewAssocOverride,
            entityCallTypeAssoc: entityCallTypeAssoc,
            unitTypeCallTypeAssoc: unitTypeCallTypeAssoc,
            subtypeCallTypeAssoc: subtypeCallTypeAssoc,
            userGroupCallAssoc: userGroupCallAssoc,
            systemType: systemType,
            usersEntity: userEntity,
            parentEntity: parentEntity,
            deleted: false,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
        });
    },
    "callTypes.edit" (callTypeId, callTypeName, callTypeDescription, callTypePriority, priorityColor, active, allowViewAssocOverride, entityCallTypeAssoc, unitTypeCallTypeAssoc, subtypeCallTypeAssoc, userGroupCallAssoc, systemType) {
        check(callTypeId, String);
        check(callTypeDescription, String);
        check(callTypeName, String);
        check(callTypePriority, String);
        check(priorityColor, String);
        check(active, Boolean);
        check(allowViewAssocOverride, Boolean);
        check(entityCallTypeAssoc, [String]);
        check(unitTypeCallTypeAssoc, [String]);
        check(subtypeCallTypeAssoc, [String]);
        check(userGroupCallAssoc, [String]);
        check(systemType, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to edit Call Types, please ensure you are logged in, and have appropriate permissions.');
        }

        return CallTypes.update({ _id: callTypeId }, {
            $set: {
                callTypeName: callTypeName,
                callTypeDescription: callTypeDescription,
                callTypePriority: callTypePriority,
                priorityColor: priorityColor,
                active: active,
                allowViewAssocOverride: allowViewAssocOverride,
                entityCallTypeAssoc: entityCallTypeAssoc,
                unitTypeCallTypeAssoc: unitTypeCallTypeAssoc,
                subtypeCallTypeAssoc: subtypeCallTypeAssoc,
                userGroupCallAssoc: userGroupCallAssoc,
                systemType: systemType,
                editedBy: Meteor.users.findOne(this.userId).username,
                editedOn: new Date(),
            }
        });
    },
    "callTypes.delete" (callTypeId) {
        check(callTypeId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete Call Types, please ensure you are logged in, and have appropriate permissions.');
        }

        return CallTypes.update({ _id: callTypeId }, {
            $set: {
                active: false,
                deleted: true,
                deletedBy: Meteor.users.findOne(this.userId).username,
                deletedOn: new Date(),
            }
        });
    }
});
