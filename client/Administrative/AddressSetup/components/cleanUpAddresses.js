import { Addresses } from '../../../../imports/api/addresses.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { Meteor } from 'meteor/meteor';

Template.cleanUpAddresses.onCreated(function() {
    this.subscribe('errorLogs');
    this.subscribe('entityAddresses');
});

Template.cleanUpAddresses.onRendered(function() {
    $('.tooltipped').tooltip();
    $('.modal').modal();
});

Template.cleanUpAddresses.helpers({

});

Template.cleanUpAddresses.events({
 'click #trimAddressString' (event) {
     event.preventDefault();

     Session.set("confirmationDialogTitle", "Confirm - Potentially Destructive Action");
     Session.set("confirmationDialogContent", "You are about to clean spaces from the beginning and end of addresses. This action has some risk of data destruction. Please ensure you've made a backup of all data before continuing.  Do you wish to continue?");
     Session.set("eventConfirmCallBackFunction", "trimAddressInfo");
     Session.set("eventConfirmNecessaryId", "NA");

     $("#confirmationDialog").modal('open');
 },
 'click #geocodeAddresses' (event) {
     event.preventDefault();

     Session.set("confirmationDialogTitle", "Confirm - Geocode Multiple Addresses");
     Session.set("confirmationDialogContent", "You are about to perform an action that may affect system responsiveness. You should notify users of this action prior to performing it.  Are you ready to continue?");
     Session.set("eventConfirmCallBackFunction", "geoCodeAllAddresses");
     Session.set("eventConfirmNecessaryId", "NA");

     $("#confirmationDialog").modal('open');
 },
});

trimAddressInfo = function(sentId) {
    // console.log("Boom! Got to trimAddressInfo with id: " + sentId);

    Meteor.call('address.trimUp', function(err, result) {
        if (err) {
            console.log("Error when calling address.trimUp method: " + err);
            showSnackbar("Calling the Function to Trim Address Spaces Failed!", "red");
            Meteor.call('Log.Errors', "cleanUpAddress.js", "trimAddressInfo function - mehod call address.trimUp", err, function(error, results) {
                if (error) {
                    console.log("Error saving error information to log: cleanUpAddresses.js >> trimAddressInfo function >> address.trimUp method call: " + error);
                }
            });
        } else {
            showSnackbar("Address Trim Complete!", "green");
        }
    });
}

geoCodeAllAddresses = function(sentId) {
    // console.log("Boom! Got to geoCodeAllAddresses with id: " + sentId);

    // now we'll loop through the addresses, and geo-code each one.

    let g=0;

    Meteor.call('geocode', g, function(err, result) {
        if (err) {
            console.log("Error geocoding all addresses: " + err);
            showSnackbar("Error Geocoding All Addresses!", "red");
        } else {
            showSnackbar("Geocoding Complete!", "green");
        }
    });
    
}