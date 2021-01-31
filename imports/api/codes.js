import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const Codes = new Mongo.Collection('codes');

Codes.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'newCode.insert' (codeType, codeSubType, codeAbbrev, codeName) {
        check(codeType, String);
        check(codeSubType, String);
        check(codeAbbrev, String);
        check(codeName, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add new Codes.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return Codes.insert({
            codeType: codeType,
            codeSubType: codeSubType,
            codeAbbrev: codeAbbrev,
            codeName: codeName,
            usersEntity: userEntity,
            parentEntity: parentEntity,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
        });
    },
});
