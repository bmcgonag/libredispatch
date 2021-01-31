import { Calls } from '../../../imports/api/calls.js';
import { Entities } from '../../../imports/api/entities.js';

Template.callSheetForm.onCreated(function() {
    this.subscribe("activeEntities");
    this.subscribe("allUsers");
});

Template.callSheetForm.onRendered(function() {
    $('ul.tabs').tabs();
});

Template.callSheetForm.events({
    'click .saveCall' (event) {
        event.preventDefault();

        let now = new Date();

        let callLocation = $("#callLocation").val();
        let callType = $("#callType").val();
        let callPriority = $("#callPriority").val();
        let callNo = moment(now).format("YYYYMMDD-hhmmss");
        Session.set("callStatus", callNo);
        let callers = [];
        let notes = [];
        let subjects = [];
        let vehicles = [];
        let callStartedAt = now;
        let user = Meteor.userId();

        // idnetify the users agency / entity directly over him / her.
        // the "Parent Entity" should always be the CAD center for the user.
        let usersEntity = Meteor.users.findOne().profile.usersEntity;

        // console.log("User Entity: " + usersEntity);
        let parentEntity = Entities.findOne({ entityName: usersEntity }).entityParent;
        // console.dir(parentEntity);

        if (parentEntity == "parent") {
            parentEntity = usersEntity;
        }

        if (callLocation == '' || callLocation == null || callType == "" || callType == null) {
            showSnackbar("Call Location and Type are Required!", "red");
            //// console.log("call must have location and type set.");
        } else {
            Meteor.call("call.create", callLocation, callNo, callType, callPriority, callers, notes, subjects, vehicles, callStartedAt, usersEntity, parentEntity, function(err, result){
                if (err) {
                    showSnackbar("Error Adding New Call!", "red");
                    // console.log("Error adding call: " + err);
                } else {
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
        }
    },
});
