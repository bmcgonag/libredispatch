Template.middleName.onCreated(function() {

});

Template.middleName.onRendered(function() {

});

Template.middleName.helpers({

});

Template.middleName.events({
    'focusout .middleName' (event) {
        let eventid = event.currentTarget.id;
        let fnameVal = $("#"+eventid).val();
    },
});