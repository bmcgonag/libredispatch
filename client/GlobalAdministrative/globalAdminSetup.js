import { UserSettings } from '../../imports/api/userSettings.js';

Template.globalAdminSetup.onCreated(function() {
    this.subscribe('activeUserSettings');
});

Template.globalAdminSetup.onRendered(function() {
    $('.collapsible').collapsible();
});

Template.globalAdminSetup.helpers({
    userPrefs: function() {
        let settings = UserSettings.findOne({});
        if (settings) {
            return settings;
        }
    },
    thisId: function() {
        return Session.get("hoverId");
    },
});

Template.globalAdminSetup.events({
    "click .setupBtn" (event) {
        event.preventDefault();

        var btnClicked = event.currentTarget.id;
        FlowRouter.go('/admin/' + btnClicked);
    },
    'mouseover .globalSetupRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        Session.set("hoverId", event.currentTarget.id);
    },
    'mouseout .globalSetupRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        Session.set("hoverId", "none");
    },
});
