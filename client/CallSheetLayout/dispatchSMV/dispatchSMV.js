import { UserSettings } from '../../../imports/api/userSettings.js';

Template.dispatchSMV.onCreated(function() {
    this.subscribe("activeUserSettings");
    this.subscribe("allUsers");
});

Template.dispatchSMV.onRendered(function() {
    Session.set("mode", "NewCall");
});

Template.dispatchSMV.helpers({
    userPrefs: function() {
        let settings = UserSettings.findOne({});
        if (settings) {
            return settings;
        }
    },
    grids: function() {
        let myId = Meteor.userId();
        let gridSet = UserSettings.findOne({ userId: myId });
        if (typeof gridSet == 'undefined') {
                return "col s12 m6 l6";
        } else if (gridSet.unitsGridParked == true) {
            if (gridSet.unitsGridLayout == "Both Sides") {
                return "col s12 m6 l6";
            } else {
                return "col s12 m6 l8";
            }
        } else {
            return "col s12";
        }
    },
    gridParking: function() {
        let myId = Meteor.userId();
        // console.log('My Id in OMV js is : ' + myId);
        let userSet = UserSettings.findOne({ userId: myId });
        // console.dir(userSet);
        if (typeof userSet == 'undefined') {
            return true;
        } else if (userSet.unitsGridParked == true || userSet.unitsGridParked == null) {
            return true;
        } else {
            return false;
        }
    },
});

Template.dispatchSMV.events({
    
});
