import { VehColors } from '../../../../../imports/api/vehColors.js';

Template.vehColorInput.onCreated(function() {
    this.subscribe('activeVehColors');
});

Template.vehColorInput.onRendered(function() {
    let colorSet = Session.get("colorSet");
    Materialize.updateTextFields();
    // now use the colorSet object
    $('.chips-placeholder').chips({
        placeholder: '+Color',
        secondaryPlaceholder: 'Enter a Color',
        autocompleteOptions: {
            data: colorSet,
            limit: Infinity,
            minLength: 1
        }
    });
});

Template.vehColorInput.helpers({

});

Template.vehColorInput.events({
    'focusin .vehColorInput' (event) {
        // make a colorSet object
        const colors = VehColors.find().fetch();
        var colorSet = {}
        for (j=0; j < colors.length; j++) {
            colorSet[colors[j].veh_color_desc] = null;
        }
        console.dir(colorSet);
        Session.set("colorSet", colorSet);
    },
});
