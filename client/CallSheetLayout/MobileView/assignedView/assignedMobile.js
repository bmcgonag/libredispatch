import { Units } from '../../../../imports/api/units.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Entities } from '../../../../imports/api/entities.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { UnitServiceTracking } from '../../../../imports/api/unitServiceTracking.js';

Template.assignedMobile.onCreated(function() {
    this.subscribe('errorLogs');
    this.subscribe('activeUnits');
    this.subscribe('activeCalls');
    this.subscribe('activeEntities');
    this.subscribe('currentUnitTracking');
});

Template.assignedMobile.onRendered(function() {
    $('ul.tabs').tabs();
    $('.modal').modal();
});

Template.assignedMobile.helpers({
    assignedCall: function() {
        let myId = Meteor.userId();
        if (myId) {
            let myUnit = UnitServiceTracking.findOne({ userId: myId });
            let unitId = myUnit.unitId;
            let unitInfo = Units.findOne({ _id: unitId });
            let callInfo = Calls.findOne({ "units.unitId": unitId });
            Session.set("myCallId", callInfo._id);
            return callInfo;
        }
    },
});

Template.assignedMobile.events({

});