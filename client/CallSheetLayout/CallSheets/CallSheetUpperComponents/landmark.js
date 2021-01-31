import { Calls } from '../../../../imports/api/calls.js';
import { Addresses } from '../../../../imports/api/addresses.js';

Template.landmark.onCreated(function() {
    this.subscribe("activeCalls");

    this.autorun(() => {
        this.subscribe("entityLandmarks", Session.get("searchFor"));
    });
});

Template.landmark.onRendered(function() {
    Session.set("typedSoFar", "");
});

Template.landmark.helpers({
    callInfoLandmark: function() {
        // get the call info for the callId selected
        let callId = Session.get("callIdCreated");
        if (callId != null && callId != "" && typeof callId != "undefined") {
            console.log("Call ID for location: " + callId);
            let info = Calls.findOne({ _id: callId });
            return info.landMark;
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
        } else {
            // console.log("Found Mode = NewCall");
            return currentMode;
        }

    },
    landmarkInfoData: function() {
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
                    field: "landMark",
                    template: Template.landmarkLookup,
                    noMatchTemplate: Template.noMatches,
                },
            ]
        }
    },
});

Template.landmark.events({
    'focusout #callLandmark' (event) {
        let callLmk = $("#callLandmark").val();

        Session.set("callLmk", callLmk);
    },
    'keyup #callLandmark' (event) {
        let typedSoFar = $("#callLandmark").val();
        // console.log(typedSoFar);
        if (typedSoFar.length >= 3) {
            Session.set("searchFor", typedSoFar);
        }
    },
});