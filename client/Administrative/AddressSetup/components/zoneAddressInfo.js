import { UserSettings } from '../../../../imports/api/userSettings.js';

Template.zoneAddressInfo.onCreated(function() {
    this.subscribe('activeUserSettings');
});

Template.zoneAddressInfo.helpers({
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});