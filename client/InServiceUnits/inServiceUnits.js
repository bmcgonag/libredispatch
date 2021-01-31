import { Units } from '../../imports/api/units.js';

Template.inServiceUnits.onCreated(function() {
    this.subscribe("activeUnits");
});

Template.inServiceUnits.onRendered(function() {

});

Template.inServiceUnits.helpers({
    getUnits: function() {
        return Units.find({});
    },
});

Template.inServiceUnits.events({
    'click .serviceButton' (event) {
        event.preventDefault();

        let unitId = this._id;
        let currentServiceStatus = this.serviceStatus;
        let currentStatus = this.currentStatus;
        let serviceStatus;
        let changeStatus;

        changeUnitServiceStatus(unitId, currentServiceStatus, currentStatus);
    },
});

changeUnitServiceStatus = function(unitId, currentServiceStatus, currentStatus) {
    if (currentServiceStatus == "InService") {
        if (currentStatus == "AS" || currentStatus == "ER" || currentStatus == "AR" || currentStatus == "AS / Qd" || currentStatus == "AR / TR") {
            showSnackbar("Unit is Currently in a Status where Out of Service is not Possible", "orange");
            changeStatus = "no";
        } else {
            serviceStatus = "OutOfService";
            changeStatus = "yes";
        }
    } else if (currentServiceStatus == "OutOfService") {
        serviceStatus = "InService";
        changeStatus = "yes";
    }

    // console.log("Unit " + unitId + " is in status " + serviceStatus);

    if (changeStatus == "no") {
        return ("Can't change status now.");
    } else {
        Meteor.call('changeServiceStatus.unit', unitId, serviceStatus, function(err, result) {
            if (err) {
                showSnackbar("Unable to change unit status!", "red");
                console.log("Error updating unit status: " + err);
                Meteor.call("Log.Error", "inServiceUnits.js", "click .serviceButton", err);
            } else {
                showSnackbar("Unit Status Updated", "green");
            }
        });
    }
}
