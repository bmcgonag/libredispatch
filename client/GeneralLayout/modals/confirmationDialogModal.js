import { UserSettings } from "../../../imports/api/userSettings";

Template.confirmationDialogModal.onCreated(function() {
    this.subscribe('activeUserSettings');
});

Template.confirmationDialogModal.onRendered(function() {

});

Template.confirmationDialogModal.helpers({
    confirmTitle: function() {
        return Session.get("confirmationDialogTitle");
    },
    confirmContent: function() {
        return Session.get("confirmationDialogContent");
    },
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.confirmationDialogModal.events({
    'click .confirm' (event) {
        event.preventDefault();

        let callFunction = Session.get("eventConfirmCallBackFunction");
        let functionPassId = Session.get("eventConfirmNecessaryId"); // <-- this can be an actual ID, an object, a function, whatever...

        $("#confirmationDialog").modal('close');

        // console.log("Passed Function Name: " + callFunction); // <-- allows you to see teh function name passed.
        // console.log("Passed Id: " + functionPassId); // <-- allows you to see what ID is being passed.

        window[callFunction](functionPassId); // <-- calls the function and passed the Id on confirm.
    },
    'click .cancelConfirm' (event) {
        event.preventDefault();

        $("#confirmationDialog").modal('close');
    },
});
