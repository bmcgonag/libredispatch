import { UserSettings } from '../../imports/api/userSettings.js';

Template.adminSetup.onCreated(function() {
    this.subscribe('activeUserSettings');
});

Template.adminSetup.onRendered(function() {
    $('.collapsible').collapsible();
});

Template.adminSetup.helpers({
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
    thisId: function() {
        return Session.get("hoverId");
    }
});

Template.adminSetup.events({
    "click .setupBtn" (event) {
        event.preventDefault();

        var btnClicked = event.currentTarget.id;
        FlowRouter.go('/admin/' + btnClicked);
    },
    'mouseover .adminSetupRow' (event) {
        Session.set("hoverId", event.currentTarget.id);
    },
    'mouseout .adminSetupRow' (event) {
        Session.set("hoverId", "none");
    },
});
