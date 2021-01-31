import { TransportTypes } from '../../../../imports/api/transportTypes.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';
import { Entities } from '../../../../imports/api/entities.js';

Template.endTransModal.onCreated(function() {
    this.subscribe('activeTransTypes');
    this.subscribe('activeCalls');
    this.subscribe('activeUnits');
    this.subscribe('activeEntities');
});

Template.endTransModal.onRendered(function() {
    $('.modal').modal();
});

Template.endTransModal.helpers({
    callSignForTrans: function() {
        return Session.get("callSignTrn");
    },
    unitIdTrans: function() {
        return Session.get("unitIdTrn");
    },
    callNoTrans: function() {
        return Session.get("callNoTrn");
    },
});

Template.endTransModal.events({
    'click .saveEndTransport' (event) {
        event.preventDefault();

        let unitId = Session.get("unitIdTrn");
        let callSign = Session.get("callSignTrn");
        let callNo = Session.get("callNoTrn");
        let location = Session.get("trnLocation");
        let mileageString = $("#endMileageInput").val();
        let mileage = Number(mileageString);
        let startMileage = Session.get("startMileage");

        let callInfo = Calls.findOne({ callNo: callNo, active: true });
        let unitInfo = Units.findOne({ _id: unitId });
        let callId = callInfo._id;

        endTransport(callSign, callInfo, unitInfo, callNo, callId, unitId, mileage);
    },
    'click .cancelEndTransport' (event) {
        event.preventDefault();

        $("#endMileageInput").val("");
        $("#endTransportModal").modal('close');
    }
})
