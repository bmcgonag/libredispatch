import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { DND } from '../../../../imports/api/dndTracking.js';
import { UserGroups } from '../../../../imports/api/userGroups.js';
import { CallClickTracking } from '../../../../imports/api/callClickTracking.js';
import { Transports } from '../../../../imports/api/transports.js';
import { Calls911 } from '../../../../imports/api/calls911.js';
import { SystemType } from '../../../../imports/api/systemType.js';

Template.activeCallsDisplayGrid.onCreated(function() {
    this.subscribe('active911Calls');
    this.subscribe('systemTypeInfo');
    this.subscribe("activeCalls", {
        onReady: function() {
            // console.log('activeCalls Ready');
        },
        onStop: function() {
            // console.log('Error occurred in subscription activeCalls: ' + err);
        }
    });
    this.subscribe("activeUnits", {
        onReady: function() {
            // console.log('activeUnits ready');
        },
        onStop: function() {
            // console.log('Error occurred in subscription activeUnits: ' + err);
        }
    });
    this.subscribe("activeUserSettings", {
        onReady: function() {
            // console.log('activeUserSettings ready');
        },
        onStop: function() {
            // console.log('Error occurred in subscription activeUserSettings: ' + err);
        }
    });
    this.subscribe("errorLogs", {
        onReady: function() {
            // console.log('errorLogs ready');
        },
        onStop: function() {
            // console.log('Error occurred in subscription errorLogs: ' + err);
        }
    });
    this.subscribe("activeDND", {
        onReady: function() {
            // console.log('activeDND ready');
        },
        onStop: function() {
            // console.log('Error occurred in subscription activeDND: ' + err);
        }
    });
    this.subscribe("activeUserGroups", {
        onReady: function() {
            // console.log('activeUserGroups ready');
        },
        onStop: function() {
            // console.log('Error occurred in subscription activeUserGroups: ' + err);
        }
    });
    this.subscribe("clickedCalls", {
        onReady: function() {
            // console.log('clickedCalls ready');
        },
        onStop: function() {
            // console.log('Error occurred in subscription clickedCalls: ' + err);
        }
    });
    this.subscribe("activeCFSTransports");
    Session.set('ackNoteCount', 0);
});

Template.activeCallsDisplayGrid.onRendered(function() {
    $('.collapsible').collapsible();
    Session.set("expandAll", false);
    Session.set("sortCol", "none");
    Session.set("sortDir", "none");
    Session.set("now", new Date());
    $('.tooltipped').tooltip({delay: 50});
    $('.tabs').tabs();
    var elem = document.querySelector('.collapsible.expandable');
    var instance = M.Collapsible.init(elem, {
        accordion: false
    });
});

