import { Dispos } from '../../../../imports/api/dispositions.js';
import { Units } from '../../../../imports/api/units.js';
import { Calls } from '../../../../imports/api/calls.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';

Template.dispositionsList.onCreated(function() {

});

Template.dispositionsList.onRendered(function() {
    this.subscribe("activeDispostions");
    this.subscribe("activeUnits");
    this.subscribe("activeCalls");
    this.subscribe("activeUserSettings");
});

Template.dispositionsList.helpers({
    dispositionsOptions: function() {
        let myParentEntity = Session.get("myParentEntity")
        return Dispos.find({});
    },
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.dispositionsList.events({
    'click .dispo' (event) {
        event.preventDefault();

        let clrType = Session.get("clrType");
        let disposition = this.dispoAbbrev;

        if (clrType == "Unit") {
            
            let unitId = Session.get("unitIdClr");
            let callSign = Session.get("callSignClr");
            let unitInfo = Units.findOne({ _id: unitId });
            let callInfo = Calls.findOne({ "units.unit": callSign });
    
            clrUnit(callSign, callInfo, unitInfo, disposition);
        } else if (clrType == "Call") {

            let callId = Session.get("chosenCallId");
            let callInfo = Calls.findOne({ _id: callId });
            let quickCallNo = callInfo.quickCallNo;

            clearCall(quickCallNo, callInfo, disposition);
        }
    }
});
