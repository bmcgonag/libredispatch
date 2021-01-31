import { Calls } from '../../../../imports/api/calls.js';

Template.howReceived.onCreated(function() {
    this.subscribe("activeCalls");
});

Template.howReceived.onRendered(function() {
    $('select').formSelect();
});

Template.howReceived.helpers({
    from911: function() {
        return Session.get("from911");
    },
});

Template.howReceived.events({

});