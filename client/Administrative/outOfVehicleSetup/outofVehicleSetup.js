import { OOVTypes } from '../../../imports/api/outOfVehicleTypes.js';
import { UnitTypes } from '../../../imports/api/unitTypes.js';
import { UnitTypesList } from '../../../imports/api/unitTypesList.js';
import { MainUnitType } from '../../../imports/api/mainUnitTypes.js';
import { UserSettings} from '../../../imports/api/userSettings.js';

var unitTypeObj = [];
var unitTypeApplies = [];
var i=0;

Template.outOfVehicleSetup.onCreated(function() {
    this.subscribe("activeSubTypes");
    this.subscribe("oovTypes");
    this.subscribe("unitTypeNames");
    this.subscribe("globalUnitTypes");
    this.subscribe("activeUserSettings");
});

Template.outOfVehicleSetup.onRendered(function() {
    let utSet = Session.get("utSet");

    // here we set the fields to show character counters
    $('input#oovTypeName, input#oovDescription').characterCounter();
    $('.tooltipped').tooltip();
});

Template.outOfVehicleSetup.helpers({
    unitTypes: function() {
        return MainUnitType.find({});
    },
    oovTypeMode: function() {
        return Session.get("oovTypeMode");
    },
    oovEditInfo: function() {
        let mode = Session.get("oovTypeMode");

        if (mode == 'edit') {
            let oovTypeId = Session.get("oovEditId");
            return OOVTypes.findOne({ _id: oovTypeId });
        }
    },
    unitApplies: function() {
        let mode = Session.get("oovTypeMode");
        // console.log(this.unitType);
        let unitTypeNow = this.unitType;

        if (mode == 'edit') {
            let oovTypeId = Session.get("oovEditId");

            let oovType = OOVTypes.findOne({ _id: oovTypeId }); // <-- we know there's only 1 with the id we use
            let oovTypeAppliesCount = oovType.appliesToUnitTypes.length; // <-- get the number of items in this array in the document
             
            let thisUnitTypeChecked;

            for (j=0; j < oovTypeAppliesCount; j++) {
                // console.log("Compare " + unitTypeNow + " to " + oovType.appliesToUnitTypes[j]);
                if (unitTypeNow == oovType.appliesToUnitTypes[j]) {
                    thisUnitTypeChecked = true
                    break;
                } else {
                    thisUnitTypeChecked = false;
                }
            }
            return thisUnitTypeChecked;
        }
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },

});

