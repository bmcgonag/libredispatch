import { TransportTypes } from '../../../../imports/api/transportTypes.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';
import { Entities } from '../../../../imports/api/entities.js';

Template.startTransModal.onCreated(function() {
    this.subscribe('activeTransTypes');
    this.subscribe('activeCalls');
    this.subscribe('activeUnits');
    this.subscribe('activeEntities');
    $('select').formSelect();
});

Template.startTransModal.onRendered(function() {
    $('.modal').modal();
    $('select').formSelect();
});

Template.startTransModal.helpers({
    transTypes: function() {
        return TransportTypes.find({});
    },
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

Template.startTransModal.events({
    'click .saveStartTransport' (event) {
        event.preventDefault();

        let callSign = Session.get("callSignTrn");
        let unitId = Session.get("unitIdTrn");
        let callNo = Session.get("callNoTrn");
        let callInfo = Calls.findOne({ callNo: callNo });
        let unitInfo = Units.findOne({ _id: unitId });
        let callId = callInfo._id;
        let transType = $("#transportType").val();
        let transDest = $("#toLocation").val();
        let transDesc = $("#transDescription").val();
        let mileage = $("#transportStartMileage").val();

        if (transType == null || transType == "") {
            showSnackbar("Transport Type is Required!", "red")
        } else if (transDest == "" || transDest == null) {
            showSnackbar("Transport Destination is Required!", "red");
        } else {
            startTransport(callSign, callInfo, unitInfo, callNo, callId, unitId, transType, transDest, transDesc, mileage);
        }
    }
});
