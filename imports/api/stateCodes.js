import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const StateCodes = new Mongo.Collection('stateCodes');

StateCodes.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'importGeneral.import' (importData, fileType) {
        check(fileType, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add Vehicle information.');
        }

        let importLength = importData.data.length;

        if (fileType == "states") {
            for (i = 0; i < importLength; i++) {
                StateCodes.insert({
                    stateName: importData.data[i].STATE_NAME,
                    stateAbbrev: importData.data[i].STATE_ABBREV,
                    addedOn: new Date(),
                    importedBy: Meteor.users.findOne(this.userId).username,
                });
            }
        }
    },
});
