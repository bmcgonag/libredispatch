import { Units } from '../../../../imports/api/units.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { Entities } from '../../../../imports/api/entities.js';
import { Meteor } from 'meteor/meteor';

Template.unitCapEquipForm.onCreated(function() {
    this.subscribe('activeUnits');
    this.subscribe('activeEntities');
    this.subscribe('errorLogs');
});

Template.unitCapEquipForm.onRendered(function() {
    $('select').formSelect();
    
});

Template.unitCapEquipForm.helpers({
    unitEntities: function() {
        let entityParent = Session.get("entityParentInfo");
        return Entities.find({ entityParent: entityParent, active: true });
    },
    unitCapEditMode: function() {
        let capEditMode = Session.get("unitCapEditMode");
        Meteor.setTimeout(function() {
            $('select').formSelect();
            Materialize.updateTextFields();
        }, 250);
        return capEditMode;
    },
    editCapUnitInfo: function() {
        let editUnitCapId = Session.get("editUnitCapId");
        return Units.findOne({ _id: editUnitCapId });
    },
});

Template.unitCapEquipForm.events({
    'click #cancelUnitCapEquip' (event) {
        event.preventDefault();

        // let's clear all the fields on the form
        $("#editUnitNo").val("");
        $("#unitCap").val("");
        $("#unitEquip").val("");
        $("#primDivision").val("");
        $("#secDivision").val("");
        $("#editUnitType").val("");
        $("#editUnitSubtype").val("");
        $("#editUnitEntity").val("");

        // now let's hide the form.
        Session.set("unitCapEditMode", "NoEdit");
    },
    'click #updateUnitCapEquip' (event) {
        event.preventDefault();

        // let's gather the relevant data from the fields
        let unitId = Session.get("editUnitCapId");
        let editUnitNo = $("#editUnitNo").val();
        let unitCap = $("#unitCap").val();
        let unitEquip = $("#unitEquip").val();
        let primDivision = $("#primDivision").val();
        let secDivision = $("#secDivision").val();
        let editUnitType = $("#editUnitType").val();
        let editUnitSubtype = $("#editUnitSubtype").val();
        let editUnitEntity = $("#editUnitEntity").val();

        // now let's make sure the required ones are set.
        // What's required?
        // UnitNo (Call Sign), Primary Division, Entity, Subtype, Type

        if (editUnitNo == "" || editUnitNo == null) {
            showSnackbar("Unit Number cannot be blank!", "red");
        } else if (primDivision == "" || primDivision == null) {
            showSnackbar("Primary Division cannot be blank!", "red");
        } else if (editUnitType == "" || editUnitType == null) {
            showSnackbar("Unit Type cannot be blank!", "red");
        } else if (editUnitSubtype == "" || editUnitSubtype == null) {
            showSnackbar("Unit Subtype cannot be blank!", "red");
        } else if (editUnitEntity == "" || editUnitEntity == null) {
            showSnackbar("Unit Entity cannot be blank!", "red");
        } else {
            // now we can save the data to the collection
            Meteor.call('unit.updateCapabilityAndEquipment', unitId, callSign, capability, equipment, priDivision, secDivision, type, subtype, entity, function(err, result) {
                if (err) {
                    console.log("Error updating unit for capabilities and equipment: " + err);
                    showSnackbar("Error Updating Unit Capabilities and Equipment!", "red");
                    Meteor.call("Error.Log", "unitCapEquipForm.js", "calling unit.updateCapabilityAndEquipment method: ", err, function(error, results) {
                        if (error) {
                            console.log("Error writing the unitCapEquipForm.js error to the log: " + error);
                        }
                    });
                } else {
                    showSnackbar("Capability Updated on Unit!", "green");
                    $("#unitCap").val("");
                    $("#unitEquip").val("");
                }
            });
        }
    },
});