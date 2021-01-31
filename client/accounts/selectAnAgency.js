import { Entities } from '../../imports/api/entities.js';
import { StartupWizard } from '../../imports/api/startupWizard.js';

// this view is run on startup.  The user will be checked to see if 
// he / she has an entity already assigned for their user, and if not
// should be brought to this view.

Template.selectAnAgency.onCreated(function() {
    this.subscribe('activeEntities');
    this.subscribe("startup");
});

Template.selectAnAgency.onRendered(function() {
    setTimeout(function() {
            $('select').formSelect();
            Materialize.updateTextFields();
        }, 500);
});

Template.selectAnAgency.helpers({
    entitiesList: function() {
        return Entities.find({});
    },
    startupComplete: function() {
        let comp = StartupWizard.findOne();
        if (typeof comp == 'undefined' || comp == "" || comp == null) {
            FlowRouter.go('/admin/startupWizard');
        } else {
            if (comp.wizardComplete == true) {
                return true;
            } else {
                FlowRouter.go('/admin/startupWizard');
            }
        }
    },
});

Template.selectAnAgency.events({
    'click .selectAnAgency' (event) {
        event.preventDefault();

        let agencySelected = $("#selectUsersAgency").val();
        console.log(("Agency Selected is: " + agencySelected));

        Meteor.call("AddEntityToUser", agencySelected, function(err, result) {
            if (err) {
                console.log("Error updating user entity: " + err);
                showSnackbar("Error Updating Your Entity / Agency!", "red");
                Meteor.call("Log.Errors", "selectAnAgency.js", "click .selectAnAgency", err);
            } else {
                showSnackbar("Agency / Entity Selection Updated!", "green");
                Session.set("verifiedEntity", false);
            }
        });
    },
});
