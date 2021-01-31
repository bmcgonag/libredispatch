import { CallTypes } from '../../../../imports/api/callTypes.js';
import { CallPriority } from '../../../../imports/api/callPriorities.js';
import { Calls } from '../../../../imports/api/calls.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';
import { TenantSetup } from '../../../../imports/api/tenantSetup.js';
import { Units } from '../../../../imports/api/units.js';
import { UnitServiceTracking } from '../../../../imports/api/unitServiceTracking.js';

Template.callCard.onCreated(function() {
    this.subscribe('activeCallTypes');
    this.subscribe('callPriorities');
    this.subscribe('activeCalls');
    this.subscribe('activeUserSettings');
    this.subscribe('entityTenantSetup');
    this.subscribe('activeUnits');
    this.subscribe('currentUnitTracking');
    Session.set("alertCount", 0);

});

Template.callCard.onRendered(function() {
    $('ul.tabs').tabs();
    $('.collapsible').collapsible();
});

Template.callCard.helpers({
    tabSet: function() {
        let myCardSettings = UserSettings.findOne({});

        // *****************************************************
        // we setup the users chosen tab order on the call card.
        // *****************************************************

        let tab1 = "";
        let tab2 = "";
        let tab3 = "";
        let label1 = "";
        let label2 = "";
        let label3 = "";

        switch (myCardSettings.mobileTabOrder) {
            case "Response, Notes, Alerts":
                tab1 = "response";
                tab2 = "notes";
                tab3 = "alerts";
                label1 = "Response";
                label2 = "Notes";
                label3 = "Alerts";
                break;
            case "Response, Alerts, Notes":
                tab1 = "response";
                tab2 = "alerts";
                tab3 = "notes";
                label1 = "Response";
                label2 = "Alerts";
                label3 = "Notes";
                break;
            case "Notes, Alerts, Response":
                tab1 = "notes";
                tab2 = "alerts";
                tab3 = "response";
                label1 = "Notes";
                label2 = "Alerts";
                label3 = "Response";
                break;
            case "Notes, Response, Alerts":
                tab1 = "notes";
                tab2 = "response";
                tab3 = "alerts";
                label1 = "Notes";
                label2 = "Response";
                label3 = "Alerts";
                break;
            case "Alerts, Response, Notes":
                tab1 = "alerts";
                tab2 = "response";
                tab3 = "notes";
                label1 = "Alerts";
                label2 = "Response";
                label3 = "Notes";
                break;
            case "Alerts, Notes, Response":
                tab1 = "alerts";
                tab2 = "notes";
                tab3 = "response";
                label1 = "Alerts";
                label2 = "Notes";
                label3 = "Response";
                break;
            default:
                tab1 = "response";
                tab2 = "notes";
                tab3 = "alerts";
                label1 = "Response";
                label2 = "Notes";
                label3 = "Alerts";
                break;
        }

        let finalTaborder = {tab1, tab2, tab3, label1, label2, label3};
        return finalTaborder;
    },
    cardSettings: function() {
        return UserSettings.findOne({});
    },
});

Template.callCardHeader.helpers({
    sentToDis: function() {
        let call = Calls.findOne({ _id: this._id });
        return moment(call.sentToDispatchAt).format("MM/DD/YYYY hh:mm:ss");
    },
    priorityColor: function() {
        let call = Calls.findOne({ _id: this._id });
        let priorityColor = call.priorityColor;
        Session.set("callPriority", call.priority);
        return priorityColor;
    },
    callPriority: function() {
        return Session.get("callPriority");
    },
    cardHeaderSettings: function() {
        return UserSettings.findOne({});
    },
});

Template.callCardBody.helpers({
    sentToDis: function() {
        let call = Calls.findOne({ _id: this._id });
        return moment(call.sentToDispatchAt).format("MM/DD/YYYY hh:mm:ss");
    },
    priorityColor: function() {
        let call = Calls.findOne({ _id: this._id });
        let priorityColor = call.priorityColor;
        Session.set("callPriority", call.priority);
        return priorityColor;
    },
    callPriority: function() {
        return Session.get("callPriority");
    },
    cardBodySettings: function() {
        return UserSettings.findOne();
    },
    tenantSettings: function() {
        let tenantInfo = TenantSetup.findOne({});
        if (tenantInfo) {
            return tenantInfo;
        } else {
            showSnackbar("Your Entity / Agency has not setup Tenant Settings, but needs to do so!", "red");
            Meteor.call("Log.Errors", "callCard.js", "tenantSettings helper method", "User is trying to function in Mobile view, but their agency has not yet setup the necessary tenant settings.", function(err, result) {
                if (err) {
                    console.log("Error trying to write a userful error to the error logs table: " + err);
                }
            });
            return;
        }
    },
    unitStatus: function() {
        let unitId = Session.get("myAssignedUnit");
        if (unitId == "None") {
            // console.log("returning None for status.");
            return "None";
        } else {
            let unitInfo = Units.findOne({ _id: unitId });
            if (unitInfo) {
                // console.log("returning actual unit status of " + unitInfo.currentStatus);
                return unitInfo.currentStatus;
            } else {
                return "None";
            }
        }
    },
    myServStatus: function() {
        let myId = Meteor.userId();
        // console.log('My Id: ' + myId);
        let myCurrServStatus = UnitServiceTracking.findOne({ userId: myId, current: true });
        if (myCurrServStatus) {
            if (myCurrServStatus.userCurrStatus == "OutService") {
                // console.log('---- should show in service - first if ----');
                return "goInService";
            } else {
                // console.log('---- should show out of service ----');
                return "goOutService";
            }
        } else {
            // console.log('---- should show in service ----');
            return "goInService";
        }
    }
});

Template.callCardResponseTab.helpers({
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
});

Template.callCardNotesTab.helpers({
    updatedTime: function() {
        let thisTime = moment(this.updatedOn).format("hh:mm:ss");
        return thisTime;
    },
});

Template.callCard.events({
    
});

Template.callCardBody.events({
    'click .assignMe' (event) {
        event.preventDefault();

        let myId = Meteor.userId();
        let myUnit = UnitServiceTracking.findOne({ userId: myId });
        let unitId = myUnit.unitId;
        let callSign = myUnit.callSign;
        let callId = this._id;

        let callInfo = Calls.findOne({ _id: callId });
        let unitInfo = Units.findOne({ _id: unitId });

        let qcNo = callInfo.quickCallNo;

        // console.log("call id for self-assign is: " + callId);

        assignUnit(qcNo, callSign, unitInfo, callInfo);
    }
});
