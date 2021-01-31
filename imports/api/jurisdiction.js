import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const Jurisdiction = new Mongo.Collection('jurisdiction');

Jurisdiction.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'addNew.jurisdiction' (category, type, name) {
        check(category, String);
        check(type, String);
        check(name, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add Jurisdiction information.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return Jurisdiction.insert({
            jurisCategory: category,
            jurisType: type,
            jurisdictionName: name,
            jurisEntity: userEntity,
            jurisParentEntity: parentEntity,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
        });
    },
});
