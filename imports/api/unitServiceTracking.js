import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';
import { Units } from './units.js';

export const UnitServiceTracking = new Mongo.Collection("unitServiceTracking");

UnitServiceTracking.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    // *****************************************************************************
    //
    // This is intended to track each time a unit goes in and / or out of service
    //
    // *****************************************************************************
    'unitService.add' (unitId, userId, callSign, startMileage, serviceStatus, isPri) {
        check(unitId, String);
        check(userId, String);
        check(callSign, String);
        check(serviceStatus, String);
        check(isPri, Boolean);
        check(startMileage, Number);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add unit service information.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        // grab the user's username and user id
        let myUser = Meteor.users.findOne(userId).username;

        // put the user int he unit.
        return UnitServiceTracking.insert({
            unitId: unitId,
            callSign: callSign,
            unitServiceStatus: serviceStatus,
            userId: userId,
            username: myUser,
            isPrimaryUser: isPri,
            userCurrStatus: serviceStatus,
            myStartMileage: startMileage,
            myEndMileage: null,
            current: true,
            ustEntity: userEntity,
            ustParentEntity: parentEntity,
            statusBy: Meteor.users.findOne(this.userId).username,
            statusOn: new Date(),
        });
    },
    'unitService.outOfService' (usId, endingMileage) {
        check(usId, String);
        check(endingMileage, Number);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to update unit service information.');
        }

        let current = false;
        let serviceStatus = "OutOfService";
       
        // only change this user and unit.
        return UnitServiceTracking.update({ _id: usId }, {
            $set: {
                unitServiceStatus: serviceStatus,
                userCurrStatus: serviceStatus,
                myEndMileage: endingMileage,
                current: current,
                lastUpdatedBy: Meteor.users.findOne(this.userId).username,
                lastUpdatedOn: new Date(),
            }
        });
    },
    "setAllUnitST.OutOfService" (unitId) {
        check(unitId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to update unit service information.');
        }

        return UnitServiceTracking.update({ unitId: unitId }, {
            $set: {
                unitServiceStatus: "OutOfService",
                current: false,
                lastUpdatedBy: Meteor.users.findOne(this.userId).username,
                lastUpdatedOn: new Date(),
            }
        });
    },
    'unitService.changeUnit' (usId) {
        // This is for someone who's not the primary in the unit they are leaving.
        check(usId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to change unit service information.');
        }

        // next we need to add them to the new unit.
        return UnitServiceTracking.update({ _id: usId }, {
            $set: {
                userCurrStatus: "OutOfService",
                current: false,
                statusBy: Meteor.users.findOne(this.userId).username,
                statusOn: new Date(),
            }
        });
    },
});
