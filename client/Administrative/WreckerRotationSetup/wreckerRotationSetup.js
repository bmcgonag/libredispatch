import { WreckerRotation } from '../../../imports/api/wreckerRotation.js';
import { Entites } from '../../../imports/api/entities.js';
import { Units } from '../../../imports/api/units.js';
import { UnitTypes } from '../../../imports/api/unitTypes.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';
import { MainUnitType } from '../../../imports/api/mainUnitTypes.js';

Template.wreckerRotationSetup.onCreated(function() {
    this.subscribe('activeEntities');
    this.subscribe('activeUnits');
    this.subscribe('activeSubTypes');
    this.subscribe('globalUnitTypes');
});

Template.wreckerRotationSetup.onRendered(function() {
    $('select').formSelect();
    Session.set("rotationType", "");
    Session.set("towCapability", "");
    $('.tooltipped').tooltip();
});

Template.wreckerRotationSetup.helpers({
    showWreckerServices: function() {
        let rotFreq = Session.get("rotationFrequency");
        let rotType = Session.get("rotationType");
        let towCap = Session.get("towCapability");
        if (rotType != "" && towCap != "" && rotFreq != "") {
            setTimeout(function() {
                $('select').formSelect();
            }, 100);
            return true;
        } else {
            return false;
        }
    },
    unitProviders: function() {
        let rotType = Session.get("rotationType");
        let towCap = Session.get("towCapability");
        return UnitTypes.find({ unitType: rotType, unitSubType: towCap });
    },
    rotFreqSel: function() {
        let rotTypeVal = Session.get("rotationFrequency");
        return rotTypeVal;
    },
    rotTypeSel: function() {
        let rotType = Session.get("rotationType");
        // can I use this somewhere - do I need to?
        setTimeout(function() {
            $('select').formSelect();
        }, 250);
        return rotType;
    },
});

Template.wreckerRotationSetup.events({
    'change #unitType' (event) {
        // for both this and towCapability we want to filter the grid to only the wreckers that fit the rotation.
        let rotType = $("#unitType").val();
        console.log("Rot Type: " + rotType);
        Session.set("rotationType", rotType);
    },
    'change #rotationFrequency' (event) {
        event.preventDefault();

        // get the frequency.
        let rotFreq = $("#rotationFrequency").val();
        console.log("Rot Freq: " + rotFreq);
        Session.set("rotationFrequency", rotFreq);
    },
    'change #towCapability' (event) {
        event.preventDefault();

        // for both this and rotationType we wantn to filter the grid to only the wreckers that fit the rotation.
        let towCap = $("#towCapability").val();
        console.log("Tow Cap: " + towCap);
        Session.set("towCapability", towCap);
    },
    'click .saveRotationEntry' (event) {
        event.preventDefault();

        var canSave = "yes";

        let towCap = $("#towCapability").val();
        let rotType = $("#rotationType").val();
        let rotFreq = $("#rotationFrequency").val();
        let wreckerService = $("#wreckerProvider").val();
        console.log("Wrecker Service is: " + wreckerService);
        let rotPosString = $("#rotationPosition").val();

        let rotPos = parseInt(rotPosString);

        if (towCap == null || towCap == "") {
            showSnackbar("Tow Capability is Required!", "red");
            $("#towCapability").addClass("red");
            canSave = "no";
        }

        if (rotFreq == null || rotFreq == "") {
            showSnackbar("Rotation Frequency is Required!", "red");
            $("#rotationFrequency").addClass("red");
            canSave = "no";
        }

        if (rotType == null || rotType == "") {
            showSnackbar("Rotation Type is Required!", "red");
            $("#rotType").addClass("red");
            canSave = "no";
        }

        if (wreckerService == null || wreckerService == "") {
            showSnackbar("Wrecker Provider is Required!", "red");
            $("#wreckerProvider").addClass("red");
            canSave = "no";
        }

        if (rotPosString == "" || rotPosString == null) {
            showSnackbar("Rotation Position is Required!", "red");
            $("#rotationPosition").addClass("red");
            canSave = "no";
        }

        if (canSave != "no") {
            Meteor.call("rotation.add", rotType, towCap, rotFreq, wreckerService, rotPos, function(err, result) {
                if (err) {
                    console.log("Error adding Wrecker Rotation: " + err);
                    showSnackbar("Error Adding Rotation!", "red");
                    Meteor.call("Log.Errors", "wreckerRotation.js", "click .saveRotationEntry", err);
                } else {
                    showSnackbar("Rotation Added!", "green");
                }
            });
        } else {
            return;
        }
    },
    'click .cancelRotationEntry' (event) {
        event.preventDefault();

    },
});
