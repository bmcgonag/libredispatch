import { Entities } from '../../../imports/api/entities.js';
import { UserSettings } from '../../../imports/api/userSettings.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';

Template.entityGrid.onCreated(function() {
    this.subscribe("activeEntities")
    this.subscribe('activeUserSettings');
    this.subscribe('errorLogs');
});

Template.entityGrid.onRendered(function() {
    $('.modal').modal();
});

Template.entityGrid.helpers({
    editEntity: function() {
        return Session.get("editEntityId");
    },
    entitiesInfo: function() {
        return Entities.find({});
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.entityGrid.events({
    'change .entityActions' (event) {
        event.preventDefault();

        let entityId = this._id;
        let action = event.target.value;
        // console.log("Action was: " + action +  " on " + entityId);

        if (action == 'edit') {
            console.log("Edit Selected for " + entityId);
            
        } else if (action == 'delete') {
            console.log("Delete Selected for " + entityId);
            let entity = Entities.findOne({ _id: entityId });
            
        } else {
            console.log("Error understanding the selected Action.");
            showSnackbar("Error Completing Selected Action!", "red");
        }
    },
    'click .deleteEntityActual' (event) {
        let entityId = this._id;
        Session.set("confirmationDialogTitle", "Confirmation - About to Delete an Entiy!");
        Session.set("confirmationDialogContent", "You are about to delete an Entity (Tenant) from this system.  Doing this can have serious, negative effects on the system and performance, and cannot be undone.  Are you sure you want to delete this Entity (Tenant)?");
        Session.set("eventConfirmCallBackFunction", "deleteEntityConfirmed");
        Session.set("eventConfirmNecessaryId", entityId);
        
        $("#confirmationDialog").modal('open');
    },
    'click .editEntityActual' (event) {
        let entityId = this._id;
        Session.set("editEntityId", entityId);
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

deleteEntityConfirmed = function(entityId) {
    Meteor.call('delete.entity', entityId, function(err, result) {
        if (err) {
            console.log("Error deleting entity: " + err);
            showSnackbar("Error Deleting Entity!", "red");
            Meteor.call("Log.Errors", "entityGrid.js", "deleteEntityConfirmed function", err, function(error, results) {
                if (error) {
                    console.log("Error logging the issue with deleting an entity: " + error);
                }
            });
        } else {
            showSnackbar("Entity Deleted!", "green");
        }
    });
} 