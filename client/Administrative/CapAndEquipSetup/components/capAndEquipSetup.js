import { CapAndEquip } from '../../../../imports/api/capAndEquip.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { clearForm } from '../../adminGeneralFunctions.js';

Template.capAndEquipSetup.onCreated(function() {
    this.subscribe('errorLogs');
    this.subscribe('activeCapAndEquip');
});

Template.capAndEquipSetup.onRendered(function() {
    $('select').formSelect();
    $('input#capDescription, input#capAbbrev').characterCounter();
});

Template.capAndEquipSetup.helpers({
    capMode: function() {
        Meteor.setTimeout(function() {
            Materialize.updateTextFields();
        }, 250);
        return Session.get("capMode");
    },
    editData: function() {
        let mode = Session.get("capMode");
        if (mode == "Edit") {
            setTimeout(function() {
                $('select').formSelect();
                Materialize.updateTextFields();
            }, 500);
            let capId = Session.get("capEquipId");
            return CapAndEquip.findOne({ _id: capId, active: true });
        }
    },
});

Template.capAndEquipSetup.events({
    'click #cancelCapEntry' (event) {
        event.preventDefault();

        // clear all fields
        clearForm();
        Session.set("capMode", "add");
        return;
    },
    'click #saveCapEntry' (event) {
        event.preventDefault();

        // first we'll grab the form info
        let type = $("#capOrEquip").val();
        let description = $("#capDescription").val();
        let abbrev = $("#capAbbrev").val();
        let personOrApp = $("#personOrApparatus").val();
        let isSystem = $("#capEquipSystem").prop('checked');

        // now we make sure they are all filled in.
        if (type == null || type == "") {
            showSnackbar("Capability or Equipment must be Selected!", "red");
        } else if (description == null || description == "") {
            showSnackbar("Description Cannot be Blank!", "red");
        } else if (abbrev == null || abbrev == "") {
            showSnackbar("Abbreviation Cannot be Blank!", "red");
        } else if (personOrApp == null || personOrApp == "") {
            showSnackbar("Person Or Apparatus must be Selected!", "red");
        } else {
            // now we can save the data
            Meteor.call('capEquip.insert', type, description, abbrev, personOrApp, isSystem, function(err, result) {
                if (err) {
                    console.log("Error saving Capability / Equip: " + err);
                    showSnackbar("Error While Saving Capability / Equipment!", "red");
                    Meteor.call("Error.Log", "capAndEquipSetup.js", "click #saveEquip action failed with error.", err, function(error, results) {
                        if (error) {
                            console.log("Error occurred trying to save error data to the Error Log: " + error);
                        }
                    });
                } else {
                    showSnackbar("New Capability / Equipment Saved Successfully!", "green");
                    Session.set("capMode", "add");
                    clearForm();
                }
            });
        }
    },
    'click #updateCapEntry' (event) {
        event.preventDefault();

        // we need to grab the id for this edited item
        let capId = Session.get("capEquipId");

        // now we'll grab the form info
        let type = $("#capOrEquip").val();
        let description = $("#capDescription").val();
        let abbrev = $("#capAbbrev").val();
        let personOrApp = $("#personOrApparatus").val();
        let isSystem = $("#isSystem").prop('checked');

        // make sure the fields are all filled
        if (type == null || type == "") {
            showSnackbar("Capability or Equipment must be Selected!", "red");
        } else if (description == null || description == "") {
            showSnackbar("Description Cannot be Blank!", "red");
        } else if (abbrev == null || abbrev == "") {
            showSnackbar("Abbreviation Cannot be Blank!", "red");
        } else if (personOrApp == null || personOrApp == "") {
            showSnackbar("Person Or Apparatus must be Selected!", "red");
        } else {
            // let's update this data in the collection

            Meteor.call('capEquip.update', capId, type, description, abbrev, personOrApp, isSystem, function(err, result) {
                if (err) {
                    console.log("Error updating Capability / Equip: " + err);
                    showSnackbar("Error While Updating Capability / Equipment!", "red");
                    Meteor.call("Error.Log", "capAndEquipSetup.js", "click #updateEquip action failed with error.", err, function(error, results) {
                        if (error) {
                            console.log("Error occurred trying to save error data to the Error Log: " + error);
                        }
                    });
                } else {
                    showSnackbar("Capability / Equipment Updated Successfully!", "green");
                    Session.set("capMode", "add");
                    clearForm();
                }
            })
        }
    },
    'click #copyCapAndEquip' (event) {
        event.preventDefault();
        let myId = Meteor.userId();
        if (Roles.userIsInRole(myId, ['GlobalAdmin'])) {
            showSnackbar("You Appear to be a Global Admin. This function is not for Global Entity Use.", "orange");
            return;
        } else {
            let i = 0;
            Meteor.call("copy.capAndEquip", i);
        }
    },
});