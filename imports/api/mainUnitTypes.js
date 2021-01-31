import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const MainUnitType = new Mongo.Collection('mainUnitType');

MainUnitType.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'mainUnitType.add' (unitTypeName) {
        check(unitTypeName, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add Unit Types.');
        }

        MainUnitType.insert({
            unitType: unitTypeName,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
        });
    },
    'mainUnitType.update' (unitTypeId, unitTypeName) {
        check(unitTypeId, String);
        check(unitTypeName, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to update Unit Types.');
        }

        MainUnitType.update({ _id: unitTypeId }, {
            $set: {
                unitType: unitTypeName,
            }
        });
    },
    'mainUnitType.delete' (unitTypeId) {
        check(unitTypeId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete Unit Types.');
        }

        MainUnitType.remove({ _id: unitTypeId });
    }
});