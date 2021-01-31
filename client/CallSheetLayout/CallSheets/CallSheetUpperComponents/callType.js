import { CallTypes } from '../../../../imports/api/callTypes.js';
import { Calls } from '../../../../imports/api/calls.js';

Template.callType.onCreated(function() {
    this.subscribe('activeCallTypes');
    this.subscribe("activeCalls");
});

Template.callType.onRendered(function() {
    Session.set("callTypeSet", true);
    $('select').formSelect();
    setTimeout(function() {
        $('select').formSelect();
        Materialize.updateTextFields();
    }, 350);
});

Template.callType.helpers({
    callTypeCodes: function() {
        return CallTypes.find({ active: true }, { sort: { callTypeName: 1 }});
    },
    callTypeSet: function() {
        return Session.get("callTypeSet");
    },
    callInfo: function() {
        // get the call info for the callId selected
        let callId = Session.get("callIdCreated");
        let info = Calls.findOne({ _id: callId });
        // console.log("Call Type should be: " + info.type);
        setTimeout(function() {
            $('select').formSelect();
            Materialize.updateTextFields();
        }, 250);
        return info;
    },
    modeSetting: function() {
        // console.log(Session.get("mode"));
        let modeSet = Session.get("mode");
        // console.log("Mode for Call Type should be: " + modeSet);
        setTimeout(function() {
            $('select').formSelect();
            Materialize.updateTextFields();
        }, 250);
        return modeSet;
    },
});

Template.callType.events({

});
