import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const TransportTypes = new Mongo.Collection('transportTypes');

TransportTypes.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'transportTypes.insert' (abbrev, longDesc, isSystem) {
        check(abbrev, String);
        check(longDesc, String);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add transport types.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return TransportTypes.insert({
            transAbbrev: abbrev,
            transDesc: longDesc,
            isSystem: isSystem,
            userEntity: userEntity,
            parentEntity: parentEntity,
            active: true,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
        });
    },
    'transportTypes.edit' (transId, abbrev, desc, isSystem) {
        check(transId, String);
        check(abbrev, String);
        check(desc, String);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to update transport types.');
        }

        return TransportTypes.update({ _id: transId }, {
            $set: {
                transAbbrev: abbrev,
                transDesc: desc,
                isSystem: isSystem,
                active: true,
                updatedLastBy: Meteor.users.findOne(this.userId).username,
                updatedLastOn: new Date(),
            }
        });
    },
    'transportType.delete' (transId) {
        check(transId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to remove transport types.');
        }

        console.log("The transId is: " + transId);

        return TransportTypes.update({ _id: transId }, {
            $set: {
                active: false,
                removedBy: Meteor.users.findOne(this.userId).username,
                removedOn: new Date(),
            }
        });
    },
});
