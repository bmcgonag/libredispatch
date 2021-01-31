import { CallTypes } from '../../../imports/api/callTypes.js';
import { CallPriorities } from '../../../imports/api/callPriorities.js';
import { clearForm } from '../adminGeneralFunctions.js';
import { Entities } from '../../../imports/api/entities.js';
import { UnitTypes } from '../../../imports/api/unitTypes.js';
import { MainUnitType } from '../../../imports/api/mainUnitTypes.js';
import { UserGroups } from '../../../imports/api/userGroups.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.callTypeSetup.onRendered(function(){
    setTimeout(function() {
        $('select').formSelect();
    }, 1100);
    if ((Session.get("callTypeSetupMode")) == "edit") {
        Materialize.updateTextFields();
    }
    $('.tooltipped').tooltip();
    $('.modal').modal();
});

Template.callTypeSetup.onCreated(function() {
    this.subscribe('callPriorities');
    this.subscribe('activeCallTypes');
    Session.set("callTypeSetupMode", "add");
    this.subscribe("activeEntities");
    this.subscribe("activeSubTypes");
    this.subscribe("globalUnitTypes");
    Session.set("unitTypesSel", null);
    this.subscribe("activeUserGroups");
    this.subscribe("errorLogs");
    this.subscribe("activeUserSettings");
});

