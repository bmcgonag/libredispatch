import { Addresses } from '../../../imports/api/addresses.js';
import { Jurisdiction } from '../../../imports/api/jurisdiction.js';
import { UserSettings } from '../../../imports/api/userSettings.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';

Template.addressSetup.onCreated(function() {
    this.subscribe('entityAddresses');
    this.subscribe('entityJurisdictions');
    this.subscribe('activeUserSettings');
    this.subscribe('errorLogs');
});

Template.addressSetup.onRendered(function() {
    $('ul.tabs').tabs();
    setTimeout(function() {
        // $('select').formSelect();
        $('select').formSelect();
    }, 500);

    $('textarea#directions').characterCounter();
    $('.collapsible').collapsible();
    Session.set('importSelected', false);
});

Template.addressSetup.helpers({
    importSelected: function() {
        return Session.get('importSelected');
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.addressSetup.events({
    'click #importSelected' (event) {
        Session.set('importSelected', true);
    },
    'click #manualSelected' (event) {
        Session.set('importSelected', false);
    }
});
