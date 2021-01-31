import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const CallPriorities = new Mongo.Collection('callPriorities');

CallPriorities.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'priorities.insert' (callPriority, priorityColor, systemPriority) {
        check(callPriority, String);
        check(priorityColor, String);
        check(systemPriority, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to create a call priority.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return CallPriorities.insert({
            callTypePriority: callPriority,
            priorityColor: priorityColor,
            systemPriority: systemPriority,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
            usersEntity: userEntity,
            parentEntity: parentEntity,
        });
    },
    'callPriority.delete' (priorityId) {
        check(priorityId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete a call priority.');
        }

        return CallPriorities.remove({ _id: priorityId });
    },
    'callPriority.edit' (priorityId, priorityName, priorityColor, systemPriority) {
        check(priorityId, String);
        check(priorityName, String);
        check(priorityColor, String);
        check(systemPriority, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to edit a call priority.');
        }

        CallPriorities.update({ _id: priorityId }, {
            $set: {
                callTypePriority: priorityName,
                priorityColor: priorityColor,
                systemPriority: systemPriority,
                editedBy: Meteor.users.findOne(this.userId).username,
                editedOn: new Date(),
            }
        });
    },
});
