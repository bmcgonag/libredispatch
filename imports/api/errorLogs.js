import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const ErrorLogs = new Mongo.Collection('errorLogs');

ErrorLogs.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'Log.Errors' (file, generalLocation, err) {

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add Entity information.');
        }

        return ErrorLogs.insert({
            errorFile: file,
            scriptLocation: generalLocation,
            errorText: err,
            errorDate: new Date(),
            userDuringError: Meteor.users.findOne(this.userId).username,
        });
    },
});
