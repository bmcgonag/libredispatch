import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const UnitGeoPos = new Mongo.Collection("unitGeoPos");

UnitGeoPos.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'add.unitGeoPosition' (unitId, callSign, unitLat, unitLon, unitSpeed, unitHeading) {
        check(unitId, String);
        check(callSign, String);
        check(unitLat, Number);
        check(unitLon, Number);
        check(unitSpeed, Number);
        check(unitHeading, Number);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add new unit geo-coordinate info.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        let exists = UnitGeoPos.findOne({ unitId: unitId, current: true });
        if (exists) {
            UnitGeoPos.update({ unitId: unitId, current: true }, { 
                $set: {
                    current: false,
                }
            });
        }

        UnitGeoPos.insert({
            unitId: unitId,
            callSign: callSign,
            unitLat: unitLat,
            unitLon: unitLon,
            unitSpeed: unitSpeed,
            unitHeading: unitHeading,
            current: true,
            unitGeoEntity: userEntity,
            parentGeoEntity: parentEntity,
            addedFor: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
        });
    },
});