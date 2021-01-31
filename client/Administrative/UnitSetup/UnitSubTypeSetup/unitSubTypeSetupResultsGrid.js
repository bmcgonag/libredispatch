import { UnitTypes } from '../../../../imports/api/unitTypes.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

Template.unitSubTypeResultsGrid.onCreated(function() {
    this.subscribe("activeSubTypes");
    this.subscribe('activeUserSettings');
    this.subscribe('errorLogs');
});

Template.unitSubTypeResultsGrid.onRendered(function() {

});

Template.unitSubTypeResultsGrid.helpers({
    unitSubTypes: function() {
        let myEntity = Session.get("myEntity");
        let myParentEntity = Session.get("myParentEntity");
        
        return UnitTypes.find({});

    },
    editId: function() {
        return Session.get("editId");
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.unitSubTypeResultsGrid.events({
    'click .deleteSubType' (event) {
        event.preventDefault();

        let subTypeID = this._id;

        Meteor.call("subType.delete", subTypeID, function(err, result) {
            if (err) {
                showSnackbar("Error while deleting sub-type!", "red");
                // console.log("Error Deleting: " + err);
            } else {
                showSnackbar("Sub-type Deleted!", "green");
            }
        });
    },
    'click .editSubType' (event) {
        event.preventDefault();
        Session.set("editId", this._id);
        // console.log(this._id);
    },
    'click .cancelChangeSubType' (event) {
        event.preventDefault();
        Session.set("editId", "");
    },
    'click .changeSubType' (event) {
        event.preventDefault();

        let editId = Session.get("editId");
        let subType = $("#unitSubTypeEditable").val();
        let subTypeColor = $("#unitSubTypeColorEditable").val();

        if (subType == '' || subType == null) {
            $("#unitSubTypeEditable").addClass("red lighten-2");
            $("#unitSubTypeEditable").focus();
            showSnackbar("SubType is required!", "red");
        } else {
            Meteor.call("unitSubType.edit", editId, subType, subTypeColor, function(err, result) {
                if (err) {
                    showSnackbar("Error While Updating Sub-type", "red");
                    // console.log("Error Happened: " + err);
                } else {
                    Session.set("editId", "");
                    showSnackbar("Sub-type Updated Successfully!", "green");
                }
            });
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
    },
});
