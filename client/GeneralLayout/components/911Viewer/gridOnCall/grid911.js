import { Calls911 } from '../../../../../imports/api/calls911.js';
import { Calls } from '../../../../../imports/api/calls.js';
import { ErrorLogs } from '../../../../../imports/api/errorLogs.js';
import { Entities } from '../../../../../imports/api/entities.js';
import { UserSettings } from '../../../../../imports/api/userSettings.js';

Template.grid911.onCreated(function() {
    this.subscribe('activeCalls');
    this.subscribe('errorLogs');
    this.subscribe('activeEntities');
    this.subscribe('active911Calls');
    this.subscribe('activeUserSettings');
});

Template.grid911.onRendered(function() {

});

Template.grid911.helpers({
    emerCalls: function() {
        let callNo = this.callNo;
        // console.log("Call No for 911: " + callNo);
        return Calls911.find({ callNumber: callNo });
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.grid911.events({

});