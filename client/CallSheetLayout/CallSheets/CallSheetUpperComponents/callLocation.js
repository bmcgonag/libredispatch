import { Calls } from '../../../../imports/api/calls.js';
import { Addresses } from '../../../../imports/api/addresses.js';

Template.callLocation.onCreated(function() {
    this.subscribe("activeCalls");

    this.autorun(() => {
        this.subscribe("entityAddresses", Session.get("searchFor"));
    });
});

Template.callLocation.onRendered(function() {
    Session.set("callLocSet", true);
    Session.set("locReq", false);
    Session.set("typedSoFar", "");
});

Template.callLocation.helpers({
    callLocSet: function() {
        return Session.get("callLocSet");
    },
    callInfoLocation: function() {
        // get the call info for the callId selected
        let callId = Session.get("callIdCreated");
        if (callId != null && callId != "" && typeof callId != "undefined") {
            console.log("Call ID for location: " + callId);
            let info = Calls.findOne({ _id: callId });
            // $("#callLocation").val(info.location);
            return info.location;
        }
    },
    modeCallSheet: function() {
        // determine if the mode is set to view detail
        let currentMode = Session.get("mode");
        let callId = Session.get("callIdCreated");
        if (currentMode == "ViewCallDetail") {
            if (typeof callId != 'undefined' && callId != "" && callId != null) {
                let info = Calls.findOne({ _id: callId });
                setTimeout(function() {
                    $("#callLocation").val(info.location);
                }, 350);

                // console.log("Call Location should be: " + info.location);
                // console.log("Found Mode = ViewCallDetail and a Call ID of " + callId);
                return currentMode;
            } else {
                Session.set("mode", "NewCall");
                // console.log("Found Mode = ViewCallDetail but callId is not set.");
                return currentMode;
            }
        } else if (currentMode == "from911") {
            let callLoc911 = Session.get("callLoc911");
            setTimeout(function() {
                $("#callLocation").val(callLoc911);
                $("#callLocation").focus();
            }, 350);
        } else {
            // console.log("Found Mode = NewCall");
            return currentMode;
        }

    },
    locationInfoData: function() {
        let typedIn = Session.get("searchFor");

        if (typedIn == "") {
            // console.log("Still null or blank.");
            return;
        } else {
            setTimeout(function() {
                Materialize.updateTextFields();
            }, 100);
            return Addresses.find({});
        }
    },
    settings: function() {
        return {
            position: "bottom",
            limit: 20,
            rules: [
                {
                    token: '',
                    collection: Addresses,
                    field: "addressString",
                    template: Template.addressLookup,
                    noMatchTemplate: Template.noMatches,
                },
            ]
        }
    },
});

Template.callLocation.events({
    'focusout #callLocation' (event) {
        let callLoc = $("#callLocation").val();
        if (callLoc == '' || callLoc == null) {
            // keeping button disabled
            $("#callLocation").addClass('reqField');
            Session.set("locReq", false);
            Session.set("callLocSet", false);
        } else {
            $("#callLocation").removeClass('reqField');
            Session.set("locReq", true);
            Session.set("callLocSet", true);
            Session.set("callLoc", callLoc);
            // console.log("Call Loc true");
        }
    },
    'keyup #callLocation' (event) {
        let typedSoFar = $("#callLocation").val();
        // console.log(typedSoFar);
        if (typedSoFar.length >= 3) {
            Session.set("searchFor", typedSoFar);
        }
    },
});
