import { CallTypes } from '../../imports/api/callTypes.js';
import { CallPriorities } from '../../imports/api/callPriorities.js';
import { TenantSetup } from '../../imports/api/tenantSetup.js';
import { UserSettings } from '../../imports/api/userSettings.js';
import { UnitServiceTracking } from '../../imports/api/unitServiceTracking.js';
import { SystemType } from '../../imports/api/systemType.js';

Template.navHeader.onCreated(function() {
    this.subscribe("activeCallTypes");
    this.subscribe("callPriorities");
    this.subscribe("entityTenantSetup");
    this.subscribe("activeUserSettings");
    this.subscribe("currentUnitTracking");
    this.subscribe("systemTypeInfo");
});

Template.navHeader.onRendered(function() {
    $('.modal').modal();
    $('.tooltipped').tooltip();
    $('.sidenav').sidenav();
    $(".dropdown-trigger").dropdown();
});

Template.navHeader.helpers({
    systemType: function() {
        return SystemType.findOne({});
    },
    headerColorSet: function() {
        let tenant = TenantSetup.find({}).fetch();
        // console.log('====================================');
        // console.dir(tenant);
        // console.log('====================================');
        if (typeof tenant == 'undefined' || tenant == "" || tenant == null) {
            return false;
        } else {
            return true;
        }
    },
    headerBarColor: function() {
        let tenant = TenantSetup.findOne({});
        // console.log("checked it.");
        if (typeof tenant == 'undefined' || tenant == "" || tenant == null) {
            // console.log("tenant info not found.");
            Session.set('headerSet', false);
            return "blue darken-2";
        } else {
            // console.log("---- tenant found. ---- color: " + tenant.navBarColor);
            Session.set("headerSet", true);
            return tenant.navBarColor;
        }
    },
    unitGridSeparate: function() {
        let myId = Meteor.userId();
        // console.log("User ID is: " + myId);
        let mySettings = UserSettings.findOne({ userId: myId });
        if (!mySettings) {
            return true;
        } else if (mySettings.unitsGridParked == true || mySettings.unitsGridParked == null) {
            return true;
        } else {
            return false;
        }
    },
    myAssignedUnit: function() {
        let myId = Meteor.userId();
        // console.log("My user Id: " + myId);
        let unitServiceInfo = UnitServiceTracking.findOne({ userId: myId, unitServiceStatus: "InService" });

        if (unitServiceInfo) {
            Session.set("myAssignedUnit", unitServiceInfo.unitId);
            return unitServiceInfo;
        } else {
            Session.set("myAssignedUnit", "None");
            return "None";
        }
    },
    userInService: function() {
        let myId = Meteor.userId();
        let unitServiceInfo = UnitServiceTracking.findOne({ userId: myId, unitServiceStatus: "InService" });
        if (unitServiceInfo) {
            if (unitServiceInfo.userCurrStatus == "InService") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    connStatus: function() {
        let connStatus = Meteor.status();
        // console.dir(connStatus);
        Session.set("connStatus", connStatus.status);
        Session.set("connected", connStatus.connected);
        return connStatus;
    },
});

Template.navHeader.events({
    'click  .navBtn' (event) {
        event.preventDefault();
        var clickedTarget = event.target.id;

        // close the side navigation bar
        // document.getElementById("cadSidenav").style.width = "0";

        // console.log("User clicked: " + clickedTarget);
        if (clickedTarget == "inServiceUnits" || clickedTarget == 'userSettings' || clickedTarget === 'calls_view' || clickedTarget === 'alerts' || clickedTarget === 'universalCodes') {
            FlowRouter.go('/user/' + clickedTarget);
        } else if (clickedTarget === 'omv_dispatch_view') {
            // let's check and make sure they have Call Types, Priorities,
            // How Received, and other value sets setup.
            let callTypes = CallTypes.find({}).fetch();
            let priorities = CallPriorities.find({}).fetch();

            if (typeof callTypes == 'undefined' || callTypes == "" || callTypes == null || typeof priorities == 'undefined' || priorities == "" || priorities == null) {
                Session.set("setupMessageText", "You still need to setup Call Types and / or Call Priorities in order to utilized the Call Creation functions of this system.  If you do not have access to the Administrative options in the left slide-out menu, please contact your system administrator for assistance.");
                FlowRouter.go('/user/setupMessage');
            } else {
                FlowRouter.go('/user/' + clickedTarget);
            }

        } else if (clickedTarget == 'messaging') {
            window.open("/user/messaging");
        } else if (clickedTarget !== "signIn" && clickedTarget !== "signOut") {
            FlowRouter.go('/admin/' + clickedTarget);
        }
    },
    'click .signIn': () => {
        var signInModal = document.getElementById('signInModal');
        signInModal.style.display = "block";
    },
    'click .signOut': () => {
        document.getElementById("cadSidenav").style.width = "0";
        Meteor.logout();
    },
    'click #newCallModal' (event) {
        event.preventDefault();
        // console.log("Click on new call button detected.");
        Session.set("mode", "NewCall");
        // Session.set("mapPointLat", 33.546223);
        // Session.set("mapPointLon", -101.93159);
        let csmodal = document.getElementById('callSheetModalSmall');
        csmodal.style.display = "block";

        $("#callLocation").val('');
        $("#callLocation").focus();
    },
    'click .parkUnitsGrid' (event) {
        event.preventDefault();
        let myId = Meteor.userId();
        
        // now change the userSettings to call the park function
        Meteor.call('unitsGrid.park', myId, function(err, result) {
            if (err) {
                console.log("Error parking Units Grid: " + err);
                Meteor.call("Log.Errors", "navHeader.js", "click .parkUnitsGrid event", err, function(errors, results) {
                    if (errors) {
                        console.log("Error encountered writing to error log from nav header.js for click .parkUnitsGrid function / event : " + errors);
                    }
                });
            }
        });
    },
    'click .goInServiceNav' (event) {
        event.preventDefault();

        // call the modal for in service options.
        $("#goInOutOfService").modal('open');
    },
    'click .myServStat' (event) {
        event.preventDefault();

        // open the in / out / change unit modal
        $("#goInOutOfService").modal('open');
    },
    'keyup #fullSearch' (event) {
        var value = $("#fullSearch").val().toLowerCase();
        $(".searchable tr,li").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    },
    'click .splitUnitsOut' (event) {
        console.log("clicked");
        window.open('/user/unitsDisplayGrid');

        Meteor.call('unitsGrid.unpark', Meteor.userId(), function(err, result) {
            if (err) {
                console.log('Error setting units grid mode as unparked: ' + err);
                Meteor.call('Log.Errors', "unitsDisplayGrid.js", "click .parkUnits", err, function(errors, results) {
                    if (errors) {
                        console.log("Error writing parking error to log collection: " + errors);
                    }
                });
            } else {
                console.log("unparked succesfully.");
            }
        });
    },
    'click .parkUnits' (event) {
        window.close('/user/unitsDisplayGrid');

        Meteor.call('unitsGrid.park', Meteor.userId(), function(err, result) {
            if (err) {
                console.log('Error setting units grid mode as unparked: ' + err);
                Meteor.call('Log.Errors', "unitsDisplayGrid.js", "click .parkUnits", err, function(errors, results) {
                    if (errors) {
                        console.log("Error writing parking error to log collection: " + errors);
                    }
                });
            } else {
                console.log("parked successfully.");
            }
        });
    },
});
