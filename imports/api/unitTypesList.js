import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const UnitTypesList = new Mongo.Collection("unitTypesList");

UnitTypesList.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    "unitTypeList.insert" (unitTypeName) {
        check(unitTypeName, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add new unit types.');
        }

        return UnitTypesList.insert({ unitTypeName: unitTypeName });
    },
    "unitTypesList.update" (typeId, unitTypeName) {
        check(typeId, String);
        check(unitTypeName, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to update unit types.');
        }

        return UnitTypesList.update({ _id: typeId }, {
            $set: {
                unitTypeName: unitTypeName,
            }
        });
    },
    "unitTypeslist.delete" (typeId) {
        check(typeId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to remove unit types.');
        }

        return UnitTypesList.remove({ _id: typeId });
    },
});
