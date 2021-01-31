import { Jurisdiction } from '../../../imports/api/jurisdiction.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.jurisdictionSetup.onCreated(function() {
    this.subscribe('entityJurisdictions');
    this.subscribe('errorLogs');
    this.subscribe('activeUserSettings');
});

Template.jurisdictionSetup.onRendered(function() {
    $('select').formSelect();
});

Template.jurisdictionSetup.helpers({
    jurisList: function() {
        return Jurisdiction.find({});
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.jurisdictionSetup.events({
    'click .addJuris' (event) {
        event.preventDefault();

        let category = $("#jurisCategory").val();
        let type = $("#jurisType").val();
        let name = $("#jurisdictionName").val();

        Meteor.call("addNew.jurisdiction", category, type, name, function(err, result) {
            if (err) {
                console.log("Error adding jurisdiction: " + err);
                showSnackbar("Error Adding Information", "red");
                Meteor.call("Log.Errors", "jurisdictionSetup.js", "click .addJuris", err);
            } else {
                showSnackbar("Information Added Successfully!", "green");
            }
        });
    },
    'click .cancelAddJuris' (event) {
        event.preventDefault();

    },
    'click .editJuris' (event) {
        event.preventDefault();

    },
    'click .deleteJuris' (event) {
        event.preventDefault();

    },
    'mouseover .jurisRow' (event) {
        myRow = document.getElementById(event.currentTarget.id);
        settings = UserSettings.findOne({});
        if (settings) {
            myRow.style.background = settings.themeHighlight;
            myRow.style.color = settings.themeHighlightText;
        }
    },
    'mouseout .jurisRow' (event) {
        myRow = document.getElementById(event.currentTarget.id);
        myRow.style.background = "";
        myRow.style.color = "";
    },
});
