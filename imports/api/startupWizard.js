import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const StartupWizard = new Mongo.Collection('startupWizard');

StartupWizard.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'startup.start' () {

        if (!this.userId) {
            throw new Meteor.Error('Unauthorized. Please login with appropriate permission level.');
        }

        StartupWizard.insert({
            pageNo: 1,
            wizardComplete: false,
        });
    },
    'startup.next' () {

        if (!this.userId) {
            throw new Meteor.Error('Unauthorized. Please login with appropriate permission level.');
        }

        let pageInfo = StartupWizard.findOne({});
        let page = pageInfo.pageNo;
        let newPage = page + 1;

        StartupWizard.update({}, {
            $set: {
                pageNo: newPage,
            }
        });
    },
    'startup.back' () {

        if (!this.userId) {
            throw new Meteor.Error('Unauthorized. Please login with appropriate permission level.');
        }

        let pageInfo = StartupWizard.findOne({});
        let page = pageInfo.pageNo;
        let newPage = page - 1;

        StartupWizard.update({}, {
            $set: {
                pageNo: newPage,
            }
        });
    },
    'complete.wizard' () {
        if (!this.userId) {
            throw new Meteor.Error("Unauthorized. Please login with appropriate permission level.");
        }

        StartupWizard.update({}, {
            $set: {
                wizardComplete: true,
            }
        });
    },
});