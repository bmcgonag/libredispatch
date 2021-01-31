import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const PersonTitles = new Mongo.Collection('personTitles');

PersonTitles.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'personTS.add' (type, abbrev, full, isSystem) {
        check(type, String);
        check(abbrev, String);
        check(full, String);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add person title options. Make sure you are logged in.');
        }

        PersonTitles.insert({
            type: type,
            abbrev: abbrev,
            full: full,
            isSystem: isSystem,
            active: true,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
        });
    },
    'personTS.change' (tsId, type, abbrev, full, isSystem) {
        check(tsId, String);
        check(type, String);
        check(abbrev, String);
        check(full, String);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to change person title options. Make sure you are logged in.');
        }

        PersonTitles.update({ _id: tsId }, { 
            $set: {
                type: type,
                abbrev: abbrev,
                full: full,
                isSystem: isSystem,
                updatedBy: Meteor.users.findOne(this.userId).username,
                updatedOn: new Date(),
            }
        });
    },
    'personTS.delete' (tsId) {
        check(tsId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to change person title options. Make sure you are logged in.');
        }

        PersonTitles.update({ _id: tsId }, {
            $set: {
                active: false,
                removedBy: Meteor.users.findOne(this.userId).username,
                removedOn: new Date(),
            }
        });
    },
});