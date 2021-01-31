import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';
import { ErrorLogs } from './errorLogs.js';

export const AlertSeverity = new Mongo.Collection('alertSeverity');

AlertSeverity.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'addAlertSeverity' (severityName, severityColor, textColor, isSystem) {
        check(severityName, String);
        check(severityColor, String);
        check(textColor, String);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add alert severity levels. Check to ensure you are logged in.');
        }

        userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        entityInfo = Entities.findOne({ entityName: userEntity });
        parentEntity = entityInfo.entityParent;
        username = Meteor.users.findOne(this.userId).username;

        let aSev = AlertSeverity.insert({
            severityName: severityName,
            severityColor: severityColor,
            severityText: textColor,
            isSystem: isSystem,
            severityEntityParent: parentEntity,
            severityUserEntity: userEntity,
            addedBy: username,
            addedOn: new Date(),
        });

        console.dir(aSev);
        return aSev;
    },
    'delete.alertSeverity' (severityId) {
        check(severityId, String);
        
        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete alert severity levels. Check to ensure you are logged in.');
        }

        return AlertSeverity.remove({ _id: severityId });
    },
    'changeAlertSeverity' (severityId, severityName, severityColor, textColor, isSystem) {
        check(severityId, String);
        check(severityName, String);
        check(severityColor, String);
        check(textColor, String);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to update alert severity levels. Check to ensure you are logged in.');
        }

        // check that it exists
        const severity = AlertSeverity.findOne({ _id: severityId });

        if (!severity) {
            throw new Meteor.Error('Severity level does not exist - cannot be updated!')
        }
        
        // run the update
        return AlertSeverity.update({ _id: severityId }, {
            $set: {
                severityName: severityName,
                severityColor: severityColor,
                severityText: textColor,
                isSystem: isSystem,
                editedBy: Meteor.users.findOne(this.userId).username,
                editedOn: new Date(),
            }
        });
    },
});