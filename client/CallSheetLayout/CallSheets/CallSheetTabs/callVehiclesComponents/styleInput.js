import { VehStyles } from '../../../../../imports/api/vehStyles.js';

Template.styleInput.onCreated(function() {
    this.subscribe('activeVehStyles');
});

Template.styleInput.onRendered(function() {
    setTimeout(function() {
        $('select').formSelect();
    }, 3000);
});

Template.styleInput.helpers({
    styleOptions: function() {
        return VehStyles.find({});
    },
});

Template.styleInput.events({

});