Template.callTypeSetup.helpers({
    activeCallTypes: function() {
        return CallTypes.find({});
    },
    callPriorities: function() {
        setTimeout(function() {
                $('select').formSelect();
                Materialize.updateTextFields();
            }, 1100);
        return CallPriorities.find({});
    },
    modeSet: function() {
        return Session.get("callTypeSetupMode");
    },
    formCallTypes: function() {
        var mode = Session.get("callTypeSetupMode");
        if (mode == "edit") {
            setTimeout(function() {
                $('select').formSelect();
                Materialize.updateTextFields();
            }, 1100);
            return CallTypes.findOne({ _id: Session.get("callTypeId") });
        }
    },
    entityList: function() {
        return Entities.find({});
    },
    unitTypesList: function() {
        return MainUnitType.find({});
    },
    subTypesOptions: function() {
        let unitTypes = Session.get("unitTypesSel");
        if (typeof unitTypes != 'undefined' && unitTypes != null && unitTypes != "") {
            // console.log(unitTypes);
            setTimeout(function() {
                $('select').formSelect();
            }, 150);
            let mysubtypes = UnitTypes.find({ unitType: { $in: unitTypes }});
            // console.log("my subs: ");
            // console.dir(mysubtypes);
            return mysubtypes;
        }
    },
    getUserGroups: function() {
        return UserGroups.find({});
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.callTypeSetup.events({
    'click #addCallType' (event) {
        event.preventDefault();

        let typeName = $("#callTypeName").val();
        let typeDesc = $("#callTypeDescription").val();
        let typePriority = $("#callTypePriorityAssc").val();
        let activeType = $("#activeCallType").prop('checked');
        let allowViewAssocOverride = $("#allowViewAssocOverride").prop('checked');
        let entityCallTypeAssoc = $("#entityCallTypeAssoc").val();
        let unitTypeCallTypeAssoc = $("#unitTypeCallTypeAssoc").val();
        let subtypeCallTypeAssoc = $("#subtypeCallTypeAssoc").val();
        let userGroupCallAssoc = $("#userGroupCallAssoc").val();
        let systemType = $("#systemType").prop('checked');

        if (typeName == '' || typeName == null) {
            showSnackbar("You must enter a Call Type Name!", "red");
            var Name = document.getElementById('callTypeName');
            Name.style.borderColor = "red";
        } else {
            if (typePriority != 'none') {
                var priority = CallPriorities.findOne({ callTypePriority: typePriority });
                var priorityColor = priority.priorityColor;
            } else {
                var priorityColor = "#000000";
            }

            Meteor.call('callTypes.insert', typeName, typeDesc, typePriority, priorityColor, allowViewAssocOverride, entityCallTypeAssoc, unitTypeCallTypeAssoc, subtypeCallTypeAssoc, userGroupCallAssoc, systemType, function(err, result){
                if (err) {
                    showSnackbar("Error Adding Call Type!", "red");
                    console.log("Error adding call type: " + err);
                    Meteor.call('Log.Errors', "callTypeSetup.js", "click #addCallType", err, function(error, results) {
                        if (error) {
                            console.log("Error logging the error from adding a new call type: " + error);
                        }
                    });
                } else {
                    showSnackbar("Call Type Added Successfully!","green");
                    clearForm();
                }
            });
        }
    },
    'click #saveEditCallType' (event) {
        event.preventDefault();

        let typeId = Session.get("callTypeId");
        let typeName = $("#callTypeName").val();
        let typeDesc = $("#callTypeDescription").val();
        let typePriority = $("#callTypePriorityAssc").val();
        let priority = CallPriorities.findOne({ callTypePriority: typePriority });
        let priorityColor = priority.priorityColor;
        let active = $("#activeCallType").prop('checked');
        let allowViewAssocOverride = $("#allowViewAssocOverride").prop('checked');
        let entityCallTypeAssoc = $("#entityCallTypeAssoc").val();
        let unitTypeCallTypeAssoc = $("#unitTypeCallTypeAssoc").val();
        let subtypeCallTypeAssoc = $("#subtypeCallTypeAssoc").val();
        let userGroupCallAssoc = $("#userGroupCallAssoc").val();
        let systemType = $("#systemType").prop('checked');
        // console.log('Active = ' + active);

        console.log("Saving Edit with id: " + typeId);

        if (typeName == '' || typeName == null) {
            showSnackbar("You must enter a Call Type Name!", "red");
            let Name = document.getElementById('callTypeName');
            Name.style.borderColor = "red";
        } else {
            if (typePriority != 'none') {
                priority = CallPriorities.findOne({ callTypePriority: typePriority });
                priorityColor = priority.priorityColor;
            } else {
                priorityColor = "#000000";
            }
            Meteor.call('callTypes.edit', typeId, typeName, typeDesc, typePriority, priorityColor, active, allowViewAssocOverride, entityCallTypeAssoc, unitTypeCallTypeAssoc, subtypeCallTypeAssoc, userGroupCallAssoc, systemType, function(err, result){
                if (err) {
                    showSnackbar("Error Updating Call Type!", "red");
                    console.log("Error updating call type: " + err);
                    Meteor.call('Log.Errors', "callTypeSetup.js", "click #saveEditCallType", err, function(error, results) {
                        if (error) {
                            console.log("Error logging the error from editing a call type: " + error);
                        }
                    });
                } else {
                    showSnackbar("Call Type Added Successfully!","green");
                    clearForm();
                    Session.set("callTypeSetupMode", "add");
                }
            });
        }
    },
    'click #cancelCallType' (event) {
        event.preventDefault();
        clearForm();
    },
    'click .editCallType' (event) {
        event.preventDefault();

        var callTypeId = this._id;
        console.log("Clicked Edit for " + callTypeId);

        Session.set("callTypeId", callTypeId);
        Session.set("callTypeSetupMode", "edit");
    }, 
    'click .deleteCallType' (event) {
        event.preventDefault;

        var callTypeId = this._id;
        // console.log("Clicked Delete for " + callTypeId);
        Session.set("confirmationDialogTitle", "Confirm - Potentially Destructive Action");
        Session.set("confirmationDialogContent", "You are about to delete the selected Call Type from the system.  Note: This WILL NOT remove the call type from any archived calls for service, nor will it automatically update any currently active call for service with this call type.  You will need to manually update any active calls for service with a preferred Call Type if you do not with this type to remain on those calls.  Do you wish to continue?");
        Session.set("eventConfirmCallBackFunction", "deleteThisCallType");
        Session.set("eventConfirmNecessaryId", callTypeId);

        $("#confirmationDialog").modal('open');
    },
    'change #unitTypeCallTypeAssoc' (event) {
        let unitTypeSel = $("#unitTypeCallTypeAssoc").val();
        // console.log("Unit Types Sel: " + unitTypeSel);
        Session.set("unitTypesSel", unitTypeSel);
    },
    'click #copySystemCallTypes' (event) {
        event.preventDefault();
        let myId = Meteor.userId();
        if (Roles.userIsInRole(myId, ['GlobalAdmin'])) {
            showSnackbar("You Appear to be a Global Admin. This function is not for Global Entity Use.", "orange");
            return;
        } else {
            let i=0;
            Meteor.call("copy.callTypes", i);
        }
    },
    'mouseover .infoRow' (event) {
        let myRow = document.getElementById(this._id);
        let settings = UserSettings.findOne({});
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

deleteThisCallType = function(callTypeId) {
    Meteor.call('callTypes.delete', callTypeId, function(err, result){
        if (err) {
            showSnackbar("Error Deleting Call Type!", "red");
            console.log("Error Deleting Call Type: " + err);
            Meteor.call('Log.Errors', "callTypeSetup.js", "deleteThisCallType function", err, function(error, results) {
                if (error) {
                    console.log("Error logging the error from deleting a call type: " + error);
                }
            });
        } else {
            showSnackbar("Call Type Deleted!", "green");
        }
    });
}