import { Addresses } from '../../../../imports/api/addresses.js';
import { Jurisdiction } from '../../../../imports/api/jurisdiction.js';

Template.importAddresses.onCreated(function() {

});

Template.importAddresses.onRendered(function() {

});

Template.importAddresses.helpers({

});

Template.importAddresses.events({
    'click .importAddresses' (event) {
        event.preventDefault();

        let serverUrl = $("#serverURL").val();
        let dbName = $("#dbName").val();
        let dbUser = $("#dbUser").val();
        let dbPass = $("#dbPswd").val();

        if (serverUrl == null || serverUrl == "" || dbName == "" || dbName == null || dbUser == "" || dbUser == null || dbPass == "" || dbPass == null) {
            showSnackbar("All Fields are Required!", "red");
            return
        } else {
            Meteor.call('getAddresses', serverUrl, dbName, dbUser, dbPass, function(err, result) {
                if (err) {
                    console.log("Error importing addresses: " + err);
                    showSnackbar("Error Importing Addresses from " + serverURL + " / " + dbName, "red");
                    Meteor.call("Log.Errors", "importAddresses.js", "calling getAddresses method", err);
                } else {
                    showSnackbar("Addresses Importing!", "green");
                }
            });
        }
    },
});
