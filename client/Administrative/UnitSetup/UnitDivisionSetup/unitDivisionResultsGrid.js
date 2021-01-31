import { UnitTypes } from '../../../../imports/api/unitTypes.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';

Template.unitDivisionResultsGrid.onCreated(function() {
    this.subscribe("activeSubTypes");
    this.subscribe("allUsers");
    this.subscribe('activeUserSettings');
});

Template.unitDivisionResultsGrid.onRendered(function() {

});

Template.unitDivisionResultsGrid.helpers({
    units: function() {
        let myEntity = Session.get("myEntity");
        let myParentEntity = Session.get("myParentEntity");

        return UnitTypes.find({});
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.unitDivisionResultsGrid.events({
    'click .deleteDivisions' (event) {
        event.preventDefault();

        // when clicked add the x icon to the chip, adn delete each one clicked.
    },
    'click .editDivisions' (event) {
        event.preventDefault();


    },
    'mouseover .infoRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        let settings = UserSettings.findOne({});
        if (settings) {
            myRow.style.background = settings.themeHighlight;
            myRow.style.color = settings.themeHighlightText;
        }
    },
    'mouseout .infoRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        myRow.style.background = "";
        myRow.style.color = "";
    },
});
