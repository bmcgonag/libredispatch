import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const AlertTypes = new Mongo.Collection('alertTypes');

AlertTypes.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'add.alertType' (typeName, typeAssoc, typeSeverity, notifyType, notifySound, isSystem) {
        check(typeName, String);
        check(typeAssoc, String);
        check(typeSeverity, String);
        check(notifyType, String);
        check(notifySound, String);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to create alert types. Please make sure you are logged in.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return AlertTypes.insert({
            alertTypeName: typeName,
            alertTypeAssoc: typeAssoc,
            alertTypeSeverity: typeSeverity,
            alertNotifyType: notifyType,
            alertNotifySound: notifySound,
            isSystem: isSystem,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
            alertTypeEntityParent: parentEntity,
            alertTypeUserEntity: userEntity,
        });
    },
    'update.alertType' (alertTypeId, typeName, typeAssoc, typeSeverity, notifyType, notifySound, isSystem) {
        check(alertTypeId, String);
        check(typeName, String);
        check(typeAssoc, String);
        check(typeSeverity, String);
        check(notifyType, String);
        check(notifySound, String);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to update alert types. Please make sure you are logged in.');
        }

        return AlertTypes.update({ _id: alertTypeId }, {
            $set: {
                alertTypeName: typeName,
                alertTypeAssoc: typeAssoc,
                alertTypeSeverity: typeSeverity,
                alertNotifyType: notifyType,
                alertNotifySound: notifySound,
                isSystem: isSystem,
                editedBy: Meteor.users.findOne(this.userId).username,
                editedOn: new Date(),
            }
        });
    },
    'delete.alertType' (alertTypeId) {
        check(alertTypeId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete alert types. Please make sure you are logged in.');
        }

        return AlertTypes.remove({ _id: alertTypeId });
    },
});