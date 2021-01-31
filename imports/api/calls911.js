import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';
import { ErrorLogs } from './errorLogs.js';
import { Calls } from './calls.js';

export const Calls911 = new Mongo.Collection('calls911');

Calls911.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'new.911Call' (phoneNo, name, addressString, latitude, longitude, accuracy, elevation, type, call911ParEntity) {
        check(phoneNo, String);
        check(name, String);
        check(addressString, String);
        check(latitude, Number);
        check(longitude, Number);
        check(accuracy, Number);
        check(elevation, Number);
        check(type, String);
        check(call911ParEntity, String);

        // we won't check for user logged in in this case, since this will be coming from an external system.

        return Calls911.insert({
            anialiphoneNo: phoneNo,
            anialicallerName: name,
            anialiaddress: addressString,
            anialilatitude: latitude,
            anialilongitude: longitude,
            anialiaccuracy: accuracy,
            anialielevation: elevation,
            aniallitype: type,
            callNumber: "",
            call911ParentEntity: call911ParEntity,
            cfsActive: true,
            rapidSOS: false,
            status: "new",
            addedOn: new Date(),
        });
    },
    'rebid.911Call' (phoneNo, name, addressString, latitude, longitude, accuracy, elevation, type, call911ParEntity) {
        check(phoneNo, String);
        check(name, String);
        check(addressString, String);
        check(latitude, Number);
        check(longitude, Number);
        check(accuracy, Number);
        check(elevation, Number);
        check(type, String);
        check(call911ParEntity, String);

        return Calls911.update({ anialiphoneNo: phoneNo, cfsActive: true }, {
            $addToSet: {
                rebid: {
                    anialicallerName: name,
                    anialiaddress: addressString,
                    anialilatitude: latitude,
                    anialilongitude: longitude,
                    anialiaccuracy: accuracy,
                    anialielevation: elevation,
                    aniallitype: type,
                    rebidOn: new Date(),
                }
            },
            $set: {
                status: "rebid",
            }
        });
    },
    'rapidSOSInfo.911Call' (phoneNo, rapidSOSName, rapidSOSAdd, rapidSOSlat, rapidSOSlon, rapidSOSacc, rapidSOSelev, rapidSOStype, call911ParEntity) {
        check(phoneNo, String);
        check(rapidSOSName, String);
        check(rapidSOSAdd, String);
        check(rapidSOSlat, Number);
        check(rapidSOSlon, Number);
        check(rapidSOSacc, Number);
        check(rapidSOSelev, Number);
        check(rapidSOStype, String);
        check(call911ParEntity, String);

        return Calls911.update({ anialiphoneNo: phoneNo, cfsActive: true }, {
            $addToSet: {
                rapidSOS: {
                    rapidSOSName: rapidSOSName,
                    rapidSOSAdd: rapidSOSAdd,
                    rapidSOSlat: rapidSOSlat,
                    rapidSOSlon: rapidSOSlon,
                    rapidSOSacc: rapidSOSacc,
                    rapidSOSelev: rapidSOSelev,
                    rapidSOStype: rapidSOStype,
                    rapidSOSat: new Date(),
                }
            },
            $set: {
                rapidSOS: true,
            }
        });
    },
    'cfs.complete911' (call911Id) {
        check(call911Id, String);

        if (!this.userId) {
            throw new Meteor.Error("User is not authorized to complete a 911 call.  Not logged in.");
        }

        return Calls911.update({ _id: call911Id }, {
            $set: {
                cfsActive: false,
                callCompletedBy: Meteor.users.findOne(this.userId).username,
                callCompletedOn: new Date(),
            }
        });
    },
    'acknowledge.911call' (call911id) {
        check(call911id, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to acknowledge a 911 call.');
        }

        return Calls911.update({ _id: call911id }, {
            $set: {
                callAcknowledged: true,
                callAckBy: Meteor.users.findOne(this.userId).username,
                callAckOn: new Date(),
            }
        });
    },
    'mark911Call.asDuplicate' (call911id) {
        check(call911id, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to mark a 911 call as duplicate.');
        }

        return Calls911.update({ _id: call911id }, {
            $set: {
                status: "duplicate",
                cfsActive: false,
                markedAsDuplicateBy: Meteor.users.findOne(this.userId).username,
                markedAsDuplicateAt: new Date(),
                callCompletedBy: Meteor.users.findOne(this.userId).username,
                callCompletedOn: new Date(),
            }
        });
    },
    'cfsFrom911Call.at' (call911Id, callNo) {
        check(call911Id, String);
        check(callNo, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to turn a 911 call into a new CFS.  Not loggged in.');
        }

        return Calls911.update({ _id: call911Id }, {
            $set: {
                callNumber: callNo,
                madeIntoCFSNo: callNo,
                madeCFSat: new Date(),
                madeCFSby: Meteor.users.findOne(this.userId).username,
            }
        });
    },
    'callAddedtoCFS.at' (call911Id, callNo) {
        check(call911Id, String);
        check(callNo, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add a 911 call to a CFS. Not logged in.');
        }

        return Calls911.update({ _id: call911Id }, {
            $set: {
                callNumber: callNo,
                addedToCFSNo: callNo,
                addedToCFSat: new Date(),
                addedToCFSby: Meteor.users.findOne(this.userId).username,
            }
        });
    },
    'call911.delete' (call911Id) {
        check(call911Id, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete a 911 call. Not logged in.');
        }

        return Calls911.update({ _id: call911Id }, {
            $set: {
                status: "deleted",
                cfsActive: false,
                deletedBy: Meteor.users.findOne(this.userId).username,
                deletedOn: new Date(),
            }
        });
    },
});