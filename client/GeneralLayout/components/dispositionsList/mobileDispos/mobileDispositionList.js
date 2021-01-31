import { Dispos } from '../../../../../imports/api/dispositions.js';
import { Units } from '../../../../../imports/api/units.js';
import { Calls } from '../../../../../imports/api/calls.js';
import { UnitServiceTracking } from '../../../../../imports/api/unitServiceTracking.js';

Template.mobileDispositionList.onCreated(function() {

});

Template.mobileDispositionList.onRendered(function() {
    this.subscribe("activeDispostions");
    this.subscribe("activeUnits");
    this.subscribe("activeCalls");
    this.subscribe("currentUnitTracking");
});

Template.mobileDispositionList.helpers({
    mobileDispos: function() {
        // console.log("should be showing.");
        return Dispos.find({});
    },
});

Template.mobileDispositionList.events({
    'click .dispoMobile' (event) {
        event.preventDefault();

        let disposition = this.dispoAbbrev;

        let myId = Meteor.userId();

        let myUnit = UnitServiceTracking.findOne({ userId: myId });
        let unitId = myUnit.unitId;
        let callSign = myUnit.callSign;

        let unitInfo = Units.findOne({ _id: unitId });
        let callInfo = Calls.findOne({ "units.unit": callSign });

        $("#dispoMenuMobile").modal('close');

        clrUnit(callSign, callInfo, unitInfo, disposition);
    },
});