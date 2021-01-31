import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const EntityTypes = new Mongo.Collection('entityTypes');

EntityTypes.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'entityType.add' (entityTypeName, entityTypeDesc, active) {
        check(entityTypeName, String);
        check(entityTypeDesc, String);
        check(active, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add Entity information.');
        }

        return EntityTypes.insert({
            entityTypeName: entityTypeName,
            entityTypeDesc: entityTypeDesc,
            active: active,
        });
    },
    'entityType.change' (entityTypeId, entityTypeName, entityTypeDesc, active) {
        check(entityTypeId, String);
        check(entityTypeName, String);
        check(entityTypeDesc, String);
        check(active, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add Entity information.');
        }

        return EntityTypes.update({ _id: entityTypeId }, {
            $set: {
                entityTypeName: entityTypeName,
                entityTypeDesc: entityTypeDesc,
                active: active,
            }
        });
    },
    'entityType.delete' (entityTypeId) {
        check(entityTypeId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add Entity information.');
        }

        return EntityTypes.remove({ _id: entityTypeId });
    },
});