Template.outOfVehicleSetup.events({
    'click #saveOOV' (event) {
        event.preventDefault();

        applyToTypes = [];
        let avail = $("#availSwitch").prop('checked');
        let locRequired = $("#locSwitch").prop('checked');
        let oovTypeName = $("#oovTypeName").val();
        let oovDescription = $("#oovDescription").val();
        let isSystem = $("#isSystem").prop('checked');

        // now let's get the list of checked unit types to apply this oov to.
        let types = MainUnitType.find({}).fetch();
        let typeCount = types.length;

        for (i=0; i < typeCount; i++) {
            let typeName = types[i].unitType;
            let selected = $("#" + typeName).prop('checked');
            
            if (selected == true) {
                applyToTypes.push(typeName);
            } else {
                console.log(typeName + " was not set to true.");
            }
        }

        console.dir(applyToTypes);

        if (oovTypeName == "" || oovTypeName == null) {
            showSnackbar("Type Name is a Required Field", "red");
            $("#oovTypeName").addClass("red white-text");
        } else if (oovDescription == "" || oovDescription == null) {
            showSnackbar("Description is Required", "red");
            $("#oovDescription").addClass("red white-text");
        } else if (applyToTypes.length == 0) {
            showSnackbar("No Types Selected, but are Required!", "red");
        } else {
            console.log("All Good!")
            
            Meteor.call("oovType.insert", oovTypeName, oovDescription, avail, applyToTypes, locRequired, isSystem, function(err, result) {
                if (err) {
                    console.log("Error adding new oovType user-level: " + err);
                    showSnackbar("Error Adding OOV Type", "red");
                    Meteor.call("Log.Errors", "outofVehicleSetup.js", "saveOOv method", err);
                } else {
                    showSnackbar("OOV Type Added Successfully!", "green");
                    $("#oovTypeName").val("");
                    $("#oovDescription").val("");
                    for (j=0; j < typeCount; j++) {
                        let typeName = types[j].unitType;
                        $("#" + typeName).prop('checked', false);
                    }
                    $("#locSwitch").prop('checked', false);
                    $("#availSwitch").prop('checked', false);
                    $("#isSystem").prop('checked', false);
                }
            });
        }

    },
    'click #updateOOVType' (event) {
        event.preventDefault();

        let oovTypeId = Session.get("oovEditId");

        applyToTypes = [];
        let avail = $("#availSwitch").prop('checked');
        let locRequired = $("#locSwitch").prop('checked');
        let oovTypeName = $("#oovTypeName").val();
        let oovDescription = $("#oovDescription").val();
        let isSystem = $("#isSystem").prop('checked');

        // now let's get the list of checked unit types to apply this oov to.
        let types = MainUnitType.find({}).fetch();
        let typeCount = types.length;

        for (i=0; i < typeCount; i++) {
            let typeName = types[i].unitType;
            let selected = $("#" + typeName).prop('checked');
            
            if (selected == true) {
                applyToTypes.push(typeName);
            } else {
                console.log(typeName + " was not set to true.");
            }
        }

        if (oovTypeName == "" || oovTypeName == null) {
            showSnackbar("Type Name is a Required Field", "red");
            $("#oovTypeName").addClass("red white-text");
        } else if (oovDescription == "" || oovDescription == null) {
            showSnackbar("Description is Required", "red");
            $("#oovDescription").addClass("red white-text");
        } else if (applyToTypes.length == 0) {
            showSnackbar("No Types Selected, but are Required!", "red");
        } else {
            console.log("All Good!")
            
            Meteor.call("oovType.update", oovTypeId, oovTypeName, oovDescription, avail, applyToTypes, locRequired, isSystem, function(err, result) {
                if (err) {
                    console.log("Error adding new oovType user-level: " + err);
                    showSnackbar("Error Adding OOV Type", "red");
                    Meteor.call("Log.Errors", "outofVehicleSetup.js", "saveOOv method", err);
                } else {
                    showSnackbar("OOV Type Added Successfully!", "green");
                    $("#oovTypeName").val("");
                    $("#oovDescription").val("");
                    for (j=0; j < typeCount; j++) {
                        let typeName = types[j].unitType;
                        $("#" + typeName).prop('checked', false);
                    }
                    $("#locSwitch").prop('checked', false);
                    $("#availSwitch").prop('checked', false);
                    Session.set("oovTypeMode", "new");
                    $("#isSystem").prop('checked', false);
                }
            });
        }

    },
    'click #cancelAddOOV' (event) {
        event.preventDefault();

        Session.set("oovTypeMode", "new");

        let types = MainUnitType.find({}).fetch();
        let typeCount = types.length;

        $("#oovTypeName").val("");
        $("#oovDescription").val("");
        $("#locSwitch").prop('checked', false);
        $("#availSwitch").prop('checked', false);
        $("#isSystem").prop('checked', false);
        for (j=0; j < typeCount; j++) {
            let typeName = types[j].unitType;
            $("#" + typeName).prop('checked', false);
        }
    },
    'click #copyOOVTypes' (event) {
        event.preventDefault();
        let myId = Meteor.userId();
        if (Roles.userIsInRole(myId, ['GlobalAdmin'])) {
            showSnackbar("You Appear to be a Global Admin. This function is not for Global Entity Use.", "orange");
            return;
        } else {
            let i=0;
            Meteor.call("copy.oovTypes", i);
        }
    },
});
