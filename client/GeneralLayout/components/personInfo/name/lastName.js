Template.lastName.onCreated(function() {

});

Template.lastName.onRendered(function() {

});

Template.lastName.helpers({

});

Template.lastName.events({
    'focusout .lastName' (event) {
        let eventid = event.currentTarget.id;
        let fnameVal = $("#"+eventid).val();
    },
});