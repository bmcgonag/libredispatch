import { CallTypes } from '../../imports/api/callTypes.js';
import { CallPriorities } from '../../imports/api/callPriorities.js';
import { UnitTypes } from '../../imports/api/unitTypes.js';
import { Units } from '../../imports/api/units.js';
import { OOVTypes } from '../../imports/api/outOfVehicleTypes.js';
import { MainUnitType } from '../../imports/api/mainUnitTypes.js';
import { Dispos } from '../../imports/api/dispositions.js';
import { StartupWizard } from '../../imports/api/startupWizard.js';

Template.homeView.onCreated(function() {
    this.subscribe("activeCallTypes");
    this.subscribe("callPriorities");
    this.subscribe("activeSubTypes");
    this.subscribe("unitTypeNames");
    this.subscribe("activeUnits");
    this.subscribe("oovTypes");
    this.subscribe("activeDispositions");
    this.subscribe("startup");
});

Template.homeView.onRendered(function() {
    Session.set("setupCallTypes", false);
    Session.set("setupUnitTypes", false);
    Session.set("setupOOVTypes", false);
    Session.set("setupDispos", false);
});

Template.homeView.helpers({
    setupDone: function() {
        let callTypes = CallTypes.find({}).fetch();
        let priorities = CallPriorities.find({}).fetch();
        let oovTypes = OOVTypes.find({}).fetch();
        let unitTypes = UnitTypes.find({}).fetch();
        let dispos = Dispos.find({}).fetch();
        let startWiz = StartupWizard.find({}).fetch();
        let message = false;

        //     *** We check the values to make sure all modules are setup for Global and Local Admins
        if (typeof callTypes == 'undefined' || callTypes == "" || callTypes == null || typeof priorities == 'undefined' || priorities == "" || priorities == null) {
            message == true;
            Session.set("setupCallTypes", true);
        }

        if (typeof unitTypes == 'undefined' || unitTypes == "" || unitTypes == null) {
            message == true;
            Session.set("setupUnitTypes", true);
        }

        if (typeof oovTypes == 'undefined' || oovTypes == "" || oovTypes == null) {
            message = true;
            Session.set("setupOOVTypes", true);
        }

        if (typeof dispos == 'undefined' || dispos == "" || dispos == null) {
            message = true;
            Session.set("setupDispos", true);
        }

        if (startWiz[0].wizardComplete == false || typeof startWiz == 'undefined' || startWiz == "" || startWiz == null) {
            wizard = true;
            Session.set("wizard", true);
        }

        if (wizard == true) {
            // return false;   // change this back
            return true;
        // } else if (message == true) {
        //     Session.set("setupMessageText", "You still need to setup values in order to utilized the Call Creation functions of this system.  If you do not have access to the Administrative options in the left slide-out menu, please contact your system administrator for assistance.");
        //     return false;
        } else {
            return true;
        }
    },
    wizardNeeded: function() {
        let wiz = Session.get("wizard");
        if (wiz == true) {
            // return true; // change this back.
            return false;
        } else {
            return false;
        }
    },
});
