import { PersonTitles } from '../../../../imports/api/personTitles.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { Meteor } from 'meteor/meteor';

Template.titleSetupGrid.onCreated(function() {
    this.subscribe('activePersonTitles');
});

Template.titleSetupGrid.onRendered(function() {
    $('.modal').modal();
});

Template.titleSetupGrid.helpers({
    titles: function() {
        return PersonTitles.find({});
    },
});

Template.titleSetupGrid.events({
    'click .deleteTitle' (event) {
        event.preventDefault();

        let titleId = this._id;

        Session.set("confirmationDialogTitle", "Confirm - Delete Person Title");
        Session.set("confirmationDialogContent", "You are about to delete a person title from the system. This action will remove the option from use in all future person additions, but will not alter person files that use this code now.  Are you shure you want to delete this person title?");
        Session.set("eventConfirmCallBackFunction", "deletePersonTitle");
        Session.set("eventConfirmNecessaryId", titleId);
        $("#confirmationDialog").modal('open');
    },
    'click .editTitle' (event) {
        event.preventDefault();

        let titleId = this._id;
        Session.set("titleMode", "edit");
        Session.set("titleId", titleId);
    },
});

deletePersonTitle = function(titleId) {
    Meteor.call('personTS.delete', titleId, function(err, result) {
        if (err) {
            console.log("Error deleting the title selected: " + err);
            showSnackbar("Error Deleting the Title!", "red");
        } else {
            showSnackbar("Title Successfully Deleted.", "green");
        }
    });
}
