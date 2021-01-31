import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const CapAndEquip = new Mongo.Collection('capAndEquip');

CapAndEquip.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'capEquip.insert' (type, description, abbrev, unitOrPerson, isSystem) {
        check(type, String);
        check(description, String);
        check(abbrev, String);
        check(unitOrPerson, String);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add capabilities and equipment, please ensure you are logged in, and have appropriate permissions.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return CapAndEquip.insert({
            type: type,
            description: description,
            abbrev: abbrev,
            unitOrPerson: unitOrPerson,
            capEntity: userEntity,
            capParentEntity: parentEntity,
            isSystem: isSystem,
            active: true,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
        });
    },
    'capEquip.update' (capEquipId, type, description, abbrev, unitOrPerson, isSystem) {
        check(capEquipId, String);
        check(type, String);
        check(description, String);
        check(abbrev, String);
        check(unitOrPerson, String);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to update capabilities and equipment, please ensure you are logged in, and have appropriate permissions.');
        }

        return CapAndEquip.update({ _id: capEquipId }, {
            $set: {
                type: type,
                description: description,
                abbrev: abbrev,
                unitOrPerson: unitOrPerson,
                isSystem: isSystem,
                updatedBy: Meteor.users.findOne(this.userId).username,
                updatedOn: new Date(),
            }
        });
    },
    'capEquip.delete' (capEquipId) {
        check(capEquipId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to remove capabilities and equipment, please ensure you are logged in, and have appropriate permissions.');
        }

        return CapAndEquip.remove({ _id: capEquipId });
    },
});