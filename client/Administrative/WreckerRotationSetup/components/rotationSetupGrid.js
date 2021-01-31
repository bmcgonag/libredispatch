import { WreckerRotation } from '../../../../imports/api/wreckerRotation.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';

Template.rotationSetupGrid.onCreated(function() {
    this.subscribe('activeWreckerRotation');
    this.subscribe('activeUserSettings');
});

Template.rotationSetupGrid.onRendered(function() {
    Session.set("rotationType", "");
    Session.set("towCapability", "");
    Session.set("rotationFrequency", "");
});

Template.rotationSetupGrid.helpers({
    rotations: function() {
        let rotType = Session.get("rotationType");
        let towCap = Session.get("towCapability");
        let rotFreq = Session.get("rotationFrequency");

        return WreckerRotation.find({ rotationType: rotType, towCapability: towCap, rotationFrequency: rotFreq }, { sort: { rotationPosition: 1 }});
    },
    maxRotationPosition: function() {
        let maxrot = WreckerRotation.findOne({}, { sort: { rotationPosition: -1 }});
        // console.log("max rot pos: " + maxrot.rotationPosition);
        // console.log("max rot length: " + maxrot.length);
        return maxrot.rotationPosition;
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.rotationSetupGrid.events({
    'click .moveUp' (event) {
        event.preventDefault();

        let rotationId = this._id;
        // console.log("Rotation Id: " + rotationId);

        let newRotationObj = [];

        // get the rotation info associated with this _id
        let Rotation = WreckerRotation.findOne({ _id: rotationId });

        let rotPosition = Rotation.rotationPosition;

        let rotType = Rotation.rotationType;
        let rotFreq = Rotation.rotationFrequency;
        let towCap = Rotation.towCapability;

        // get the rotation info from the rotation of the same type,
        // frequency, and capability just prior to this one clicked
        if (rotPosition != "1") {
            // as long as the rotatiaon position is higher than 1 we just subtract 1 (easy)
            var otherRotPos = parseInt(rotPosition) - 1;
            var otherRot = WreckerRotation.findOne({ rotationPosition: otherRotPos, rotationType: rotType, rotationFrequency: rotFreq, towCapability: towCap });
        } else {
            showSnackbar("Rotation Position 1 Can't be Moved Up.", "red");
            return;
        }

        let otherRotId = otherRot._id;

        // console.log("-------- Current Rotation Position: --------");
        // console.log(rotationId + ": " + rotPosition);
        // console.log(otherRotId + ": " + otherRotPos);

        // Adjust the rotation position of the wrecker clicked.
        let newRotPos = rotPosition - 1;
        let newOtherRotPos = otherRotPos + 1;

        // console.log("-------- New Rotation Obj: --------");
        // console.log(rotationId + ": " + newRotPos);
        // console.log(otherRotId + ": " + newOtherRotPos);
        newRotationObj.push({ [rotationId]: newRotPos});
        newRotationObj.push({ [otherRotId]: newOtherRotPos});
        // console.log(newRotationObj);

        // now call the method and move the positions in the db
        Meteor.call("Wrecker.movePosInRot", newRotationObj, function(err, result) {
            if (err) {
                console.log("Error moving wrecker positions: " + err);
                showSnackbar("Error Moving Wrecker Position.", "red");
                Meteor.call("Log.Errors", "rotationSetupGrid.js", "Method Call Wrecker.movePosInRot", err);
            } else {
                showSnackbar("Wrecker Position Moved Successfully!", "green");
            }
        });
    },
    'click .moveDown' (event) {
        event.preventDefault();

        let rotationId = this._id;
        // console.log("Rotation Id: " + rotationId);

        let newRotationObj = [];

        let Rotation = WreckerRotation.findOne({ _id: rotationId });

        let rotPosition = Rotation.rotationPosition;

        let rotType = Rotation.rotationType;
        let rotFreq = Rotation.rotationFrequency;
        let towCap = Rotation.towCapability;

        var otherRotPos = parseInt(rotPosition) + 1;
        var otherRot = WreckerRotation.findOne({ rotationPosition: otherRotPos, rotationType: rotType, rotationFrequency: rotFreq, towCapability: towCap });

        let otherRotId = otherRot._id;

        // console.log("-------- Current Rotation Position: --------");
        // console.log(rotationId + ": " + rotPosition);
        // console.log(otherRotId + ": " + otherRotPos);

        // Adjust the rotation position of the wrecker clicked.
        let newRotPos = rotPosition + 1;
        let newOtherRotPos = otherRotPos - 1;

        // console.log("-------- New Rotation Obj: --------");
        // console.log(rotationId + ": " + newRotPos);
        // console.log(otherRotId + ": " + newOtherRotPos);
        newRotationObj.push({ [rotationId]: newRotPos});
        newRotationObj.push({ [otherRotId]: newOtherRotPos});
        // console.log(newRotationObj);

        // now call the method and move the positions in the db
        Meteor.call("Wrecker.movePosInRot", newRotationObj, function(err, result) {
            if (err) {
                console.log("Error moving wrecker positions: " + err);
                showSnackbar("Error Moving Wrecker Position.", "red");
                Meteor.call("Log.Errors", "rotationSetupGrid.js", "Method Call Wrecker.movePosInRot", err);
            } else {
                showSnackbar("Wrecker Position Moved Successfully!", "green");
            }
        });
    },
    'click .deleteFromRotation' (event) {
        event.preventDefault();

        let rotationId = this._id;

        Meteor.call("wrecker.removeFromRotation", rotationId, function(err, result) {
            if (err) {
                console.log("Error removing wrecker from rotation: " + err);
                showSnackbar("Error Removing Wrecker", "red");
                Meteor.call("Log.Errors", "rotationSetupGrid.js", "Method Call wrecker.removeFromRotation", err);
            } else {
                showSnackbar("Wrecker Removed Successfully!", "green");
            }
        });
    },
    'mouseover .infoRow' (event) {
        let myRow = document.getElementById(this._id);
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            myRow.style.background = settings.themeHighlight;
            myRow.style.color = settings.themeHighlightText;
        }
    },
    'mouseout .infoRow' (event) {
        let myRow = document.getElementById(this._id);
        myRow.style.background = "";
        myRow.style.color = "";
    },
});