Template.activeCallsDisplayGrid.helpers({
    systemInfo: function() {
        return SystemType.findOne({});
    },
    emerCallsCount: function() {
        let callNo = this.callNo;
        console.log("call no for 911: " + callNo);
        return Calls911.find({ callNumber: callNo }).count();
    },
    activeCallSet: function() {
        let myParentEntity = Session.get("myParentEntity");
        let myEntity = Session.get("myEntity");
        let sortCol = Session.get("sortCol");
        let sortDir = Session.get("sortDir");

        let callSet = Calls.find({}).fetch();
        // console.dir(callSet);
        let callCount = callSet.length;
        // console.log("Call Count = " + callCount);
        let i=0;

        getNextPointDispatch = function() {
            if (i < callCount) {
                // console.log("Inside get next point function on Dispatch.");
                // console.log("i is: " + i);
                // console.log("Latitude" + [i] + ": " + callSet[i].latitude);
                waitOn(callSet[i].latitude, callSet[i].longitude, callSet[i].priorityColor, callSet[i].priority, callSet[i].type, callSet[i].callNo);
                i = i + 1;
                Meteor.setTimeout(function() {
                    getNextPointDispatch();
                }, 700);
            }
        }
        getNextPointDispatch();

        // if we want to filter the calls by the call type associations, we need to gather some data about our users
        // ****    We'll have ot do this for mobile view as well.

        // we'll want to get unit type and sub-type (but not here, only on mobile)
        // we need the user's parent entity
        // we need their own entity
        // we need their groups (if they are in any)
        
        // let's get the user's groups
        let myId = Meteor.userId();
        let groupInfo = UserGroups.find({ usersInGroup: myId }).fetch();
        let myGroups = [];

        if (typeof groupInfo != "undefined" && groupInfo != null && groupInfo != "") {
            let groupCount = groupInfo.length;
            for (i = 0; i < groupCount; i++) {
                myGroups.push(groupInfo[i].groupName);        
            }
        }

        // reset tabs
        setTimeout(function() {
            $('.tabs').tabs();
        }, 250);

        // console.log("-------------------------------");
        // console.log("");
        // console.log("my Groups:");
        // console.dir(myGroups);
        // console.log("");
        // console.log("-------------------------------");

        if (sortCol == "QCHeader" && sortDir == "down") {
            // console.log("sorting by " + sortCol + " in " + sortDir + " direction.");
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}, { sort: { quickCallNo: 1 }});
        } else if (sortCol == "QCHeader" && sortDir == "up") {
            // console.log("sorting by " + sortCol + " in " + sortDir + " direction.");
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}, { sort: { quickCallNo: -1 }});
        } else if (sortCol == "LocationHeader" && sortDir == "down") {
            // console.log("sorting by " + sortCol + " in " + sortDir + " direction.");
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}, { sort: { location: 1 }});
        } else if (sortCol == "LocationHeader" && sortDir == "up") {
            // console.log("sorting by " + sortCol + " in " + sortDir + " direction.");
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}, { sort: { location: -1 }});
        } else if (sortCol == "TypeHeader" && sortDir == "down") {
            // console.log("sorting by " + sortCol + " in " + sortDir + " direction.");
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}, { sort: { type: 1 }});
        } else if (sortCol == "TypeHeader" && sortDir == "up") {
            // console.log("sorting by " + sortCol + " in " + sortDir + " direction.");
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}, { sort: { type: -1 }});
        } else if (sortCol == "DispHeader" && sortDir == "down") {
            // console.log("sorting by " + sortCol + " in " + sortDir + " direction.");
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}, { sort: { sentToDispatchAt: 1 }});
        } else if (sortCol == "DispHeader" && sortDir == "up") {
            // console.log("sorting by " + sortCol + " in " + sortDir + " direction.");
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}, { sort: { sentToDispatchAt: -1 }});
        } else if (sortCol == "OSHeader" && sortDir == "down") {
            // console.log("sorting by " + sortCol + " in " + sortDir + " direction.");
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}, { sort: { OnSceneTime: 1 }});
        } else if (sortCol == "OSHeader" && sortDir == "up") {
            // console.log("sorting by " + sortCol + " in " + sortDir + " direction.");
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}, { sort: { OnSceneTime: -1 }});
        } else if (sortCol == "CallNoHeader" && sortDir == "down") {
            // console.log("sorting by " + sortCol + " in " + sortDir + " direction.");
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}, { sort: { callNo: 1 }});
        } else if (sortCol == "CallNoHeader" && sortDir == "up") {
            // console.log("sorting by " + sortCol + " in " + sortDir + " direction.");
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]}, { sort: { callNo: -1 }});
        } else {
            // console.log("No Sorting.");
            // return Calls.find({});
            return Calls.find({ $or: [{ "associations.userGroupAssoc": { $in: myGroups }}, { "associations.userGroupAssoc": [] }]});
        }
    },
    infoCounts: function() {
        let callInfo = Calls.findOne({ _id: this._id });
        let infoCounts = {};

        // get the count of the array objects for a count of alerts, notes, and units on a call
        let alertCount = _.size(callInfo.alerts);
        let noteCount = _.size(callInfo.notes);
        let responseCount = _.size(callInfo.units);

        // if the result of the above is undefined, don't log or return the count and
        // instead return a count of 0 - 0 will trigger UI to show no count.
        if (typeof alertCount != 'undefined') {
            infoCounts.alertCount = alertCount;
        } else {
            infoCounts.alertCount = 0;
        }

        // if the result of the above is undefined, don't log or return the count
        if (typeof noteCount != 'undefined') {
            infoCounts.noteCount = noteCount;
            Session.set("noteCount", noteCount);
        } else {
            infoCounts.noteCount = 0;
            Session.set("noteCount", noteCount);
        }

        if (typeof responseCount != 'undefined') {
            // console.log("callInfo.units[0].currentStatus = " + callInfo.units[0].currentStatus);
            for (s = 0; s < responseCount; s++) {
                if (callInfo.units[s].currentStatus == "Cleared" || callInfo.units[s].currentStatus == "DeAssigned") {
                    responseCount = responseCount - 1;
                }
            }

            infoCounts.responseCount = responseCount;
            Session.set("responseCount", responseCount);
        } else {
            infoCounts.responseCount = 0;
            Session.set("responseCount", responseCount);
        }
        return infoCounts;
    },
    assignedTime: function() {
        return moment(this.assignedOn).format("HH:mm:ss");
    },
    enRouteTime: function() {
        if (this.enrouteOn) {
            return moment(this.enrouteOn).format("HH:mm:ss");
        } else {
            return "";
        }
    },
    arrivedTime: function() {
        if (this.arrivedOn) {
            return moment(this.arrivedOn).format("HH:mm:ss");
        } else {
            return "";
        }
    },
    noteUpdOn: function() {
        return moment(this.addedOn).format("HH:mm:ss");
    },
    moreNotesAdded: function() {
        // let noteCount = Session.get('noteCount');
        // let ackNoteCount = Session.get('ackNoteCount');
        // if (noteCount > ackNoteCount) {
        //     return true;
        // } else {
        //     return false;
        // }
    },
    transportStarted: function() {
        let unitId = this.unitId;
        let transInfo = Transports.findOne({ unitId: unitId });
        if (transInfo) {
            if (transInfo.startedOn) {
                return moment(transInfo.startedOn).format("HH:mm:ss");
            }
        }
    },
    transportEnded: function() {
        let unitId = this.unitId;
        let transInfo = Transports.findOne({ unitId: unitId });
        if (transInfo) {
            if (transInfo.endedOn) {
                return moment(transInfo.endedOn).format("HH:mm:ss");
            }
        }
    },
    expandAll: function() {
        let expanded = Session.get("expandAll");
        // console.log("Expanded is: " + expanded);
        return expanded;
    },
    sortBy: function() {
        let sortCol = Session.get("sortCol");
        let sortDir = Session.get("sortDir");
        let sortBy = sortCol + sortDir;
        // console.log("sortBy = " + sortBy);

        return sortBy;
    },
    elapsedTime: function() {
        let now = Session.get("now");
        let elapseObj = {};
        let nowCalc = moment(now);
        let disp = moment(this.sentToDispatchAt);
        let elapse = nowCalc.diff(disp, 'minutes');
        let timeUnit = 'minutes';
        if (elapse > 1440) {
            let minElapse = elapse%60;
            let hourElapse = Math.floor((elapse%1440)/60);
            let dayElapse = Math.floor(elapse/1440);
            displayElapse = dayElapse + " days";
            totalElapse = dayElapse + " days " + hourElapse + " hours " + minElapse + " min";
        } else if (elapse > 60) {
            let minElapse = elapse%60;
            let hourElapse = Math.floor(elapse/60);
            if (hourElapse > 1) {
                displayElapse = hourElapse + " hours";
                totalElapse = hourElapse + " hours " + minElapse + " min";
            } else {
                displayElapse = hourElapse + " hour";
                totalElapse = hourElapse + " hour " + minElapse + " min";
            }
        } else {
            displayElapse = elapse + " min";
            totalElapse = elapse + " min";
        }
        // console.log("elapsed: " + elapse);
        setTimeout(function() {
            Session.set("now", new Date());
        }, 60000);
        elapseObj.disp = displayElapse;
        elapseObj.total = totalElapse;
        return elapseObj;
    },
    dispTime: function() {
        return moment(this.sentToDispatchAt).format("HH:mm:ss");
    },
    OSTime: function() {
        if (this.firstOnScene == null || this.firstOnScene == "") {
            return "";
        } else {
            return moment(this.firstOnScene).format("HH:mm:ss");
        }
    },
    myPopOut: function() {
        let myId = Meteor.userId();
        let setup = UserSettings.findOne({ userId: myId });
        if (setup) {
            return setup;
        }
    },
});

