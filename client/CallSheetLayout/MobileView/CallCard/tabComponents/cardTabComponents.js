import { UserSettings } from "../../../../../imports/api/userSettings";

Template.callCardAlertTab.helpers({
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.callCardNotesTab.helpers({
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.callCardResponseTab.helpers({
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});