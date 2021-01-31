import { VehMakesModels } from '../../../../../imports/api/vehMakesModels.js';

Template.makeInput.onCreated(function() {
    this.subscribe('activeVehMakesModels');
});

Template.makeInput.onRendered(function() {
    setTimeout(function() {
        $('select').formSelect();
    }, 3000);
});

Template.makeInput.helpers({
    makeOptions: function() {
        return VehMakesModels.find({});
    },
});

Template.makeInput.events({
    'change .makeInput' (event) {
        Session.set("makeInputVal", $("#makeInput").val());
        // console.log("make input: " + Session.get("makeInputVal"));
    },
});
