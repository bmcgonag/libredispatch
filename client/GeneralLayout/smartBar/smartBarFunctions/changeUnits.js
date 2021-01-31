import { Units } from '../../../../imports/api/units.js';
import { UnitServiceTracking } from '../../../../imports/api/unitServiceTracking.js';
import { Entities } from '../../../../imports/api/entities.js';
import { TenantSetup } from '../../../../imports/api/tenantSetup.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';

// ****    there are several methods we'll be calling in order to change a user from one unit to another.
// ****    we do this from a single function se we can re-use the function and smarts within it whether
// ****    from a mobile user or a dispatcher making the move for the mobile user.

// ****    There are a few criteria to check.
// ****    1. Is this the only user in the unit (is the user the primary) - if so, we need  end mileage for this unit.
// ****    2. Is this the primary user with others in the unit.  -  If so, we need to put the others in an 'out of service'
// ****        state for this unit, and make them choose a new unit to be in service in.
// ****    3. Is this the primary user of the unit he / she is moving to?

changeUnits = function(userId, newUnitId, startMileage, endMileage) {

    // ****    let's set a few starter variables we'll need.
    let usersEntity = Meteor.users.findOne({ _id: userId }).profile.usersEntity;
    let isPriNow = false;
    let willBePri = false;
    let isOnlyUserNow = false;
    let milesReq = false;
    let currUnitId;
    let unitServiceId;
    let callSign;
    let newUnitStatus;

    // ****    we need some information about the new unit the user is moving to
    let newUnitInfo = Units.findOne({ _id: newUnitId });

    if (newUnitInfo) {
        callSign = newUnitInfo.callSign;
        newUnitStatus = newUnitInfo.serviceStatus;
    }

    // ****    is this the only user in the unit (is this our primary user)
    let unitServiceInfo = UnitServiceTracking.findOne({ userId: userId, current: true, userCurrStatus: "InService", unitServiceStatus: "InService" }); // <-- there should only be one current entry for this user as InService

    if (unitServiceInfo) {
        isPriNow = unitServiceInfo.isPrimaryUser;
        currUnitId = unitServiceInfo.unitId;
        usId = unitServiceInfo._id;

        // ****    let's see if we need the user to enter ending mileage becuase they entered starting mileage (whether required by the agency or not)
        if (typeof unitServiceInfo.myStartMileage != 'undefined' && unitServiceInfo.myStartMileage != null && unitServiceInfo.myStartMileage != "") {
            // ****    the user entered start mileage, so we now want the end mileage as well
            milesReq = true;
        }
    }

    // ****    check if this is our only user in the currnet unit
    let unitServiceUserCount = UnitServiceTracking.find({ userCurrStatus: "InService", unitServiceStatus: "InService", current: true }).count();

    if (unitServiceUserCount == 1) {
        // ****    he's alone
        isOnlyUserNow = true;
    } else if (unitServiceUserCount < 1) {
        // ****    no one is in this unit, and we need to alert the user they messed up.
        showSnackbar("An Error Occurred, and the User's Assigned Unit Appears to Be Empty!", "red");
        return;
    }

    // ****    check if ending or begnning mileage is required by their agency.
    let tenantInfo = TenantSetup.findOne({ userEntity: usersEntity });

    if (tenantInfo) {
        milesReq = tenantInfo.ISMileReq;
    }

    // ****    finally, check if our user is going to be the first / only user in the new unit,a nd if so, make sure to mark that they will be primary
    let newUnitUserCount = UnitServiceTracking.find({ unitId: newUnitId, current: true, unitServiceStatus: "InService" }).count();

    if (newUnitUserCount == 0) {
        // ****    he'll be the first, and the primary
        willBePri = true;
    }

    if (willBePri == false) {
        startMileage = null;
    }

    // ****************************************************************************************************
    // ****
    // ****    Now we can get to down to actually making the changes.
    // ****
    // ****************************************************************************************************

    if (isPriNow == true && isOnlyUserNow == false) {
        Meteor.call('unitService.outOfService', usId, endMileage, function(err, result) {
            if (err) {
                console.log("Error removing unit from Service: " + err);
                showSnackbar("Error Occurred While Changing User's Unit!", "red");
                Meteor.call("Log.Errors", "changeUnit.js", "user is primary, user is not alone in unit, 'unitService.outOfService' method call", err, function(error, results) {
                    if (error) {
                        console.log("Error logging the issue with changing user's unit: " + error);
                    }
                }); 
            } else {
                Meteor.call('changeServiceStatus.unit', currUnitId, "OutOfService", function(err, result) {
                    if (err) {
                        console.log("Error removing unit from Service: " + err);
                        showSnackbar("Error Occurred While Changing Unit to Out of Service!", "red");
                        Meteor.call("Log.Errors", "changeUnit.js", "user is primary, user is not alone in unit, 'changeServiceStatus.unit' for Out Of Service method call", err, function(error, results) {
                            if (error) {
                                console.log("Error logging the issue with changing unit to out of service: " + error);
                            }
                        }); 
                    } else {
                        Meteor.call('unitService.add', newUnitId, userId, callSign, startMileage, "InService", willBePri, function(err, result) {
                            if (err) {
                                console.log("Error adding the user to a new unit: " + err);
                                showSnackbar("Error Adding User to a New Unit!", "red");
                                Meteor.call("Log.Errors", "changeUnit.js", "User is primary, and is not alone in unit, 'unitService.add' method call", err, function (error, results) {
                                    if (error) {
                                        console.log("Error encountered trying to write errors to the error log: " + error);
                                    }
                                });
                            } else {
                                Meteor.call('setAllUnitST.OutOfService', currUnitId, function(err, result) {
                                    if (err) {
                                        console.log("Error taking other unit users out of service: " + err);
                                        showSnackbar("Error Taking Other Unit Members Out Of Service!", "red");
                                        Meteor.call("Log.Errors", "changeUnit.js", "User is primary, and is not alone in unit, 'setAllUnitST.OutOfService' method call", err, function (error, results) {
                                            if (error) {
                                                console.log("Error encountered trying to write errors to the error log: " + error);
                                            }
                                        });
                                    } else {
                                        if (newUnitStatus == "InService") {
                                            showSnackbar("User's Unit Changed Successfully!", "green");
                                        } else {
                                            Meteor.call('changeServiceStatus.unit', newUnitId, "InService", function(err, result) {
                                                if (err) {
                                                    console.log("Error putting new unit into service: " + err);
                                                    showSnackbar("Error Putting New Unit In Service!", "red");
                                                    Meteor.call("Log.Errors", "changeUnit.js", "User is primary, and is not alone in unit, 'changeServiceStatus.unit' for In Service method call", err, function (error, results) {
                                                        if (error) {
                                                            console.log("Error encountered trying to write errors to the error log: " + error);
                                                        }
                                                    });
                                                } else {
                                                    showSnackbar("User's Unit Changed Successfully!", "green");
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } else if (isPriNow == true && isOnlyUserNow == true) {
        Meteor.call('unitService.outOfService', usId, endMileage, function(err, result) {
            if (err) {
                console.log("Error removing unit from Service: " + err);
                showSnackbar("Error Occurred While Changing User's Unit!", "red");
                Meteor.call("Log.Errors", "changeUnit.js", "user is primary, user is not alone in unit, 'unitService.outOfService' method call", err, function(error, results) {
                    if (error) {
                        console.log("Error logging the issue with changing user's unit: " + error);
                    }
                }); 
            } else {
                Meteor.call('changeServiceStatus.unit', currUnitId, "OutOfService", function(err, result) {
                    if (err) {
                        console.log("Error removing unit from Service: " + err);
                        showSnackbar("Error Occurred While Changing Unit to Out of Service!", "red");
                        Meteor.call("Log.Errors", "changeUnit.js", "user is primary, user is not alone in unit, 'changeServiceStatus.unit' for Out Of Service method call", err, function(error, results) {
                            if (error) {
                                console.log("Error logging the issue with changing unit to out of service: " + error);
                            }
                        }); 
                    } else {
                        Meteor.call('unitService.add', newUnitId, userId, callSign, startMileage, "InService", willBePri, function(err, result) {
                            if (err) {
                                console.log("Error adding the user to a new unit: " + err);
                                showSnackbar("Error Adding User to a New Unit!", "red");
                                Meteor.call("Log.Errors", "changeUnit.js", "User is primary, and is not alone in unit, 'unitService.add' method call", err, function (error, results) {
                                    if (error) {
                                        console.log("Error encountered trying to write errors to the error log: " + error);
                                    }
                                });
                            } else {
                                if (newUnitStatus == "InService") {
                                    showSnackbar("User's Unit Changed Successfully!", "green");
                                } else {
                                    Meteor.call('changeServiceStatus.unit', newUnitId, "InService", function(err, result) {
                                        if (err) {
                                            console.log("Error putting new unit into service: " + err);
                                            showSnackbar("Error Putting New Unit In Service!", "red");
                                            Meteor.call("Log.Errors", "changeUnit.js", "User is primary, and is not alone in unit, 'changeServiceStatus.unit' for In Service method call", err, function (error, results) {
                                                if (error) {
                                                    console.log("Error encountered trying to write errors to the error log: " + error);
                                                }
                                            });
                                        } else {
                                            showSnackbar("User's Unit Changed Successfully!", "green");
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });
    } else if (isPriNow == false) {
        Meteor.call('unitService.changeUnit', usId, endMileage, function(err, result) {
            if (err) {
                console.log("Error removing user from unit: " + err);
                showSnackbar("Error Removing User from Unit!", "red");
                Meteor.call("Log.Errors", "changeUnit.js", "User is not primary, and will not be primary in new unit, 'unitService.changeUnit' method call", err, function (error, results) {
                    if (error) {
                        console.log("Error encountered trying to write errors to the error log: " + error);
                    }
                });
            } else {
                Meteor.call('unitService.add', newUnitId, userId, callSign, startMileage, "InService", willBePri, function(err, result) {
                    if (err) {
                        console.log("Error adding the user to a new unit: " + err);
                        showSnackbar("Error Adding User to a New Unit!", "red");
                        Meteor.call("Log.Errors", "changeUnit.js", "User is not primary, and will not be primary in new unit, 'unitService.add' method call", err, function (error, results) {
                            if (error) {
                                console.log("Error encountered trying to write errors to the error log: " + error);
                            }
                        });
                    } else {
                        showSnackbar("User's Unit Changed Successfully!", "green");
                    }
                });
            }
        });
    } else {
        // ****    Something went wrong - we shouldn't get here.
        // console.log("Something has gone wrong in our checks. Re-check, and check the code logic.");
        showSnackbar("Unable to change user to new unit!", "red");
        Meteor.call("Log.Errors", "changeUnit.js", "logic checks failed before method calls occurred.", "isPrimaryNow: " + isPriNow + " | Is Only User Now: " + isOnlyUserNow + " | are the values used to check.", function(error, results) {
            if (error) {
                console.log("Error logging issues to the Error Log collection: " + error);
            }
        });
    }
}