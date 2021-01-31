import { Units } from '../../../../../imports/api/units.js';
import { Calls } from '../../../../../imports/api/calls.js';
import { UserSettings } from '../../../../../imports/api/userSettings.js';

Template.responseTable.onCreated(function() {
    this.subscribe("activeUnits");
    this.subscribe('activeCalls');
    this.subscribe('activeUserSettings');
});

Template.responseTable.onRendered(function() {

});

Template.responseTable.helpers({
    unitsOnCall: function() {
        let myCall = Session.get("myCallId");
        let callInfo = Calls.find({ _id: myCall });
        return callInfo;
    },
    assignTime: function() {
        if (typeof this.assignedOn == 'undefined' || this.assignedOn == null || this.assignedOn == "") {
            // console.log("no assigned time found. Weird - shouldn't be able to happen.");
            return "";
        } else {
            let assigned = moment(this.assignedOn).format("hh:mm");
            return assigned;
        } 
    },
    enrouteTime: function() {
        if (typeof this.enrouteOn == 'undefined' || this.enrouteOn == null || this.enrouteOn == "") {
            // console.log("no enrounte time yet");
            return "";
        } else {
            let enrouted = moment(this.enrouteOn).format("hh:mm");
            return enrouted;
        }
    },
    arriveTime: function() {
        if (typeof this.arrivedOn == 'undefined' || this.arrivedOn == null || this.arrivedOn == "") {
            // console.log("No arrived time yet.");
            return "";
        } else {
            let arrived = moment(this.arrivedOn).format("hh:mm");
            return arrived;
        }
    },
    isClear: function() {
        let clearNow;
        if (typeof this.clearedOn == 'undefined' && typeof this.deAssignedOn == 'undefined') {
            clearNow = false;
        } else {
            clearNow = true;
        }
        return clearNow;
    },
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.responseTable.events({
    'mouseover .infoRow' (event) {
        // console.log("assign this._id: " + this.unitId);
        let myRow = document.getElementById(this.unitId);
        // console.dir(myRow);
        let settings = UserSettings.findOne({});
        if (settings) {
            myRow.style.background = settings.themeHighlight;
            myRow.style.color = settings.themeHighlightText;
        }
    },
    'mouseout .infoRow' (event) {
        let myRow = document.getElementById(this.unitId);
        myRow.style.background = "";
        myRow.style.color = "";
    },
});

Template.notesAssigned.onCreated(function() {
    this.subscribe("activeUnits");
    this.subscribe('activeCalls');
    this.subscribe('activeUserSettings');
});

Template.notesAssigned.onRendered(function() {

});

Template.notesAssigned.helpers({
    notesOnCall: function() {
        let myCall = Session.get("myCallId");
        let callInfo = Calls.find({ _id: myCall });
        return callInfo;
    },
    updatedTime: function() {
        let thisTime = moment(this.updatedOn).format("hh:mm:ss");
        return thisTime;
    },
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.notesAssigned.events({
    'mouseover .infoRow' (event) {
        // console.log("this._id: " + this.addedOn);
        let myRow = document.getElementById(this.addedOn);
        // console.dir(myRow);
        let settings = UserSettings.findOne({});
        if (settings) {
            myRow.style.background = settings.themeHighlight;
            myRow.style.color = settings.themeHighlightText;
        }
    },
    'mouseout .infoRow' (event) {
        let myRow = document.getElementById(this.addedOn);
        myRow.style.background = "";
        myRow.style.color = "";
    },
});