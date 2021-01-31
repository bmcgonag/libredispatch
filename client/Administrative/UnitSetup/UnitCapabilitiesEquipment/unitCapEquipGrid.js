import { Units } from '../../../../imports/api/units.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { Entities } from '../../../../imports/api/entities.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';

Template.unitCapEquipGrid.onCreated(function() {
    this.subscribe('activeUnits');
    this.subscribe('errorLogs');
    this.subscribe('activeEntities');
    this.subscribe('activeUserSettings');
});

Template.unitCapEquipGrid.onRendered(function() {
    $('select').formSelect();
});

Template.unitCapEquipGrid.helpers({
    unitsFound: function() {
        return Units.find({});
    },
    userPrefs: function() {
        return UserSettings.findOne({});
    }
});

Template.unitCapEquipGrid.events({
    'change .unitCapEquipActions' (event) {
        let capEquipId = this._id;
        let action = event.target.value;
        $(".unitCapEquipActions").val(""); // <-- this clears our drop down selection for this unit so we can pick another

        Session.set('entityParentInfo', this.parentEntity);

        
        // console.log("Action selected was: " + action);

        if (action == "Edit") {
            Session.set("unitCapEditMode", "Edit");
            Session.set("editUnitCapId", capEquipId);

        } else if (action == "Delete") {

        } else {
            console.log("No action detected.");
        }
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
    }
});