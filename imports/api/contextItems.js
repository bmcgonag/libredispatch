import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const ContextItems = new Mongo.Collection('contextItems');

ContextItems.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'contextItems.add' (option, itemType) {
        check(itemType, String);
        check(option, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add new context items.');
        }

        return ContextItems.insert({
            itemType: itemType,
            contextOption: option,
        });
    },
    'delete.contextItem' (itemId) {
        check(itemId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete context items.');
        }

        return ContextItems.remove({ _id: itemId });
    },
});
