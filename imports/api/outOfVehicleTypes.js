import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const OOVTypes = new Mongo.Collection('oovTypes');

OOVTypes.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'oovType.insert' (oovTypeName, oovDescription, unitStillAvail, appliesToUnitTypes, requiresLocation, isSystem) {
        check(oovTypeName, String);
        check(oovDescription, String);
        check(unitStillAvail, Boolean);
        check(appliesToUnitTypes, [String]);
        check(requiresLocation, Boolean);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to set OOV Types. Ensure you are logged in.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return OOVTypes.insert({
            oovTypeName: oovTypeName,
            oovDescription: oovDescription,
            unitStillAvail: unitStillAvail,
            appliesToUnitTypes: appliesToUnitTypes,
            requiresLocation: requiresLocation,
            isSystem: isSystem,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
            userEntity: userEntity,
            parentEntity: parentEntity,
            active: true,
        });
    },
    'oovType.update' (oovTypeID, oovTypeName, oovDescription, unitStillAvail, appliesToUnitTypes, requiresLocation, isSystem) {
        check(oovTypeID, String);
        check(oovTypeName, String);
        check(oovDescription, String);
        check(unitStillAvail, Boolean);
        check(appliesToUnitTypes, [String]);
        check(requiresLocation, Boolean);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to update OOV Types. Ensure you are logged in.');
        }

        return OOVTypes.update({ _id: oovTypeID }, {
            $set: {
                oovTypeName: oovTypeName,
                oovDescription: oovDescription,
                unitStillAvail: unitStillAvail,
                appliesToUnitTypes: appliesToUnitTypes,
                requiresLocation: requiresLocation,
                isSystem: isSystem,
                updatedBy: Meteor.users.findOne(this.userId).username,
                updatedOn: new Date(),
                active: true,
            }
        });
    },
    'oovType.delete' (oovTypeID) {
        check(oovTypeID, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to remove OOV Types. Ensure you are logged in.');
        }

        return OOVTypes.update({ _id: oovTypeID }, {
            $set: {
                active: false,
                removedBy: Meteor.users.findOne(this.userId).username,
                removedOn: new Date(),
            }
        });
    },
});
