import { Units } from '../../../../imports/api/units.js';
import { Entities } from '../../../../imports/api/entities.js';
import { TenantSetup } from '../../../../imports/api/tenantSetup.js';
import { UnitServiceTracking } from '../../../../imports/api/unitServiceTracking.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

Template.inOutOfServiceModal.onCreated(function() {
    this.subscribe('activeUnits');
    this.subscribe('activeEntities');
    this.subscribe('entityTenantSetup');
    this.subscribe('currentUnitTracking');
    this.subscribe("errorLogs.js");
    Session.set("changeService", false);
});

Template.inOutOfServiceModal.onRendered(function() {
    
});

Template.inOutOfServiceModal.helpers({
    unitsInOutService: function() {
        let myEntity = Session.get("myEntity");
        return Units.find({ unitEntity: myEntity });
    },
    EntitySetupInfo: function() {
        let myEntity = Session.get("myEntity");
        // console.log("my Entity is:" + myEntity)
        return TenantSetup.findOne({ userEntity: myEntity });
    },
    currServiceStatus: function() {
        let myId = Meteor.userId();
        let changeService = Session.get("changeService");

        // check to see if we are changing units, if so, return that flag
        // if not, then check our current status and set the appropriate fields.
        if (changeService == true) {
            // console.log("Getting changeServiceUnit returned.");
            return "changeServiceUnit";
        } else {
            // console.log('My Id: ' + myId);
            let myCurrServStatus = UnitServiceTracking.findOne({ userId: myId, current: true });
            if (myCurrServStatus) {
                if (myCurrServStatus.userCurrStatus == "OutService") {
                    // console.log('---- should show in service ----');
                    return "goInService";
                } else {
                    // console.log('---- should show out of service ----');
                    return "goOutService";
                }
            } else {
                // console.log('---- should show in service ----');
                return "goInService";
            }
        }
    },
    msgType: function() {
        let msg_Type = Session.get("msgInfo");
        let msgText = Session.get("msgText");
        let msgInfo = {};

        if (msg_Type == 'error') {
            msgInfo.color = "red";
            msgInfo.textColor = "white-text";
        } else if (msg_Type == 'warning') {
            msgInfo.color = "orange";
            msgInfo.textColor = "white-text";
        } else if (msg_Type == 'notice') {
            msgInfo.color = "yellow darken-2";
            msgInfo.textColor = "black";
        } else if (msg_Type == 'goal') {
            msgInfo.color = 'green';
            msgInfo.textColor = 'white-text';
        } else {
            return "";
        }

        msgInfo.msgText = msgText;
        return msgInfo;
    },
    showMsg: function() {
        return Session.get("showMsg");
    },
    changeService: function() {
        let changeService = Session.get("changeService");

        return changeService;
    },
});

