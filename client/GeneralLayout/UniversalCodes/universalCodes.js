import { UserSettings } from '../../../imports/api/userSettings.js';

Template.universalCodes.onCreated(function() {
    this.subscribe('activeUserSettings');
});

Template.universalCodes.onRendered(function() {
    $('.collapsible').collapsible();
});

Template.universalCodes.helpers({
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

Template.universalCodes.events({
    "click .setupBtn" (event) {
        event.preventDefault();

        var btnClicked = event.currentTarget.id;
        FlowRouter.go('/user/' + btnClicked);
    },
    'mouseover .universalsRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        Session.set("hoverId", event.currentTarget.id);
    },
    'mouseout .universalsRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        Session.set("hoverId", "none");
    },
});
