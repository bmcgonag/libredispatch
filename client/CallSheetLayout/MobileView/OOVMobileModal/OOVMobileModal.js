import { Units } from "../../../../imports/api/units.js";
import { UnitServiceTracking } from '../../../../imports/api/unitServiceTracking.js';
import { Calls } from '../../../../imports/api/calls.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

Template.OOVMobile.onCreated(function() {
    this.subscribe("activeUnits");
    this.subscribe("currentUnitTracking");
    this.subscribe("activeCalls");
    this.subscribe("errorLogs");
});

Template.OOVMobile.onRendered(function() {
    Session.set("mode", "NewCall");
});

Template.OOVMobile.helpers({

});

Template.OOVMobile.events({
    'click #cancelMobileOOV' (event) {
        event.preventDefault();

        $("#OOVMobileModal").modal('close');
    },
    'click #saveMobileOOV' (event) {
        event.preventDefault();

        let oovType = $("#oovTypeNameSelect").val();
        let oovLocation = $("#callLocation").val();
        let latLon = $("#latAndLonInfo").val();

        console.log("OOV Type: " + oovType);
        console.log("Call Loc: " + oovLocation);
        console.log("Lat and Lon: " + latLon);
    },
});