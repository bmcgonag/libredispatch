import { Units } from '../../../../../imports/api/units.js';
import { Entities } from '../../../../../imports/api/entities.js';

Template.manualUnitSetup.onCreated(function() {
    this.subscribe("activeEntities");
    this.subscribe("activeUnits");
});

Template.manualUnitSetup.onRendered(function() {
    $('.callSignChips').chips();
    Session.set("allowAddUnits", false);
});

Template.manualUnitSetup.helpers({
    divisionReq: function() {
        return Session.get("divisionReq");
    },
    allowAddUnits: function() {
        setTimeout(function() {
            $('.callSignChips').chips();
        }, 500);
        return Session.get("allowAddUnits");
    },
});

Template.manualUnitSetup.events({
    'change #unitType' (event) {
        event.preventDefault();
        // console.log("change unit type detected.");

        let selectedType = $("#unitType").val();
        // console.log("Type: "+ selectedType);

        if (selectedType != '' && selectedType != null) {
            Session.set("selectedType", selectedType);
            Session.set("typeReq", false);
        }
    },
    'change #unitSubType' (event) {
        event.preventDefault();

        let selectedSubType = $('#unitSubType').val();
        if (selectedSubType != '' && selectedSubType != null) {
            Session.set("selectedSubType", selectedSubType);
            Session.set("subTypeReq", false);
        }
    },
    'change #entitySelection' (event) {
        event.preventDefault();

        let entitySelected = $("#entitySelection").val();
        // console.log("Entity Sel: " + entitySelected);
        if (entitySelected != '' && entitySelected != null) {
            Session.set("allowAddUnits", true);
            Session.set("entityReq", false);
        }
    },
    'change #unitPrimaryDivision' (event) {
        event.preventDefault();

        let priDivision = $("#unitPrimaryDivision").val();
        if (priDivision != '' && priDivision != null) {
            Session.set("divisionReq", false);
        }
    },
    'change .callSignChips' (event) {
        event.preventDefault();

        // check to ensure the call sign entered doesn't already exist
        // for the parent entity
        let unitEntity = $("#entitySelection").val();
        let callSignEntered = M.Chips.getInstance($('.callSignChips')).chipsData;
        let parentEntity = Entities.findOne({ usersEntity: unitEntity }).parentEntity;
        let callSignCount = callSignEntered.length;

        for (i=0; i<callSignCount; i++) {
            let callSignExists = Units.findOne({ callSign: callSignEntered[i], parentEntity: parentEntity });

            if (callSignExists) {
                showSnackbar("The Last Call Sign Already Exists!", "red");
                Session.set("allowAddUnits", false);
            }
        }
    },
    'click #addUnits' (event) {
        event.preventDefault();

        let unitEntity = $("#entitySelection").val();
        let unitType = $("#unitType").val();
        let unitSubType = $("#unitSubType").val();
        let unitPrimaryDivision = $("#unitPrimaryDivision").val();
        let unitSecondaryDivision = $("#unitSecondaryDivision").val();
        let unitCallSigns = M.Chips.getInstance($('.callSignChips')).chipsData;

        // console.log("Call signs: ");
        console.dir(unitCallSigns);

        if (unitSecondaryDivision == null) {
            unitSecondaryDivision = "";
        }

        // now check that all required fields are filled
        unitTypeReq(unitType);
        unitSubTypeReq(unitSubType);
        unitDivisionReq(unitPrimaryDivision);
        EntityReq(unitEntity);

        if (Session.get("typeReq") == true || Session.get("subTypeReq") == true || Session.get("divisionReq") == true || Session.get("entityReq") == true) {
            showSnackbar("Required Information is Missing!", "red");
        } else {
            Meteor.call('add.serviceUnits', unitCallSigns, unitEntity, unitType, unitSubType, unitPrimaryDivision, unitSecondaryDivision, function(err, result) {
                if (err) {
                    showSnackbar("Error Adding Ative Units!", "red");
                    // console.log("Error adding active units: " + err);
                } else {
                    showSnackbar("Added Active Units Successfully!", "green");
                    clearEnteredUnits();
                    setTimeout(function() {
                        $('select').formSelect();
                        Materialize.updateTextFields();
                    }, 500);
                }
            });
        }
    },
});

clearEnteredUnits = function() {
    let inputs = $('.callSignChips').find(':input');
    // console.log("Input is: ");
    let callSignChips = $(inputs).attr('id');
    $('#' + callSignChips).val("");
    $("#entitySelection").val("");
    $("#unitPrimaryDivision").val("");
    $("#unitSecondaryDivision").val("");
    $("#unitSubType").val("");
    $("#unitType").val("");
    return;
}
