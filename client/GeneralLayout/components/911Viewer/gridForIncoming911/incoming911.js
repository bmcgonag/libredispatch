import { Calls911 } from '../../../../../imports/api/calls911.js';
import { Calls } from '../../../../../imports/api/calls.js';
import { Entities } from '../../../../../imports/api/entities.js';
import { ErrorLogs } from '../../../../../imports/api/errorLogs.js';
import { Meteor } from 'meteor/meteor';

Template.incoming911.onCreated(function() {
    this.subscribe('active911Calls');
    this.subscribe('activeCalls');
    this.subscribe('activeEntities');
    this.subscribe("errorLogs");
});

Template.incoming911.onRendered(function() {
    $('.tooltipped').tooltip();
    $('.collapsible').collapsible();
    $('.modal').modal();
});

Template.incoming911.helpers({
    nonCFS911: function() {
        let myParentEntity = Session.get("myParentEntity");
        // console.log("My Parent Entity: " + myParentEntity);
        return Calls911.find({ cfsActive: true, call911ParentEntity: myParentEntity, status: "new", callNumber: "" });
    },
    dateRcvd: function() {
        let dateRcvd = moment(this.addedOn).format("MM/DD/YYYY hh:mm:ss");
        return dateRcvd;
    },
    callAck: function() {
        if (this.callAcknowledged == true) {
            return true;
        } else { 
            return false;
        }
    },
    callAckOnFormatted: function() {
        return moment(this.callAckOn).format('MM/DD/YYYY hh:mm:ss');
    },
});

Template.incoming911.events({
    'click .createCall' (event) {
        // when clicked we want to get call location, coordinates, and
        // open the call sheet modal, pass in those values, and let the
        // user create the call with call type and other data.

        // console.log("create call from 911 id: " + this._id);
        let call911Id = this._id;

        createCallFrom911(call911Id);
    },
    'click .deleteFromQueue' (event) {
        // console.log("delete 911 id: " + this._id);

        Session.set("confirmationDialogTitle", "Confirm - Delete 911 Call from the Queue");
        Session.set("confirmationDialogContent", "You are about to delete the selected 911 call, and remove it from the queue permanently. Do you wish to continue?");
        Session.set("eventConfirmCallBackFunction", "delete911Call");
        Session.set("eventConfirmNecessaryId", this._id);

        $("#confirmationDialog").modal('open');
    },
    'click .addToExisting' (event) {
        //console.log("add to existing call 911 id: " + this._id);

        // still need to do this.
        
        // allow drag and drop?

    },
    'click .markDuplicate' (event) {
        // console.log("mark as duplicate the 911 id: " + this._id);
        
        Session.set("confirmationDialogTitle", "Confirm - Mark 911 Call As Duplicate");
        Session.set("confirmationDialogContent", "You are about to mark the selected 911 call as a duplicate, and remove it from the queue permanently. Do you wish to continue?");
        Session.set("eventConfirmCallBackFunction", "markAsDuplicate");
        Session.set("eventConfirmNecessaryId", this._id);

        $("#confirmationDialog").modal('open');
    },
    'click .call911header' (event) {
        setTimeout(function() {
            $('.tooltipped').tooltip();
        }, 100);
        // console.log("This is our 911 call acknowledgement.");
        let call911Id = this._id;
        // console.log("Call 911 Id: " + call911Id);
        // first we need to see if it's been acknowledged.
        let call911Info = Calls911.findOne({ _id: call911Id });
        if (call911Info) {
            if (call911Info.callAcknowledged == true) {
                return;
            } else {
                Meteor.call('acknowledge.911call', call911Id, function(err, result) {
                    if (err) {
                        console.log("Error acknowledging 911 Call: " + err);
                        showSnackbar("Error Acknowledging 911 Call!", "red");
                        Meteor.call("Log.Errors", "incoming911.js", "click .call911header", "err", function(error, results) {
                            console.log("Error logging an error to the database: " + error);
                        });
                    }
                });
            }
        }
    },
});

createCallFrom911 = function(call911Id) {
    let callLocation;
    let coordinates = {};

    let call911Info = Calls911.findOne({ _id: call911Id });
    if (call911Info) {
        Session.set("from911Id", call911Id);
        callLocation = call911Info.anialiaddress;
        coordinates.latitude = call911Info.anialilatitude;
        coordinates.longitude = call911Info.anialilongitude;

        Session.set("mode", "from911");
        Session.set("from911", true);
        Session.set("callLoc911", callLocation);
        Session.set("coordFrom911", coordinates);

        let csmodal = document.getElementById('callSheetModalSmall');
        csmodal.style.display = "block";
    }
}

markAsDuplicate = function(call911Id) {
    Meteor.call('mark911Call.asDuplicate', call911Id, function(err, result) {
        if (err) {
            console.log("Error marking 911 call as duplicate: " + err);
            showSnackbar("Error Marking 911 Call as Duplcate!", "red");
            Meteor.call("Log.Errors", "incoming911.js", "markAsDuplicate function", err, function(error, results) {
                if (error) {
                    console.log("Error logging method call error to database: " + error);
                }
            });
        } else {
            showSnackbar("911 Call Marked as Duplicate", "green");
        }
    });
}

delete911Call = function(call911Id) {
    Meteor.call('call911.delete', call911Id, function(err, result) {
        if (err) {
            console.log("Error deleting 911 call: " + err);
            showSnackbar("Error Deleting 911 Call!", "red");
            Meteor.call("Log.Errors", "incoming911.js", "delete911Call function", err, function(error, results) {
                if (error) {
                    console.log("Error logging method call error to database: " + error);
                }
            });
        } else {
            showSnackbar("911 Call Deleted from Queue", "green");
        }
    });
}