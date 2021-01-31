import { UnitTypes } from '../../../../imports/api/unitTypes.js';

Template.unitDivisionSetup.onCreated(function() {
    this.subscribe("activeSubTypes");
});

Template.unitDivisionSetup.onRendered(function() {
    $('#divisionChips').chips();
    Session.set("typeReq", false);
    Session.set("subTypeReq", false);
    Session.set("divRequired", false);
});

Template.unitDivisionSetup.helpers({
    typeReq: function() {
        return Session.get("typeReq");
    },
    subTypeReq: function() {
        return Session.get("subTypeReq");
    },
    divRequired: function() {
        return Session.get("divRequired");
    },
    chipColor: function() {
        let subTypeSel = Session.get("selectedSubType");
        let unitInfo = UnitTypes.findOne({ unitSubType: subTypeSel });
        let color = unitInfo.unitSubTypeColorCode;
        // console.log("Color should be: " + color);
        return color;
    },
});

Template.unitDivisionSetup.events({
    'change #unitType' (event) {
        event.preventDefault();
        // console.log("change unit type detected.");

        let selectedType = $("#unitType").val();
        // console.log("Type: "+ selectedType);
        Session.set("selectedType", selectedType);
        Session.set("typeReq", false);
    },
    'change #unitSubType' (event) {
        event.preventDefault();

        let selectedSubType = $("#unitSubType").val();
        Session.set("selectedSubType", selectedSubType);
        Session.set("subTypeReq", false);
    },
    'chip.add .divisionChips' (event) {
        event.preventDefault();
        // console.log("Div Change Detected.");
        Session.set("divRequired", false);
    },
    'click .addDivision' (event) {
        event.preventDefault();

        let unitType = $("#unitType").val();
        let unitSubType = $("#unitSubType").val();
        let unitDivision = M.Chips.getInstance($('.divisionChips')).chipsData;

        let userEntity = Meteor.user().profile.usersEntity;

        unitTypeReq(unitType);
        unitSubTypeReq(unitSubType);
        unitDivisionReq(unitDivision);

        if (unitType == "" || unitSubType == "" || unitDivision == "" || unitDivision == null) {
            showSnackbar("Required information is missing!", "red");
        } else {
            Meteor.call("unitDivisions.insert", unitType, unitSubType, unitDivision, userEntity, function(err, result) {
                if (err) {
                    showSnackbar("Error Adding Division", "red");
                } else {
                    showSnackbar("Division Added Successfully!", "green");
                }
            });
        }
    },
});
