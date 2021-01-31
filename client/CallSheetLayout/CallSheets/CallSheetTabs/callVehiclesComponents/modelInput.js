import { VehMakesModels } from '../../../../../imports/api/vehMakesModels.js';

Template.modelInput.onCreated(function() {
    this.subscribe('activeVehMakesModels');
});

Template.modelInput.onRendered(function() {
    setTimeout(function() {
        $('select').formSelect();
    }, 3000);
});

Template.modelInput.helpers({
    modelOptions: function() {
        var makeInput = Session.get("makeInputVal");
        var models = VehMakesModels.find({ make_code: makeInput });
        Materialize.updateTextFields();
        return models;
    },
});

Template.modelInput.events({

});
