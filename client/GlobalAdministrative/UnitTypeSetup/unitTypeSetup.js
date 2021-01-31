import { MainUnitType } from '../../../imports/api/mainUnitTypes.js';

Template.unitTypeSetup.onCreated(function() {
    this.subscribe("globalUnitTypes");
    Session.set("unitTypeNameReq", false);
    Session.set("unitTypeEditMode", "new");
});

Template.unitTypeSetup.onRendered(function() {
    $('input#unitTypeName').characterCounter();
});

Template.unitTypeSetup.helpers({
    nameReqVal: function() {
        let req = Session.get("unitTypeNameReq");
        setTimeout(function() {
                $('select').formSelect();
                Materialize.updateTextFields();
            }, 300);
        return req;
    },
    unitTypeNameEditMode: function() {
        return Session.get("unitTypeEditMode");
    },
    utName: function() {
        let editMode = Session.get("unitTypeEditMode");
        // console.log("=====================");
        // console.log("Unit Type Edit Mode: " + editMode);
        if (editMode == "edit") {
            let editId = Session.get("unitTypeEditId");
            return MainUnitType.findOne({ _id: editId });
        } else {
            return "new";
        }
    },
});

Template.unitTypeSetup.events({
    'click #SaveUnitType' (event) {
        event.preventDefault();

        let addedUT = $("#unitTypeName").val();

        if (addedUT == "" || addedUT == null) {
            // turn the field red
            Session.set("unitTypeNameReq", true);
            // console.log("Should be red");
        } else {
            Session.set("unitTypeNameReq", false);
            // console.log("Good value");
            Meteor.call("mainUnitType.add", addedUT, function(err, result) {
                if (err) {
                    console.log("Error adding Unit Type: " + err);
                    showSnackbar("Error Adding Unit Type!", "red");
                    Meteor.call("Log.Errors", "unitTypeSetup.js", "click #SaveUnitType", err);
                } else {
                    Session.set("unitTypeEditMode", "new");
                    $("#unitTypeName").val("");
                    showSnackbar("Unit Type Added Successfully!", "green");
                }
            });
        }
    },
    'click #UpdateUnitType' (event) {
        event.preventDefault();

        let editedUT = $("#unitTypeName").val();
        let utId = Session.get("unitTypeEditId");

        if (editedUT == "" || editedUT == null) {
            // turn the field red
            Session.set("unitTypeNameReq", true);
            // console.log("Should be red");
        } else {
            Session.set("unitTypeNameReq", false);
            // console.log("Good value");
            Meteor.call("mainUnitType.update", utId, editedUT, function(err, result) {
                if (err) {
                    console.log("Error editing Unit Type: " + err);
                    showSnackbar("Error Editing Unit Type!", "red");
                    Meteor.call("Log.Errors", "unitTypeSetup.js", "click #UpdateUnitType", err);
                } else {
                    Session.set("unitTypeEditMode", "new");
                    $("#unitTypeName").val("");
                    showSnackbar("Unit Type Edited Successfully!", "green");
                }
            });
        }
    },
    'click #cancelAddUnitType' (event) {
        event.preventDefault();
        Session.set("unitTypeNameReq", false);
        Session.set("unitTypeEditMode", "new");
        $("#unitTypeName").val("");
    },
});
