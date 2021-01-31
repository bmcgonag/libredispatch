import { TenantSetup } from '../../../imports/api/tenantSetup.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';

Template.tenantSetup.onCreated(function() {
    this.subscribe("entityTenantSetup");
    this.subscribe("errorLogs");
});

Template.tenantSetup.onRendered(function() {
    $('select').formSelect();
});

Template.tenantSetup.helpers({
    tenantExists: function() {
        let myEntity = Session.get("myEntity");
        let myParentEntity = Session.get("myParentEntity");

        let tenant = TenantSetup.findOne({ userEntity: myEntity, parentEntity: myParentEntity });
        if (tenant) {
            // console.log("True Tenant");
            // console.dir(tenant);
            let settingId = tenant._id;
            Session.set("settingId", settingId);
            return true;
        } else {
            // console.log("False Tenant");
            return false;
        }
    },
    tenantInfo: function() {
        let myEntity = Session.get("myEntity");
        let myParentEntity = Session.get("myParentEntity");

        let tenInfo = TenantSetup.findOne({ userEntity: myEntity, parentEntity: myParentEntity });
        if (tenInfo) {
            Session.set("settingId", tenInfo._id);
            // console.log("User Entity: " + myEntity);
            return tenInfo;
        } else {
            return;
        }
    },
});

Template.tenantSetup.events({
    'click #saveTenantSettings' (event) {
        event.preventDefault();
        let navColor = $("#navBarColor").val();
        let ISMile = $("#requireInServiceMileage").prop('checked');
        let TransMile = $("#requireTransportMileage").prop('checked');
        let alwaysRunNo = $("#createRunNumberForAllCalls").prop('checked');
        let assignSelf = $("#canAssignSelf").prop('checked');
        let deAssignSelf = $("#canDeassignSelf").prop('checked');
        let isSystem = $("#systemTenantSetup").prop('checked');

        Meteor.call('set.tenantSettings', navColor, ISMile, TransMile, alwaysRunNo, assignSelf, deAssignSelf, isSystem, function(err, result) {
            if (err) {
                console.log("Error setting Nav Color: " + err);
                showSnackbar("Error Setting Nav Color!", "red");
                Meteor.call("Log.Errors", "tenantSetup.js", "click #saveTenantSetup", err, function(error, results) {
                    if (error) {
                        console.log("Error logging the error created when saving a new teanat setup: " + error);
                    }
                });
            } else {
                showSnackbar("Tenant Settings Saved Successfully!", "green");
            }
        });
    },
    'click #updateTenantSettings' (event) {
        event.preventDefault();
        let navColor = $("#navBarColor").val();
        let settingId = Session.get("settingId");
        let ISMile = $("#requireInServiceMileage").prop('checked');
        let TransMile = $("#requireTransportMileage").prop('checked');
        let alwaysRunNo = $("#createRunNumberForAllCalls").prop('checked');
        let assignSelf = $("#canAssignSelf").prop('checked');
        let deAssignSelf = $("#canDeassignSelf").prop('checked');
        let isSystem = $("#systemTenantSetup").prop('checked');

        Meteor.call('change.tenantSettings', settingId, navColor, ISMile, TransMile, alwaysRunNo, assignSelf, deAssignSelf, isSystem, function(err, result) {
            if (err) {
                console.log("Error setting Nav Color: " + err);
                showSnackbar("Error Setting Nav Color!", "red");
                Meteor.call("Log.Errors", "tenantSetup.js", "click #updateTenantSetup", err, function(error, results) {
                    if (error) {
                        console.log("Error logging the error created when updating a teanat setup: " + error);
                    }
                });
            } else {
                showSnackbar("Tenant Settings Updated Successfully!", "green");
            }
        });
    },
    'click #copySystemSetup' (event) {
        event.preventDefault();
        let myId = Meteor.userId();
        if (Roles.userIsInRole(myId, ['GlobalAdmin'])) {
            showSnackbar("You Appear to be a Global Admin. This function is not for Global Entity Use.", "orange");
            return;
        } else {
            let i = 0;
            Meteor.call("copy.tenantSettings", i);
        }
    },
});