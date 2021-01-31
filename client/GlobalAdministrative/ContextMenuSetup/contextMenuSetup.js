import { ContextItems } from '../../../imports/api/contextItems.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.contextMenuSetup.onCreated(function() {
    this.subscribe("activeContextItems");
    this.subscribe("activeUserSettings");
});

Template.contextMenuSetup.onRendered(function() {
    $('select').formSelect();
    $('.modal').modal();
});

Template.contextMenuSetup.helpers({
    getItems: function() {
        return ContextItems.find({});
    },
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.contextMenuSetup.events({
    'click .saveContextItem' (event) {
        event.preventDefault();

        let type = $("#contextOptionType").val();
        let name = $("#contextOptionName").val();

        if (type == null || type == "" || name == null || name == "") {
            showSnackbar("Option and Name are Required!", "red");
        } else {
            Meteor.call("contextItems.add", name, type, function(err, result){
                if (err) {
                    showSnackbar("Error Adding Context Item!", "red");
                    console.log("Error adding Context Item: " + err);
                } else {
                    showSnackbar("Context Item Added Successfully!", "green");
                    $("#contextOptionName").val("");
                    $("#contextOptionType").val("");
                }
            });
        }
    },
    'click .cancelAddContextItem' (event) {
        event.preventDefault();

        $("#contextOptionName").val("");
        $("#contextOptionType").val("");
    },
    'click .removeContextItem' (event) {
        event.preventDefault();
        let itemId = this._id;

        Session.set("confirmationDialogTitle", "Confirmation - Delete Context Item");
        Session.set("confirmationDialogContent", "You are about to delete a context (right-click) option from the system.  Doing this will remove the ability to perform this function in the system using a right-click. Are you sure you want to delete this context item?");
        Session.set("eventConfirmCallBackFunction", "deleteContextItem");
        Session.set("eventConfirmNecessaryId", itemId);

        $("#confirmationDialog").modal('open');
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

deleteContextItem = function(contextItemId) {
    Meteor.call("delete.contextItem", contextItemId, function(err, result){
        if (err) {
            showSnackbar("Error Deleting Context Menu Item!", "red");
            console.log("Error Deleting Context Item: " + err);
        } else {
            showSnackbar("Context Item Deleted Successfully!", "green");
        }
    });
}