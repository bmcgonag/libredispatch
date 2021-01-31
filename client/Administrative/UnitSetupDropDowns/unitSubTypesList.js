import { UnitTypes } from '../../../imports/api/unitTypes.js';

Template.unitSubTypesList.onCreated(function() {
    this.subscribe("activeSubTypes");
});

Template.unitSubTypesList.onRendered(function() {
    $('select').formSelect();
});

Template.unitSubTypesList.helpers({
    unitSubTypes: function() {
        let selectedType = Session.get("selectedType");
        let unitTypeSel = UnitTypes.find({ unitType: selectedType });
        setTimeout(function() {
                $('select').formSelect();
                Materialize.updateTextFields();
            }, 500);
        return unitTypeSel;
    },
    subTypeReq: function() {
        let val = Session.get("subTypeReq");
        // console.log("Val sub" + val);
        setTimeout(function() {
                $('select').formSelect();
                Materialize.updateTextFields();
            }, 300);
        return val;
    }
});
