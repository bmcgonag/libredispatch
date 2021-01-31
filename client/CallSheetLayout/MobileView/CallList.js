import { Calls } from '../../../imports/api/calls.js';
import { Meteor } from 'meteor/meteor';
import { UnitServiceTracking } from '../../../imports/api/unitServiceTracking.js';
import { Units } from '../../../imports/api/units.js';
import { UserGroups } from '../../../imports/api/userGroups.js';

Template.CallList.onCreated(function() {
    this.subscribe("activeCalls");
    this.subscribe("currentUnitTracking");
    this.subscribe("activeUserGroups");
});

Template.CallList.helpers({
    getActiveCalls: function() {
        let myEntity = Session.get("myEntity");
        let myUnitId = "";
        let myUnitType = "";
        let myUnitSubType = "";

        let callSet = Calls.find({}).fetch();
        // console.dir(callSet);
        let callCount = callSet.length;
        // console.log("Call Count = " + callCount);
        let i=0;

        // let's get the users mobile unit type
        let myId = Meteor.userId();
        let unitServiceInfo = UnitServiceTracking.findOne({ userId: myId, current: true });
        if (unitServiceInfo) {
            myUnitId = unitServiceInfo.unitId;
            let unitInfo = Units.findOne({ _id: myUnitId });
            if (unitInfo) {
                myUnitType = unitInfo.type;
                myUnitSubType = unitInfo.subType;
            }
        }

        // now let's get the user groups for this user
        let groupInfo = UserGroups.find({ usersInGroup: myId }).fetch();
        let myGroups = [];

        if (typeof groupInfo != "undefined" && groupInfo != null && groupInfo != "") {
            let groupCount = groupInfo.length;
            for (i = 0; i < groupCount; i++) {
                myGroups.push(groupInfo[i].groupName);        
            }
        }

        getNextPoint = function() {
            if (i < callCount) {
                // console.log("Inside get next point function on mobile.");
                // console.log("i is: " + i);
                // console.log("Latitude" + [i] + ": " + callSet[i].latitude);
                waitOn(callSet[i].latitude, callSet[i].longitude, callSet[i].priorityColor, callSet[i].priority, callSet[i].type, callSet[i].callNo);
                i = i + 1;
                Meteor.setTimeout(function() {
                    getNextPoint();
                }, 700);
            }
        }
        getNextPoint();

        //    ****  The line below will pull all calls for a mobile user given that his / her parent entity is the same as that of the user who created the call.
        // return Calls.find({});
        //    ****  The line below will change the calls pulled for view by a mobile user to be only the calls created specifically for his / her entity
        // return Calls.find({ callUserEntity: myEntity });
        //    ****  The line below pulls calls based on the call type assocation rules setup for the call type in the parent entity.
        return Calls.find({ $and: [{ $or: [{ "associations.entityAssoc": myEntity }, { "associations.entityAssoc": [] }]}, { $or:[{ "associations.unitAssoc": myUnitType }, { "associations.unitAssoc": [] }]}, { $or: [{ "associations.subTypeAssoc": myUnitSubType }, { "associations.subTypeAssoc": [] }]}, { $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}]});
    },
});

Template.CallList.events({

});

Template.CallListHorizontal.helpers({
    getActiveCalls: function() {
        let myEntity = Session.get("myEntity");

        let callSet = Calls.find({}).fetch();
        // console.dir(callSet);
        let callCount = callSet.length;
        // console.log("Call Count = " + callCount);
        let i=0;

        getNextPoint = function() {
            if (i < callCount) {
                // console.log("Inside get next point function on mobile.");
                // console.log("i is: " + i);
                // console.log("Latitude" + [i] + ": " + callSet[i].latitude);
                waitOn(callSet[i].latitude, callSet[i].longitude, callSet[i].priorityColor, callSet[i].priority, callSet[i].type, callSet[i].callNo);
                i = i + 1;
                Meteor.setTimeout(function() {
                    getNextPoint();
                }, 700);
            }
        }
        getNextPoint();
        return Calls.find({ callUserEntity: myEntity });
    },
});
