import { UnitTypes } from '../../../imports/api/unitTypes.js';

Template.unitDivisionList.onCreated(function() {
    this.subscribe("activeSubTypes");
});

Template.unitDivisionList.onRendered(function() {
    $('select').formSelect();
});

Template.unitDivisionList.helpers({
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
    },
    divisionReq: function() {
        let val = Session.get("divisionReq");
        // console.log("Val div req: " + val);
        setTimeout(function() {
                $('select').formSelect();
                Materialize.updateTextFields();
            }, 300);
        return val;
    },
});

Template.unitDivisionList.events({

});
