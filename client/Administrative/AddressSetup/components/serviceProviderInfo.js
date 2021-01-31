import { UserSettings } from '../../../../imports/api/userSettings.js';

Template.serviceProviderInfo.onCreated(function() {
    this.subscribe('activeUserSettings');
});

Template.serviceProviderInfo.helpers({
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});