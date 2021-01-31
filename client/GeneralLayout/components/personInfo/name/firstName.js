Template.firstName.onCreated(function() {

});

Template.firstName.onRendered(function() {

});

Template.firstName.helpers({

});

Template.firstName.events({
    'focusout .firstName' (event) {
        let eventid = event.currentTarget.id;
        let fnameVal = $("#"+eventid).val();
    },
});