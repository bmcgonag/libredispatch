import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const Transports = new Mongo.Collection('transports');

Transports.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'transport.start' (callSign, unitId, callNo, callId, type, toLocation, description, mileage, parentEntity) {
        check(callSign, String);
        check(unitId, String);
        check(callNo, String);
        check(callId, String);
        check(toLocation, String);
        check(description, String);
        check(type, String);
        check(parentEntity, String);
        check(mileage, Number);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to start transports.');
        }

        return Transports.insert({
            callId: callId,
            unitId: unitId,
            callSign: callSign,
            callNo: callNo,
            trnType: type,
            trnDest: toLocation,
            trnDesc: description,
            parentEntity: parentEntity,
            startMileage: mileage,
            endMileage: "",
            callStillActive: true,
            active: true,
            startedBy: Meteor.users.findOne(this.userId).username,
            startedOn: new Date(),
        });
    },
    'transport.end' (callId, unitId, endMileage) {
        check(callId, String);
        check(unitId, String);
        check(endMileage, Number);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to end transports.');
        }

        return Transports.update({ callId: callId, unitId: unitId }, {
            $set: {
                active: false,
                endMileage: endMileage,
                endedBy: Meteor.users.findOne(this.userId).username,
                endedOn: new Date(),
            }
        });
    },
    'transport.callNotActive' (callId) {
        check(callId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to end transports.');
        }

        return Transports.update({ callId: callId }, {
            $set: {
                callStillActive: false,
            }
        });
    },
});
