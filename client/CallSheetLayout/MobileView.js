import { UserSettings } from '../../imports/api/userSettings.js';
import { ErrorLogs } from '../../imports/api/errorLogs.js';
import { UnitServiceTracking } from '../../imports/api/unitServiceTracking.js';
import { UnitGeoPos } from '../../imports/api/unitGeoPosition.js';

Template.CallSheetMain.onCreated(function() {
    this.subscribe('errorLogs');
    this.subscribe('activeUserSettings');
    Session.set("gridContext", "calls");
    this.subscribe('currentUnitTracking');
    this.subscribe('unitGeoPosInfo');
});

Template.CallSheetMain.onRendered(function() {
    // get my unit info, then pull my associated unit id, and the quick call no if
    // I'm assigned to a call, then set them as session variables.
    
});

Template.CallSheetMain.helpers({
    mySettings: function() {
        return UserSettings.findOne();
    },
    mobileView: function() {
        return Session.get("mobileContext");
    },
    mobileGridView: function() {
        return Session.get("gridContext");
    },
    mobileCoords: function() {
        let myId = Meteor.userId();
        let unitTrackingInfo = UnitServiceTracking.findOne({ userId: myId });
        if (unitTrackingInfo) {
            let callSign = unitTrackingInfo.callSign;
            Session.set("userCallSign", callSign);
            Session.set("userUnitId", unitTrackingInfo.unitId);
        }
        if (navigator.geolocation) {
            let loc = navigator.geolocation.watchPosition(showPosition, geo_error, geo_options);
            var geo_options = {
                enableHighAccuracy: true,
            };
            return loc;
        } else {
            return "No Coords";
        }
    }
});

Template.CallSheetMain.events({

});

function showPosition(position) {
    // console.log("Position: " + position.coords.latitude + ", " + position.coords.longitude);
    // console.log("Speed: " + position.coords.speed + ", and Heading: " + position.coords.heading);
    console.log("Position Info: ");
    console.dir(position.coords);
    let myUnit = { lat: position.coords.latitude, lon: position.coords.longitude, unitSpeed: position.coords.speed, unitHeading: position.coords.heading };
    Session.set("myUnitCoords", myUnit);
    let callSign = Session.get("userCallSign");
    let unitId = Session.get("userUnitId");
    if (myUnit.unitHeading == null) {
        myUnit.unitHeading = 0;
    }

    if (myUnit.unitSpeed == null) {
        myUnit.unitSpeed = 0;
    }

    Meteor.call("add.unitGeoPosition", unitId, callSign, myUnit.lat, myUnit.lon, myUnit.unitSpeed, myUnit.unitHeading, function(err, result) {
        if (err) {
            console.log("Error adding unit geo-location information to the collection.");
        }
    });

    return position.coords.latitude + ", " + position.coords.longitude;
}

function geo_error() {
    console.log("Sorry, no position available.");
}
