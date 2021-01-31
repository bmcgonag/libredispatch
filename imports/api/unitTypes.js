import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const UnitTypes = new Mongo.Collection("unitTypes");

UnitTypes.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'unitSubType.insert' (unitType, unitSubType, subTypeColorCode, isSystem) {
        check(unitType, String);
        check(unitSubType, String);
        check(subTypeColorCode, String);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add new unit sub types.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return UnitTypes.insert({
            unitType: unitType,
            unitSubType: unitSubType,
            unitSubTypeColorCode: subTypeColorCode,
            unitDivisions: [],
            isSystem: isSystem,
            unitEntity: userEntity,
            parentEntity: parentEntity,
            addedOn: new Date(),
            addedBy: Meteor.users.findOne(this.userId).username,
            active: true,
        });
    },
    'unitDivisions.insert' (unitType, unitSubType, divisionInfo, entity) {
        check(unitType, String);
        check(unitSubType, String);
        check(entity, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add new sub-type divisions.');
        }

        // here we use the entity to ensure we match based on the correct settings for the subType
        // to help avoid conflicts with same sub-type names.

        let divisionCount = divisionInfo.length;

        for (j=0; j<divisionCount; j++) {
            UnitTypes.update({ unitType: unitType, unitSubType: unitSubType, unitEntity: entity }, {
                $addToSet: {
                    unitDivisions: {
                        division: divisionInfo[j].tag,
                        addedBy: Meteor.users.findOne(this.userId).username,
                        addedOn: new Date(),
                        active: true,
                    },
                }
            });
        }

        return;
    },
    'subType.delete' (subTypeId) {
        check(subTypeId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete sub-types.');
        }

        return UnitTypes.remove({ _id: subTypeId });
    },
    'unitSubType.edit' (subTypeId, subType, subTypeColor, isSystem) {
        check(subTypeId, String);
        check(subType, String);
        check(subTypeColor, String);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to edit sub-types.');
        }

        return UnitTypes.update({ _id: subTypeId }, {
            $set: {
                unitSubType: subType,
                unitSubTypeColorCode: subTypeColor,
                isSystem: isSystem,
                lastEditedOn: new Date(),
                lastEditedBy: Meteor.users.findOne(this.userId).username,
            }
        });
    },
    'unitSubType.copy' (unitType, unitSubType, subTypeColorCode, unitDivisions, isSystem) {
        check(unitType, String);
        check(unitSubType, String);
        check(subTypeColorCode, String);
        check(unitDivisions, Array);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add new unit sub types.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return UnitTypes.insert({
            unitType: unitType,
            unitSubType: unitSubType,
            unitSubTypeColorCode: subTypeColorCode,
            unitDivisions: unitDivisions,
            isSystem: isSystem,
            unitEntity: userEntity,
            parentEntity: parentEntity,
            addedOn: new Date(),
            addedBy: Meteor.users.findOne(this.userId).username,
            active: true,
        });
    },
});
