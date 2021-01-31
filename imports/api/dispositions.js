import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const Dispos = new Mongo.Collection('dispositions');

Dispos.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'disposition.add' (dispoAbbrev, dispoText, systemDispo) {
        check(dispoAbbrev, String);
        check(dispoText, String);
        check(systemDispo, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add dispositions.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return Dispos.insert({
            dispoAbbrev: dispoAbbrev,
            dispoText: dispoText,
            systemDispo: systemDispo,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
            userEntity: userEntity,
            parentEntity: parentEntity,
            active: true,
        });
    },
    'disposition.change' (dispoId, dispoAbbrev, dispoText, systemDispo) {
        check(dispoId, String);
        check(dispoAbbrev, String);
        check(dispoText, String);
        check(systemDispo, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add dispositions.');
        }

        return Dispos.update({ _id: dispoId }, {
            $set: {
                dispoAbbrev: dispoAbbrev,
                dispoText: dispoText,
                systemDispo: systemDispo,
                lastUpdatedBy: Meteor.users.findOne(this.userId).username,
                lastUpdatedOn: new Date(),
            }
        });
    },
    'disposition.delete' (dispoId) {
        check(dispoId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete dispositions.');
        }

        return Dispos.update({ _id: dispoId }, {
            $set: {
                active: false,
            }
        });
    },
});
