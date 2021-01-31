import { StartupWizard } from '../../../imports/api/startupWizard.js';

Template.startupWizard.onCreated(function() {
    this.subscribe("startup");
});

Template.startupWizard.onRendered(function() {
    $('.collapsible').collapsible();
});

Template.aboutCodeSetup.onRendered(function() {
    $('.collapsible').collapsible();
});

Template.aboutUnitSetup.onRendered(function() {
    $('.collapsible').collapsible();
});

Template.startupWizard.helpers({
    pageReady: function() {
        let ready = StartupWizard.findOne({});
        if (typeof ready == 'undefined') {
            return false;
        } else {
            return true;
        }
    },
    currentPage: function() {
        // this helper is determining which page is showing in the startup wizard.
        return StartupWizard.find({});
    },
    currentStep: function() {
        // this helper handles the title for each page of the startup wizard.
        let startupInfo = StartupWizard.findOne({});
        if (typeof startupInfo == 'undefined') {
            return "Start Here";
        } else {
            let stepNo = startupInfo.pageNo;

            if (stepNo < 1) {
                return "Start Here";
            } else if (stepNo == 1) {
                return "About Multi-Tenancy";
            } else if (stepNo == 2) {
                return "Setup System Type";
            } else if (stepNo == 3) {
                return "Setup Entity Types";
            } else if (stepNo == 4) {
                return "Setup Entities";
            } else if (stepNo == 5) {
                return "Setup and Verify Your User";
            } else if (stepNo == 6) {
                return "Setup Your User's Entity";
            } else if (stepNo == 7) {
                return "Verify Your User's Information";
            } else if (stepNo == 8) {
                return "About Unit Types";
            } else if (stepNo == 9) {
                return "Setup Unit Types";
            } else if (stepNo == 10) {
                return "Setup Unit Sub-types";
            } else if (stepNo == 11) {
                return "Setup Unit Divisions";
            } else if (stepNo == 12) {
                return "Setup Code Value Lists";
            } else if (stepNo == 13) {
                return "Call Priority Setup - Entity";
            } else if (stepNo == 14) {
                return "Call Type Setup - Entity";
            } else if (stepNo == 15) {
                return "Quick Notes Setup - Entity";
            } else if (stepNo == 16) {
                return "Disposition Setup - Entity";
            } else if (stepNo == 17) {
                return "Transport Type Setup - Entity";
            } else if (stepNo == 18) {
                return "Out of Vehicle Type Setup - Entity";
            } else if (stepNo == 19) {
                return "Funeral / Wrecker / Service Rotation Setup - Entity";
            } else if (stepNo == 20) {
                return "Wizard Complete";
            } else {
                return "Done";
            }
        }
    },
});

Template.startupWizard.events({
    'click .nextWizard' (event) {
        // check to see what page we have set now, and increase the number of the page.
        let pageInfo = StartupWizard.findOne({});
        if (pageInfo == null || pageInfo == "" || typeof pageInfo == 'undefined') {
            Meteor.call('startup.start', function(err, result) {
                if (err) {
                    console.log("Error calling startup.start method: " + err);
                } else {
                    console.log("Wizard should be started and on Tenant info page.");
                }
            });
        } else {
            Meteor.call('startup.next', function(err, result) {
                if (err) {
                    console.log("Error moving to next page: " + err);
                }
            });
        }
    },
    'click #backWizard' (event) {
        // decrease the number of the page.  We don't have to check what page it's on, because
        // we don't show the back button on the first page of the wizard.
        Meteor.call('startup.back', function(err, result) {
            if (err) {
                console.log("Error moving back a page: " + err);
            }
        });
    },
    'click #completeWizard' (event) {
        // mark the wizard as complete.
        // once we do this, we'll use this value in the db to determine if we should
        // show the wizard in the future or not.
        Meteor.call('complete.wizard', function(err, result) {
            if (err) {
                console.log("Error completing the wizard: " + err);
            } else {
                FlowRouter.go('/user/omv_dispatch_view');
            }
        });
    }
});
