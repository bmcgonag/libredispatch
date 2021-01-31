import { CallTypes } from '../../../../imports/api/callTypes.js';
import { Entities } from '../../../../imports/api/entities.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';

Template.callSheetModalSmall.onCreated(function(){
    this.subscribe('activeCallTypes');
    this.subscribe('activeEntities');
    this.subscribe('errorLogs');
    this.subscribe("activeUserSettings");
});

Template.callSheetModalSmall.onRendered(function() {
    setTimeout(function() {
        $('select').formSelect();
        Materialize.updateTextFields();
    }, 350);
});

Template.callSheetSmallHeader.onRendered(function() {
    if (Session.get("mode") == "NewCall") {
        Session.set("canSend", "disabled");
        Session.set("typeSel", false);
    } else {
        Session.set("canSend", "enabled");
        Session.set("typeSel", true);
    }
    $("#callLocation").focus();
});

Template.callSheetSmallHeader.helpers({
    userPrefs: function() {
        return UserSettings.findOne({});
    }
});

Template.callSheetSmallBody.helpers({
    canSendModal: function () {
        var callLocSet = Session.get("locReq");
        var callTypeSet = Session.get("typeSel");
        // console.log("CS locReq = " + callLocSet + " and TypeSet = " + callTypeSet);
        if (callLocSet == true && callTypeSet == true) {
            Session.set("canSend", "enabled");
        } else {
            Session.set("canSend", "disabled");
        }
        return Session.get("canSend");
    },
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.callSheetModalSmall.helpers({
    userPrefs: function() {
        return UserSettings.findOne({});
    }
});

Template.callSheetModalSmall.events({
    'change #callType' (event) {
        // This function acts on the call type field in the form.
        // it's here, because putting it in callType.js wasn't
        // triggering the change event.
        var selCallType = $("#callType").val();

        if (selCallType == '' || selCallType == null) {
            $("#callLocation").addClass('reqField');
            Session.set("typeSel", false);
            Session.set("callTypeSet", false);
        } else {
            $("#callLocation").removeClass('reqField');
            var priorityOption = CallTypes.findOne({ callTypeName: selCallType, active: true, deleted: false });
            var priOfSelType = priorityOption.callTypePriority;
            // console.log("Priority based on type selected: " + priOfSelType);
            Session.set("priOfSelType", priOfSelType);
            Session.set("typeSel", true);
            Session.set("callTypeSet", true);
            // console.log("Call Type set = true");
        }
    },
    'click .myCSModalClose' (event) {
        Session.set("mode", "NewCall");
        let myCSModal = document.getElementById('callSheetModalSmall');
        myCSModal.style.display = "none";
    },
});

Template.callSheetSmallHeader.events({
    
});

Template.callSheetSmallBody.onRendered(function() {
    var noteArr = [];
    var notes = {};
    Session.set("notes", notes);
    Session.set("noteArr", noteArr);
    Session.set("noteTextEntered", false);
    $('.tabs').tabs();
});

Template.callSheetSmallBody.helpers({
    canAddNotes: function() {
        return Session.get("noteTextEntered");
    },
    unsavedNote: function() {
        return Session.get("noteArr");
    },
});

Template.registerHelper('formatNoteDate', function(updatedOn) {
    return moment(updatedOn).format('MM/DD/YYYY hh:mm:ss');
});

Template.callSheetSmallBody.events({
    'click .saveCall' (event) {
        event.preventDefault();
        // console.log("Save clicked!");

        let now = new Date();

        let callLocation = $("#callLocation").val();
        let callType = $("#callType").val();
        let callPriority = $("#callPriority").val();
        let callNo = moment(now).format("YYMMDD-hhmmss");
        Session.set("callStatus", callNo);
        let callers = [];
        let notes = [];
        let subjects = [];
        let vehicles = [];
        let callStartedAt = now;
        let user = Meteor.userId();
        let associations = {};

        let call911Id = Session.get("from911Id");

        // let's get any call type associations for filtering from the 
        // call type collection

        let callTypeInfo = CallTypes.findOne({ callTypeName: callType });

        if (callTypeInfo) {
            associations = {
                allowOverride: callTypeInfo.allowViewAssocOverride,
                entityAssoc: callTypeInfo.entityCallTypeAssoc,
                subTypeAssoc: callTypeInfo.subtypeCallTypeAssoc,
                unitAssoc: callTypeInfo.unitTypeCallTypeAssoc,
                userGroupAssoc: callTypeInfo.userGroupCallAssoc
            }
        }

        // idnetify the users agency / entity directly over him / her.
        // the "Parent Entity" should always be the CAD center for the user.
        let usersEntity = Meteor.users.findOne().profile.usersEntity;

        // console.log("User Entity: " + usersEntity);
        let parentEntity = Entities.findOne({ entityName: usersEntity }).entityParent;
        // console.dir(parentEntity);

        if (parentEntity == "parent") {
            parentEntity = usersEntity;
        }

        let mode = Session.get("mode");


        if (callLocation == '' || callLocation == null || callType == "" || callType == null) {
            showSnackbar("Call Location and Type are Required!", "red");
            //// console.log("call must have location and type set.");
        } else {
            if (mode == "NewCall" || mode == "from911") {
                Meteor.call("call.create", callLocation, callNo, callType, callPriority, callers, notes, associations, subjects, vehicles, callStartedAt, usersEntity, parentEntity, function(err, result){
                    if (err) {
                        showSnackbar("Error Adding New Call!", "red");
                        // console.log("Error adding call: " + err);
                    } else {
                        if (mode == "from911") {
                            Meteor.call('cfsFrom911Call.at', call911Id, callNo, function(err, result) {
                                if (err) {
                                    console.log("error associating 911 call to the cfs: " + err);
                                    Meteor.call('Log.Errors', "callSheetModalSmall.js", ".saveCall click event", err, function(error, results) {
                                        if (error) {
                                            console.log("Error writing logs tot he database: " + error);
                                        }
                                    });
                                }
                            });
                        }
                        Session.set("callType", callType);
                        Meteor.call('getXYCallLocationInfo', callLocation, function(err, resultLoc) {
                            if (err) {
                                console.log("Error get lat and lon. " + err);
                            } else {
                                // console.log("location result: " + resultLoc);
                                Session.set("from911", false);
                                Session.set("mapPointLat", resultLoc.latitude);
                                Session.set("mapPointLon", resultLoc.longitude);
                                Meteor.call('call.addLatLong', result, resultLoc.latitude, resultLoc.longitude, function(err, resultCallLoc) {
                                    if (err) {
                                        console.log("Error adding lat, long to call: " + err);
                                    } else {
                                        // console.log("Added lat and long to call successfully.");
                                    }
                                });
                            }
                        });
                        // console.log("call added. " + result);
                        showSnackbar("New Call Successfully Added!", "green");
                        Session.set("callIdCreated", result);
                        Session.set("mode", "ViewCallDetail");
                        let noteArr = Session.get("noteArr");
                        if (noteArr) {
                            // console.log("Notes exist - add to call");
                            Meteor.call("call.addNotes", result, noteArr, function(err, resultNote) {
                                if (err) {
                                    // console.log("Error adding notes from Create Call: " + err);
                                }
                            });
                        }
                    }
                });
            } else if (mode == "ViewCallDetail") {
                let callId = Session.get("callIdCreated");
                Meteor.call("call.update", callId, callLocation, callNo, callType, callPriority, callers, notes, associations, subjects, vehicles, usersEntity, parentEntity, function(err, result){
                    if (err) {
                        showSnackbar("Error Updating Call!", "red");
                        console.log("Error updating call: " + err);
                        Meteor.call("Log.Errors", "callsheetModalSmall.js", "call.update in click .saveCall", err);
                    } else {
                        // console.log("call added. " + result);
                        showSnackbar("Call Updated Successfully!", "green");
                        Meteor.call('getXYCallLocationInfo', callLocation, function(err, resultLoc) {
                            if (err) {
                                console.log("Error get lat and lon. " + err);
                            } else {
                                console.log("location result: " + resultLoc);
                                Session.set("mapPointLat", resultLoc.latitude);
                                Session.set("mapPointLon", resultLoc.longitude);
                                Meteor.call('call.addLatLong', result, resultLoc.latitude, resultLoc.longitude, function(err, resultCallLoc) {
                                    if (err) {
                                        console.log("Error adding lat, long to call: " + err);
                                    } else {
                                        console.log("Added lat and long to call successfully.");
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    },
    'click .addNote' (event) {
        event.preventDefault();

        // console.log("add note clicked for id: ");
        addNote();
    },
    'keyup #callNotesEntry' (event) {
        event.preventDefault();

        let note = $('#callNotesEntry').val();

        if (note == '' || note == null) {
            Session.set("noteTextEntered", false);
        } else {
            Session.set("noteTextEntered", true);
            if (event.which == 13 || event.keyCode == 13) {
                addNote();
            }
        }
    },
});

function addNote() {
    let noteText = $("#callNotesEntry").val();
    let callId = Session.get("callIdCreated");
    let mode = Session.get("mode");

    if (mode == "ViewCallDetail") {
        let callNum = Session.get("viewDetailFor");
        Meteor.call("call.updateNote", callId, noteText, function(err, result) {
            if (err) {
                showSnackbar("Error adding notes.", "red");
                // console.log("Error adding notes: " + err);
            } else {
                showSnackbar("Note Added Successfully!", "green");
                $("#callNotesEntry").val('');
                $("#callNotesEntry").focus();
                Session.set("noteTextEntered", false);
            }
        });
    } else {
        // treat as a new / unsaved call sheet
        let username = Meteor.user().username;
        let notes = Session.get("notes");
        let noteArr = Session.get("noteArr");
        // console.log("Note Text: " + noteText);
        notes["note"] = noteText;
        notes["addedOn"] = new Date();
        notes["addedBy"] = username;
        // console.log("added by: " + username);
        noteArr.push(notes);
        Session.set("notes", notes);
        Session.set("noteArr", noteArr);
        $("#callNotesEntry").val('');
        $("#callNotesEntry").focus();
        Session.set("noteTextEntered", false);
    }
}
