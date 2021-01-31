import { Units } from "../../../../imports/api/units.js";
import { UnitServiceTracking } from '../../../../imports/api/unitServiceTracking.js';
import { Calls } from '../../../../imports/api/calls.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

Template.moduleButtons.onCreated(function() {
    this.subscribe("activeUnits");
    this.subscribe("currentUnitTracking");
    this.subscribe("activeCalls");
    this.subscribe("errorLogs");
});

Template.moduleButtons.onRendered(function() {
    Session.set("mobileContext", "home");
    $('.dropdown-trigger').dropdown();
    $('.modal').modal();
    
});

Template.moduleButtons.helpers({
    mobileContext: function() {
        return Session.get("mobileContext");
    },
    myCurrStatus: function() {
        let myId  = Meteor.userId();
        let unitTrackInfo = UnitServiceTracking.findOne({ userId: myId });
        if (unitTrackInfo) {
            let unitId = unitTrackInfo.unitId;
            if (unitId) {
                let unitInfo = Units.findOne({ _id: unitId });
                // console.log("returning actual unit status of " + unitInfo.currentStatus);
                return unitInfo.currentStatus;
            } else {
                // console.log("returning None for status.");
                return "None";
            }
        } else {
            return "None";
        }
    },
    alertOnCall: function() {
        return true;
    },
    mobileGridContext: function() {
        return Session.get("gridContext");
    },
});

Template.moduleButtons.events({
    'click .assignedView' (event) {
        event.preventDefault();
        Session.set("mobileContext", "assigned");
        setTimeout(function() {
            $('.dropdown-trigger').dropdown();
        }, 100);
    },
    'click .homeView' (event) {
        event.preventDefault();
        Session.set("mobileContext", "home");
    },
    'click .siaView' (event) {
        event.preventDefault();

        Session.set("mobileContext", "sia");
    },
    'click .enRoute' (event) {
        event.preventDefault();

        // gather the variables we need to put the unit enRoute
        let myId = Meteor.userId();
        let myUnit = UnitServiceTracking.findOne({ userId: myId });
        let unitId = myUnit.unitId;
        let callSign = myUnit.callSign;

        let unitInfo = Units.findOne({ _id: unitId });
        let callInfo = Calls.findOne({ "units.unit": callSign, "units.currentStatus": "AS" });

        if (callInfo) {
            // call the enroute function
            enrouteUnit(callSign, callInfo, unitInfo);
        }
    },
    'click .arrive' (event) {
        event.preventDefault();

        // gather the variables we need to set the unit arrived
        let myId = Meteor.userId();
        let myUnit = UnitServiceTracking.findOne({ userId: myId });
        let unitId = myUnit.unitId;
        let callSign = myUnit.callSign;

        let unitInfo = Units.findOne({ _id: unitId });
        let callInfo = Calls.findOne({ "units.unit": callSign, "units.currentStatus": "ER" });

        if (callInfo) {
            // call the arrive function
            arriveUnit(callSign, callInfo, unitInfo);
        }
    },
    'click #startTransportMobile' (event) {
        event.preventDefault();

    },
    'click #endTransportMobile' (event) {
        event/preventDefault();
        
    },
    'click #fireControlMobile' (event) {
        event.preventDefault();

        // gather the variables we need to set the fire control status
        let myId = Meteor.userId();
        let myUnit = UnitServiceTracking.findOne({ userId: myId });
        let unitId = myUnit.unitId;
        let callSign = myUnit.callSign;

        let unitInfo = Units.findOne({ _id: unitId });
        let callInfo = Calls.findOne({ "units.unit": callSign, "units.currentStatus": "AR" });

        if (callInfo) {
            let quickCallNo = callInfo.quickCallNo;
            // call the fire control function and pass the necessary variables.
            fireControl(callSign, quickCallNo);
        }
    },
    'click #fireOutMobile' (event) {
        event.preventDefault();

        // gather the variables we need to set the fire out status
        let myId = Meteor.userId();
        let myUnit = UnitServiceTracking.findOne({ userId: myId });
        let unitId = myUnit.unitId;
        let callSign = myUnit.callSign;

        let unitInfo = Units.findOne({ _id: unitId });
        let callInfo = Calls.findOne({ "units.unit": callSign, "units.currentStatus": "AR" });

        if (callInfo) {
            let quickCallNo = callInfo.quickCallNo;
            // call the fire out function and pass the necessary variables.
            fireOut(callSign, quickCallNo);
        }
    },
    'click .clear' (event) {
        // console.log("Clear clicked by mobile user.");
        
        // in this case we have to get the user to select a disposition
        // so we call a modal window to get the user to select their dispo
        // from the list of options.
        $("#dispoMenuMobile").modal('open');
    },
    'click .deassign' (event) {
        event.preventDefault();

        // gather the variables we need to deassign the unit.
        let myId = Meteor.userId();
        let myUnit = UnitServiceTracking.findOne({ userId: myId });
        let unitId = myUnit.unitId;
        let callSign = myUnit.callSign;

        let unitInfo = Units.findOne({ _id: unitId });
        let callInfo = Calls.findOne({ "units.unit": callSign, "units.currentStatus": { $in: ["ER", "AS", "AS / Qd"] }});

        if (callInfo) {
            // quickly set the context back to our 'Home View'
            Session.set("mobileContext", "home");

            // Call the deassign function.
            deassignUnit(callSign, callInfo, unitInfo);
        }
    },
    'click .addNotes' (event) {
        event.preventDefault();

        // let's open a simple note entry modal form.

        $("#addNotesFromMobile").modal('open');
    },
    'click .outOfVehicle' (event) {
        event.preventDefault();

        $("#OOVMobileModal").modal('open');
    },
    'click .mobileWatches' (event) {
        event.preventDefault();

        $("#mobileWatchesModal").modal('open');
    },
    'click .mobileTraffic' (event) {
        event.preventDefault();

        $("#mobileTrafficModal").modal('open');
    },
    'click .selfInitiatedCall' (event) {
        event.preventDefault();

        $("#mobileCallModal").modal('open');
    },
    'click .callsViewMobile' (event) {
        event.preventDefault();
        console.log("show show calls in grid.");

        Session.set("gridContext", "calls");
    },
    'click .unitsViewMobile' (event) {
        event.preventDefault();
        console.log("should show units in grid.");

        Session.set("gridContext", "units");
    },
});