import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';
import { Units } from './units.js';

export const Cases = new Mongo.Collection('cases');

Cases.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
// ****************************************************************************************
//
// Create a New Case
//
// ****************************************************************************************
    'getNewCaseNumber' (callId, callNo, unitId, unitNo) {
        check(callId, String);
        check(callNo, String);
        check(unitId, String);
        check(unitNo, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to generate a case number.');
        }

        let thisUnit = Units.findOne({ _id: unitId });
        let unitEntity = thisUnit.parentEntity;

    }
});
