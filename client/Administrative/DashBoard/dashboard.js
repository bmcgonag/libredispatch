import { Calls } from '../../../imports/api/calls.js';
import { Units } from '../../../imports/api/units.js';
import { UnitTypes } from '../../../imports/api/unitTypes.js';
import { UnitServiceTracking } from '../../../imports/api/unitServiceTracking.js';
import { CallTypes } from '../../../imports/api/callTypes.js';
import { CallPriorities } from '../../../imports/api/callPriorities.js';
import { Entities } from '../../../imports/api/entities.js';
import { Calls911 } from '../../../imports/api/calls911.js';
import { Addresses } from '../../../imports/api/addresses.js';
import { UserGroups } from '../../../imports/api/userGroups.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';

Template.dashboard.onCreated(function() {
    this.subscribe('activeCalls');
    this.subscribe('activeUnits');
    this.subscribe('activeCallTypes');
    this.subscribe('active911Calls');
    this.subscribe('entityAddressesFull');
    this.subscribe('activeEntities');
    this.subscribe('callPriorities');
    this.subscribe('activeUserGroups');
    this.subscribe('userStatus');
    this.subscribe('errorLogs');
});

Template.dashboard.onRendered(function() {

});

Template.dashboard.helpers({
    activeCFS: function() {
        return Calls.find({ active: true }).count();
    },
    activeCFSUnassigned: function() {
        return Calls.find({ active: true, "units.currentStatus": { $nin: ["AS", "ER", "AR", "AR / TR" ]}}).count();
    },
    activeUnits: function() {
        return Units.find({ active: true, serviceStatus: "InService" }).count();
    },
    activeUnitsAvail: function() {
        return Units.find({ active: true, serviceStatus: "InService", currentStatus: "Available" }).count();
    }
});

Template.dashboard.events({

});