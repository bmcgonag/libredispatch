import { UnitTypes } from '../../../../imports/api/unitTypes.js';
import { Entities } from '../../../../imports/api/entities.js';

Template.unitSubTypeSetup.onCreated(function() {
    this.subscribe("activeSubTypes");
    this.subscribe("activeEntities");
});

Template.unitSubTypeSetup.onRendered(function() {
    Session.set("subTypeReq", false);
    Session.set("typeReq", false);
});

Template.unitSubTypeSetup.helpers({
    subTypeReq: function() {
        return Session.get("subTypeReq");
    },
});

Template.unitSubTypeSetup.events({
    'click .addSubType' (event) {
        event.preventDefault();

        let unitType = $("#unitType").val();
        let unitSubType = $("#newUnitSubType").val();
        let unitSubTypeColorCode = $("#unitSubTypeColor").val();
        let isSystem = $("#subTypeIsSystem").prop('checked');

        if (unitSubTypeColorCode == '' || unitSubTypeColorCode == null) {
            unitSubTypeColorCode = "#ffffff";
        }

        unitSubTypeReq(unitSubType);

        unitTypeReq(unitType);

        if (Session.get("typeReq")== true || Session.get("subTypeReq") == true) {
            showSnackbar("Required fields missing values!", "red");
        } else {
            Meteor.call('unitSubType.insert', unitType, unitSubType, unitSubTypeColorCode, isSystem, function(err, result) {
                if (err) {
                    showSnackbar("Error while adding sub-type entry.", "red");
                    // console.log("Error Happened: " + err);
                } else {
                    $("#unitType").val("");
                    $("#unitSubType").val("");
                    $("#unitSubTypeColor").val("#000000");
                    showSnackbar("Sub-type Added Successfully!", "green");
                }
            });
        }
    },
    'change .unitType' (event) {
        event.preventDefault();
        Session.set("typeReq", false);
    },
    'change .unitSubType' (event) {
        event.preventDefault();
        Session.set("subTypeReq", false);
    },
    'click #copySubType' (event) {
        event.preventDefault();
        let myId = Meteor.userId();
        if (Roles.userIsInRole(myId, ['GlobalAdmin'])) {
            showSnackbar("You Appear to be a Global Admin. This function is not for Global Entity Use.", "orange");
            return;
        } else {
            let i = 0;
            Meteor.call("copy.unitTypes", i);
        }
    },
});
