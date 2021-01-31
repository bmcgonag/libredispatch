import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const UserGroups = new Mongo.Collection("userGroups");

UserGroups.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'add.userGroup' (groupName, usersInGroup) {
        check(groupName, String);
        check(usersInGroup, [String]);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add new user groups.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return UserGroups.insert({
            groupName: groupName,
            usersInGroup: usersInGroup,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
            groupEntity: userEntity,
            groupParentEntity: parentEntity,
            active: true,
        });
    },
    'update.userGroup' (groupId, groupName, usersInGroup) {
        check(groupId, String);
        check(groupName, String);
        check(usersInGroup, [String]);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to update user groups.');
        }

        return UserGroups.update({ _id: groupId }, {
            $set: {
                groupName: groupName,
                usersInGroup: usersInGroup,
                lastUpdatedBy: Meteor.users.findOne(this.userId).username,
                lastUpdatedOn: new Date(),
            }
        });
    },
    'delete.userGroup' (groupId) {
        check(groupId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete user groups.');
        }

        return UserGroups.update({ _id: groupId }, {
            $set: {
                active: false,
            }
        });
    },
});