Template.inOutOfServiceModal.events({
    'click #goInService' (event) {
        event.preventDefault();
        let myEntity = Session.get("myEntity");
        let unitNoSel = $("#unitNoSelect").val();
        let startMiles = $("#ISStartMiles").val();
        let startMileage;
        let mileageReq;
        let serviceStatus = "InService";
        let unitId;
        let isPri = true;
        let myId = Meteor.userId();

        // get the unitId for the CallSign collected
        let unitInfo = Units.findOne({ callSign: unitNoSel });

        if (unitInfo) {
            unitId = unitInfo._id;
            Session.set("showMsg", false);
        } else {
            Session.set("msgInfo", "error");
            Session.set("msgText", "Unable to find the selected unit in the collection.");
            Session.set("showMsg", true);
            return;
        }

        let unitServiceCount = UnitServiceTracking.find({ unitId: unitId, current: true, unitServiceStatus: "InService"}).count();
        if (unitServiceCount > 0) {
            // we aren't the first one in the unit, and therefore not primary
            isPri = false;
        }

        // let's see if mileage is required.
        let tenantSetupInfo = TenantSetup.findOne({ userEntity: myEntity });

        if (tenantSetupInfo) {
            if (tenantSetupInfo.ISMileReq == true) {
                if (startMiles == "" || startMiles == null) {
                    Session.set("msgInfo", "error");
                    Session.set("msgText", "In Service start Mileage is required!");
                    Session.set("showMsg", true);
                    return;
                } else {
                    Session.set("showMsg", false);
                    Session.set("msgInfo", "none");
                    Session.set("msgText", "");
                }
            }
        }

        // let's make sure the user selected a unit number to go in service in.
        
        if (unitNoSel == "" || unitNoSel == null) {
            Session.set("msgInfo", "error");
            Session.set("showMsg", true);
            Session.set("msgText", "Unit Number must be Selected!");
            return;
        } else {
            Session.set("showMsg", false);
            Session.set("msgInfo", "none");
            Session.set("msgText", "");
        }

        if (startMiles == "" || startMiles == null) {
            startMileage = null;
        } else {
            startMileage = parseFloat(startMiles);
        }

        Meteor.call('unitService.add', unitId, myId, unitNoSel, startMileage, serviceStatus, isPri, function(err, result) {
            if (err) {
                console.log("Error adding User to Unit: " + err);
                Session.set("msgInfo", "error");
                Session.set("showMsg", true);
                Session.set("msgText", "Error encountered while adding you to the unit!");
                Meteor.call('Log.Errors', "inOutOfServiceModal.js", "click #goInService", err, function(error, results) {
                    if (error) {
                        console.log("Error logging the error encountered adding the user to the unit: " + error);
                    }
                });
            } else {
                Session.set("msgInfo", "goal");
                Session.set("showMsg", true);
                Session.set("msgText", "User In Service!");
            }
        });
    },
    'click #goOutService' (event) {
        event.preventDefault();
        let endMiles = $("#EndServMiles").val();
        let endingMileage = parseFloat(endMiles);
        let mileageReq;
        let myId = Meteor.userId();
        let myEntity = Session.get("myEntity");
        let serviceStatus = "OutService";
        
        // get my current service status (make sure I'm actually in service);
        let unitST = UnitServiceTracking.findOne({ userId: myId });

        if (unitST) {
            Session.set("showMsg", false);
            let usId = unitST._id;
            let callSign = unitST.callSign;
            let serviceStatus = "OutOfService";

            if (unitST.userCurrStatus == "InService") {
                Session.set("showMsg", false);
                
                // get the unitId for the CallSign collected
                let unitId = unitST.unitId;
        
                // let's see if mileage is required.
                let tenantSetupInfo = TenantSetup.findOne({ userEntity: myEntity });
        
                if (tenantSetupInfo) {
                    if (tenantSetupInfo.ISMileReq == true) {
                        if (endMiles == "" || endMiles == null) {
                            Session.set("msgInfo", "error");
                            Session.set("msgText", "Out of Service Ending Mileage is required!");
                            Session.set("showMsg", true);
                            return;
                        } else {
                            Session.set("showMsg", false);
                            Session.set("msgInfo", "none");
                            Session.set("msgText", "");
                        }
                    }
                }

                // ************************************************************************************************************
                // we need to find out if this user is the primary in the unit, if not, then just remove him from the unit.
                // if so, then take the unit out of service, don't just remove the user.
                // we use "OutOfService" as the status in the collections
                // ************************************************************************************************************
                let isPri = unitST.isPrimaryUser;

                if (isPri == true) {
                    // take the unit out of service and remove all users
                    // update Units collection and UnitServiceTracking collection.
                    Meteor.call('unitService.outOfService', usId, endingMileage, function(err, result) {
                        if (err) {
                            console.log("Error taking unit out of service in UnitServiceTracking: " + err);
                            Session.set("msgInfo", "error");
                            Session.set("msgText", "Error Taking Unit Out Of Service in Unit Service Tracking!");
                            Session.set("showMsg", true);
                            Meteor.call('Log.Errors', "inOutOfServiceModal.js", "click #goOutService", err, function(error, results) {
                                if (error) {
                                    console.log("Error logging the error encountered removing the user from the unit: " + error);
                                }
                            });
                        } else {
                            Meteor.call('changeServiceStatus.unit', unitId, serviceStatus, function(err, result) {
                                if (err) {
                                    console.log("Error taking unit out of service in UnitServiceTracking: " + err);
                                    Session.set("msgInfo", "error");
                                    Session.set("msgText", "Error Taking Unit Out Of Service in Unit Service Tracking!");
                                    Session.set("showMsg", true);
                                    Meteor.call('Log.Errors', "inOutOfServiceModal.js", "click #goOutService changeServiceStatus method call", err, function(error, results) {
                                        if (error) {
                                            console.log("Error logging the error encountered removing the unit from In Service status: " + error);
                                        }
                                    });
                                } else {
                                    // now set the unit Out of Service in Unit Service Tracking for the other users too.
                                    Meteor.call("setAllUnitST.OutOfService", unitId, function(err, result) {
                                        if (err) {
                                            console.log("Error taking other users out of service for unit " + callSign + ": " + err);
                                            Session.set("msgInfo", "warning");
                                            Session.set("msgText", "You are now out of service, but other users in the unit are not! This can create issues, please have them go out of service as well.");
                                            Session.set("showMsg", true);
                                            Meteor.call('Log.Errors', "inOutOfServiceModal.js", "click #goOutService setAllInUnitST.OutOfService method call", err, function(error, results) {
                                                if (error) {
                                                    console.log("Error logging the error encountered removing all other users from an out of serviced unit:" + error);
                                                } else {
                                                    Session.set("msgInfo", "goal");
                                                    Session.set("msgText", "Unit Is Now Out Of Service.");
                                                    Session.set("showMsg", true);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    // take the user out of the unit, but leave it in service, and warn him / her that they are not the primary
                    // and the unit will remain in service until the primary goes out of service.
                    Meteor.call("unitService.outOfService", usId, endingMileage, function(err, result) {
                        if (err) {
                            console.log("Error taking user out of service in UnitServiceTracking: " + err);
                            Session.set("msgInfo", "error");
                            Session.set("msgText", "Error Taking User Out Of Service in Unit Service Tracking!");
                            Session.set("showMsg", true);
                        } else {
                            Session.set("msgInfo", "goal");
                            Session.set("msgText", "User Taken Successfully Out Of Service.");
                            Session.set("showMsg", true);
                        }
                    });
                }
            } else {
                Session.set("msgInfo", "error");
                Session.set("msgText", "Unable to locate an In Service unit with your user assigned!");
                Session.set("showMsg", true);
                return;
            }
        } else {
            Session.set("msgInfo", "error");
            Session.set("msgText", "Unable to locate a unit with your user assigned!");
            Session.set("showMsg", true);
            return;
        }
    },
    'click #changeUnits' (event) {
        event.preventDefault();
        Session.set("changeService", true);
    },
    'click #confirmUnitChange' (event) {
        event.preventDefault();
 
        let myId = Meteor.userId();
        let myEntity = Session.get("myEntity");
        let serviceStatus = "OutOfService";
        let newServiceStatus = "InService";
        let endMileage = $("#EndServMiles").val();
        let endingMileage = parseFloat(endMileage);
        let startingMileage = $("#ISStartMiles").val();
        let startMileage = parseFloat(startingMileage);
        let newUnitNo = $("#unitNoSelect").val();
        let tenantSetupInfo = TenantSetup.findOne({ userEntity: myEntity });
        let endMileReq = false;
        let startMileReq = false;
        let willBePri = false;
        let newUnitId;
        let MileReq = false;

        if (tenantSetupInfo) {
            MileReq = tenantSetupInfo.ISMileReq;
        }

        let unitInfo = Units.findOne({ callSign: newUnitNo });

        if (unitInfo) {
            newUnitId = unitInfo._id;
        }

        // we check in the function, but here we check if mileage is required to alert the user before moving on.
        let unitServiceInfo = UnitServiceTracking.findOne({ userId: myId, current: true, userCurrStatus: "InService", unitServiceStatus: "InService" });
        if (unitServiceInfo) {
            if (typeof unitServiceInfo.myStartMileage != 'undefined' && unitServiceInfo.myStartMileage != null && unitServiceInfo.myStartMileage != "") {
                endMileReq = true;
            }
        }

        if (unitServiceInfo.unitId == newUnitId) {
            showSnackbar("You Cannot Change to a Unit You Are Already In!", "red");
            return;
        }

        if (( endMileReq == true || MileReq == true ) && (endingMileage == null || endingMileage == "" )) {
            showSnacbar("Ending Mileage is Required!", "red");
            return;
        }

        let newUnitServiceCount = UnitServiceTracking.find({ unitId: newUnitId, current: true, unitServiceStatus: "InService" }).count();

        if (newUnitServiceCount > 0 && MileReq == true && (startMileage == null || startMileage == ""))  {
            showSnacbar("Starting Mileage is Required!", "red");
            return;
        }

        changeUnits(myId, newUnitId, startMileage, endingMileage);
    },
    'click #cancelInOut' (event) {
        event.preventDefault();
        Session.set("msgInfo", "");
        Session.set("msgText", "");
        Session.set("showMsg", false);
        Session.set("changeService", false);
        $("#goInOutOfService").modal('close');
    },
});