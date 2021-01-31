import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const QuickNotes = new Mongo.Collection('quickNotes');

QuickNotes.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'add.quickNote' (noteAbbrev, noteText, systemNote) {
        check(noteText, String);
        check(noteAbbrev, String);
        check(systemNote, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add quick notes.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return QuickNotes.insert({
            qNoteAbbrev: noteAbbrev,
            qNoteText: noteText,
            systemNote: systemNote,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
            userEntity: userEntity,
            parentEntity: parentEntity,
            active: true,
        });
    },
    'change.quickNote' (qnId, noteAbbrev, noteText, systemNote) {
        check(qnId, String);
        check(noteText, String);
        check(noteAbbrev, String);
        check(systemNote, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add quick notes.');
        }

        return QuickNotes.update({ _id: qnId }, {
            $set: {
                qNoteAbbrev: noteAbbrev,
                qNoteText: noteText,
                systemNote: systemNote,
                lastUpdatedBy: Meteor.users.findOne(this.userId).username,
                lastUpdatedOn: new Date(),
            }
        });
    },
    'delete.quickNote' (quickNoteId) {
        check(quickNoteId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete quick notes.');
        }

        return QuickNotes.update({ _id: quickNoteId }, {
            $set: {
                removedOn: new Date(),
                removedBy: Meteor.users.findOne(this.userId).username,
                active: false,
            }
        });
    },
});
