import { Calls } from '../../../imports/api/calls.js';

Template.callSheetFormHeader.onCreated(function() {
    this.subscribe("activeCalls");
});

Template.callSheetFormHeader.onRendered(function() {
    Session.set("mode", "NewCallSheet");
});

Template.callSheetFormHeader.helpers({
    mode: function() {
        let mode = Session.get("mode");
        return mode;
    },
    callDate: function() {
        if ( Session.get("mode") == "ViewCallDetail" ) {
            let call = Calls.findOne({ _id: Session.get("callIdCreated") });
            return moment(call.sentToDispatchAt).format("MM/DD/YYYY hh:mm:ss");
        }
    },
    call: function() {
        if ( Session.get("mode") == "ViewCallDetail" ) {
            return Calls.findOne({ callNo: Session.get("viewDetailFor") });
        }
    }
});

Template.callSheetFormHeader.events({

});
