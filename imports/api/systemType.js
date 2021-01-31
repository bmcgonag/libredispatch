import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const SystemType = new Mongo.Collection('systemType');

SystemType.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    "setSystemType" (systemType) {
        check(systemType, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to set the system type.');
        }

        let currSys = SystemType.findOne({});

        // if current system type is set, then update it, don't add a new one.
        if (currSys) {
            return SystemType.update({ _id: currSys._id }, {
                $set: {
                    systemType: systemType,
                    updatedBy: Meteor.users.findOne(this.userId).username,
                    updatedOn: new Date(),
                }
            });
        } else {
            // otherwise add it as new since it doesn't appear to exist.
            return SystemType.insert({
                systemType: systemType,
                setBy: Meteor.users.findOne(this.userId).username,
                setOn: new Date(),
            });
        }
    },
});