Template.activeCallsDisplayGrid.events({
    // 'click .callNoteInfo' (event) {
    //     let noteTabId = event.currentTarget.id;
    //     Session.set('ackNoteCount', Session.get('noteCount'));
    // },
    'click .activeUnitOnCall' (event) {
        event.preventDefault();

        // console.log("Event Info: ");
        // console.log(event.currentTarget.id);
        // console.log("--------------------------");
    },
    'contextmenu .activeCallRow' (event) {
        event.preventDefault();

        Session.set("itemClicked", "callsGrid");
        Session.set("clickedItemId", this._id);
        $(".context-menu").css({"top": event.pageY + "px", "left": event.pageX + "px"}).show();
    },
    'contextmenu .unitOnCall' (event) {
        event.preventDefault();

        let callId = event.currentTarget.dataset.callid;
        let callNo = event.currentTarget.getAttribute('callNo');
        // console.log("Unit No: " + unitCallSign);
        // console.log("Call Id: " + callId);
        // console.log("Call No: " + callNo);

        let callSign = this.unit;

        Session.set("itemClicked", "unitOnCallsGrid");
        Session.set("clickedItemId", callId);
        Session.set("unitOnCallClicked", this.unit);
        let unitInfo = Units.findOne({ callSign: callSign});
        let unitId = unitInfo._id;
        Session.set("unitIdRightClicked", unitId);

        $(".context-menu").css({"top": event.pageY + "px", "left": event.pageX + "px"}).show();
    },
    'dragover .activeCallRow' (event) {
        event.preventDefault();
        // let myId = Meteor.user().username;
        // console.log('My id: ' + myId);
        // // let dndInfo = DND.find({ dndBy: myId, complete: false }, { sort: { dndStartOn: -1 }, limit: 1});
        // console.log("Unit Dragged into zone with id: " + dndInfo.unitDragged);
        // Session.set("dragUnitId", dndInfo.unitDragged);
        // Session.set("dndId", dndInfo._id);
    },
    'dragenter .activeCallRow' (event) {
        let myUser = Meteor.userId();
        // console.log('My id: ' + myUser);
        let dndInfo = DND.findOne({ dndBy: myUser, complete: false }, { sort: { dndStartOn: -1 }, limit: 1 });
        if (typeof dndInfo != 'undefined' && dndInfo != "" && dndInfo != null) {
            // console.log("Unit Dragged into zone with id: " + dndInfo.unitDragged);
            Session.set("dragUnitId", dndInfo.unitDragged);
            Session.set("dndId", dndInfo._id);
        }
    },
    'drop .activeCallRow' (event) {
        // let dndInfo = DND.findOne({ dndBy: myId, complete: false }, { sort: { _id: -1 }});
        // console.log("item dropped on me, my ID is: " + this._id);
        let ov = "";
        let dragUnitId = Session.get("dragUnitId");
        let dragUnitInfo = Units.findOne({ _id: dragUnitId });
        let dragCallSign = dragUnitInfo.callSign;

        let dropCallId = this._id;
        let dropCallNo = this.callNo;

        let dndId = Session.get("dndId");

        let unitInfo = Units.findOne({ _id: dragUnitId });

        // check if unit is out of vehicle and avail or not.
        if (unitInfo.currentStatus == "OV" || unitInfo.currentStatus == "OV / Qd") {
            if (unitInfo.oovRemAvail == true) {
                ov = "ov / avail";
            } else {
                ov = "ov / queue"
            }
        }

        // check if unit is already assigned to this call.
        let unitAlreadyAssigned = Calls.findOne({ _id: dropCallId, "units._id": dragUnitId, "units.assignable": false });

        if (typeof unitAlreadyAssigned != 'undefined' && unitAlreadyAssigned != null && unitAlreadyAssigned != "") {
            showSnackbar("Unit " + dragCallSign + " Already Assigned To This Call!", "orange");
        } else {
            Meteor.call('call.assignUnit', dropCallId, dropCallNo, dragUnitId, dragCallSign, function(err, result) {
                if (err) {
                    showSnackbar("Error Assigning Unit to Call", "red");
                    console.log("Error assigning Unit " + dragUnitCallSign + " to call " + dropCallNo + ": " + err);
                    Meteor.call("Log.Errors", "activeCallsDisplayGrid.js", "drop .activeCallRow event assign unit in Calls collection: ", err, function(errors, results) {
                        if (errors) {
                            console.log("Error adding error info to the collection for assigning unit to Calls collection for activeCallsDisplay.js in drop .activeCallsRow event: " + errors);
                        }
                    });
                } else {
                    showSnackbar("Unit " + dragCallSign + " Assigned to " + dropCallNo + " Successfullly", "green");
                    Meteor.call('units.changeCurrentStatus', dragUnitId, dragCallSign, "AS", dropCallNo, function(err, result) {
                        if (err) {
                            console.log("Error changing current status in units: " + err);
                            Meteor.call("Log.Errors", "activeCallsDisplayGrid.js", "drop .activeCallRow event assign unit in Units collection: ", err, function(errors, results) {
                                if (errors) {
                                    console.log("Error adding error info to the collection for assigning unit to Units Collection for activeCallsDisplay.js in drop .activeCallsRow event: " + errors);
                                }
                            });
                        }
                    });
                    Meteor.call("complete.dnd", dndId, dropCallId, function(err, result) {
                        if (err) {
                            console.log("Error completing drag and drop: " + err);
                            Meteor.call("Log.Errors", "activeCallsDisplayGrid.js", "drop .activeCallRow event complete drag and drop: ", err, function(errors, results) {
                                if (errors) {
                                    console.log("Error adding error info to the collection for assigning unit to Units Collection for activeCallsDisplay.js in drop .activeCallsRow event: " + errors);
                                }
                            });
                        } else {
                            // console.log("DND Complete!");
                        }
                    });
                }
            });
        }
    },
    'dblclick .unitOnCall' (event) {
        event.preventDefault();
        let unitCallSign = this.unit;
        let currentStatus = this.currentStatus;

        switch(currentStatus) {
            case "AS":
                var meteorCall = 'call.enrouteUnit';
                var nextStatus = "ER";
                break;
            case "ER":
                var meteorCall = 'call.arriveUnit';
                var nextStatus = "AR";
                break;
        }

        let unitInfo = Units.findOne({ callSign: unitCallSign });
        let unitId = unitInfo._id;

        // console.log("Unit ID for ER 1: " + unitId);

        let callId = event.currentTarget.getAttribute('callId');
        let callNo = event.currentTarget.getAttribute('callNo');
        // console.log("Unit No: " + unitCallSign);
        // console.log("Call Id: " + callId);
        // console.log("Call No: " + callNo);

        Meteor.call(meteorCall, callId, callNo, unitCallSign, unitId, function(err, result) {
            if (err) {
                showSnackbar("Error Putting Unit to Next Status!", "red");
                // console.log("Error putting unit " + unitCallSign + " to next status: " + err);
            } else {
                showSnackbar("Unit " + unitCallSign + " Move to Next Status!", "green");
                Meteor.call('units.changeCurrentStatus', unitId, unitCallSign, nextStatus, callNo, function(err, result) {
                    if (err) {
                        // console.log("Error adding unit assignment to units collection: " + err);
                    }
                });
            }
        });
    },
    'click #expandAll' (event) {
        event.preventDefault();

        Session.set("expandAll", true);
        $('.activeCallHeader').addClass('active');
        $('.collapsible').collapsible();
    },
    'click #collapseAll' (event) {
        event.preventDefault();

        Session.set("expandAll", false);
        $(".activeCallHeader").removeClass(function(){
            return "active";
        });
        $(".collapsible").collapsible({accordion: true});
        $(".collapsible").collapsible({accordion: false});
    },
    'click .sortCalls' (event) {
        event.preventDefault();

        let id=event.currentTarget.id;
        let currDir = Session.get("sortDir");
        let currCol = Session.get("sortCol");


        if ((currDir == "none" || currDir == "up") && currCol == id) {
            // console.log("dir: down with col: " + id)
            Session.set("sortDir", "down");
            Session.set("sortCol", id);
        } else if (currDir == "down" && currCol == id) {
            // console.log("dir: up with col: " + id)
            Session.set("sortDir", "up");
            Session.set("sortCol", id);
        } else if ((currDir == "none" || currDir == "up") && currCol != id) {
            // console.log("dir: down with col: " + id)
            Session.set("sortDir", "down");
            Session.set("sortCol", id);
        } else if (currDir == "down" && currCol != id) {
            // console.log("dir: down with col: " + id)
            Session.set("sortDir", "down");
            Session.set("sortCol", id);
        }
    },
    'click .callInDispatch' (event) {
        // console.log("clicked on call row: " + this._id);
        // Session.set("callIdClicked", this._id);

        let callId = this._id;
        Meteor.call('click.call', callId, function(err, result) {
            if (err) {
                console.log("Error setting the call clicked id value: " + err);
                Meteor.call("Log.Errors", "activeCallsDisplayGrid.js", "click .activeCallRow", err, function(error, results) {
                    console.log("Error logging the issue getting the last active call row clicked: " + error);
                });
            }
        });
    },
    'click .openCallSheetModal' (event) {
        event.preventDefault();

        // use modal wrapper around call sheet and open the one with the id
        // of the row that the icon is clicked on.
        let callId = this._id;
        let callNumber = this.callNo;
        let callType = this.type;

        Session.set("viewDetailFor", callNumber);
        Session.set("callIdCreated", callId);
        Session.set("CallType", callType);
        Session.set("mode", "ViewCallDetail");
        // console.log("Should be setting mode = 'ViewCallDetail'");

        // console.log("Call Type: " + callType);

        let csmodal = document.getElementById('callSheetModalSmall');
        csmodal.style.display = "block";
    }
});
