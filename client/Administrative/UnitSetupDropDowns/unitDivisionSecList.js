import { UnitTypes } from '../../../imports/api/unitTypes.js';

Template.unitDivisionSecList.onCreated(function() {
    this.subscribe("activeSubTypes");
});

Template.unitDivisionSecList.onRendered(function() {
    $('select').formSelect();
});

Template.unitDivisionSecList.helpers({
    unitDivisionsFound: function() {
        let myEntity = Session.get("myEntity");
        if (myEntity == "GlobalEntity") {
            let selectedSubType = Session.get("selectedSubType");
            let unitSubTypeSel = UnitTypes.find({ unitSubType: selectedSubType });
            setTimeout(function() {
                    $('select').formSelect();
                    Materialize.updateTextFields();
                }, 500);
            return unitSubTypeSel;
        } else {
            let selectedSubType = Session.get("selectedSubType");
            let unitSubTypeSel = UnitTypes.find({ unitSubType: selectedSubType, parentEntity: myEntity });
            setTimeout(function() {
                    $('select').formSelect();
                    Materialize.updateTextFields();
                }, 500);
            return unitSubTypeSel;
        }
    }
});

Template.unitDivisionSecList.events({

});
