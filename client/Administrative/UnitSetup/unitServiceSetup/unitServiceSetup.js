import { Units } from '../../../../imports/api/units.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';

Template.unitServiceSetup.onCreated(function() {
    this.subscribe('activeUserSettings');
    this.subscribe('activeUnits');
});

Template.unitServiceSetup.onRendered(function() {
    $('.tabs').tabs();
});

Template.unitServiceSetup.helpers({
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.unitServiceSetup.events({

});
