import { EntityTypes } from '../../../../imports/api/entityTypes.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

Template.entityTypeGrid.onCreated(function() {
    this.subscribe('activeEntityTypes')
    this.subscribe('activeUserSettings');
    this.subscribe("errorLogs");
});

Template.entityTypeGrid.onRendered(function() {
    $('select').formSelect();
    $('.modal').modal();
});

Template.entityTypeGrid.helpers({
    eTypeslist: function() {
        return EntityTypes.find({});
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.entityTypeGrid.events({
    'click .deleteEntity' (event) {
        let typeId = this._id;
       
        Session.set("confirmationDialogTitle", "Confirmation - Deleting an Entity!");
        Session.set("confirmationDialogContent", "You are about to delete the selected Entity.  Doing this in a production environment can have potentially catastrophic results.  This action cannot be undone.  Are you sure you want to delete this entity?");
        Session.set("eventConfirmCallBackFunction", "confirmDeleteEntity");
        Session.set("eventConfirmNecessaryId", typeId);

        $("#confirmationDialog").modal('open');
    },
    'click .editEntity' (event) {
        let typeId = this._id;
        Session.set("editEntityTypeMode", "edit");
        Session.set("editTypeId", typeId);
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

confirmDeleteEntity = function(typeId) {
    Meteor.call('entityType.delete', typeId, function(err, result) {
        if (err) {
            console.log("Error deleting the entity type: " + err);
            showSnackbar("Error Deleting Entity Type!", "red");
            Meteor.call("Log.Errors", "entitySetupGrid.js", "confirmDeleteEntity function", err, function(error, reuslts) {
                if (error) {
                    console.log("Error logging issue to the errorLogs collection: " + error);
                }
            });
        } else {
            showSnackbar("Entity Type Deleted!", "green");
        }
    });
}
