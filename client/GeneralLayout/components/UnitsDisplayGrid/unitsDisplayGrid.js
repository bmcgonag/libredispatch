import { Units } from '../../../../imports/api/units.js';
import { Entities } from '../../../../imports/api/entities.js';
import { UnitTypes } from '../../../../imports/api/unitTypes.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { DND } from '../../../../imports/api/dndTracking.js';
import { Calls } from '../../../../imports/api/calls.js';

Template.unitsDisplayGrid.onCreated(function() {
    this.subscribe("activeUnits", {
        onReady: function() {
            // console.log('activeUnits ready');
        },
        onStop: function() {
            // console.log('Error occurred in subscription activeUnits: ' + err);
        }
    });
    this.subscribe("activeEntities", {
        onReady: function() {
            // console.log('activeEntities ready');
        },
        onStop: function() {
            // console.log('Error occurred in subscription activeEntities: ' + err);
        }
    });
    this.subscribe("activeSubTypes", {
        onReady: function() {
            // console.log('activeSubTypes ready');
        },
        onStop: function() {
            // console.log('Error occurred in subscription activeSubTypes: ' + err);
        }
    });
    this.subscribe("activeUserSettings", {
        onReady: function() {
            // console.log('activeUserSettings ready');
        },
        onStop: function() {
            /// console.log('Error occurred in subscription activeUserSettings: ' + err);
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
    this.subscribe("activeCalls", {
        onReady: function() {
            // console.log('activeCalls ready');
        },
        onStop: function() {
            // console.log('Error occurred in subscription activeCalls: ' + err);
        }
    });
});

Template.unitsDisplayGrid.onRendered(function() {
    $('.collapsible').collapsible();
});

Template.unitsDisplayGrid.helpers({
    unitInService: function() {
        let thisSubType = this.unitSubType;

        // console.log("This Subtype: " + thisSubType);

        return Units.find({ serviceStatus: "InService", subType: thisSubType }, { $sort: { subType: 1 }});
    },
    statusAsOf: function() {
        return moment(this.statusChangeOn).format("MM/DD/YY hh:mm");
    },
    subTypesList: function() {
        return UnitTypes.find({});
    },
    noInService: function() {
        let thisSubType = this.unitSubType;
        // console.log("Subtype for count: " + this.unitSubType);
        let noInServiceUnits = Units.find({ serviceStatus: "InService", subType: thisSubType }).count();
        // console.log("No In Service: " + noInServiceUnits);
        return noInServiceUnits;
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let setup = UserSettings.findOne({ userId: myId });
        if (setup) {
            return setup;
        }
    },
    unitParentEntity: function() {
        return this.parentEntity;
    },
    quickCallNo: function() {
        let callNo = this.callNo;
        let callInfo = Calls.findOne({ callNo: callNo });
        if (callInfo) {
            return callInfo.quickCallNo;
        }
    },
    assignedLocation: function() {
        let callNo = this.callNo;
        let callInfo = Calls.findOne({ callNo: callNo });
        if (callInfo) {
            return callInfo.location;
        }
    },
});

Template.unitsDisplayGrid.events({
    'dragstart .unitDraggable' (event) {
        console.log("dragging  " + this._id + " with call sign " + this.callSign);
        let dragUnitId = this._id;
        let dragCallSign = this.callSign;
        Session.set("dragUnitId", dragUnitId);
        Session.set("dragUnitCallSign", dragCallSign);

        // secondarily set the unitId into a collection to be called
        // up when dropped on a call - this allows us to split out the 
        // units window, but still keep the units drag and drop functionality
        Meteor.call('start.dnd', dragUnitId, function(err, result) {
            if (err) {
                console.log('Error dragging unit with id: ' + dragUnitId + ' and call sign: ' + dragCallSign + ': ' + err);
                Meteor.call('Log.Errors', "unitDisplayGrid.js", "dragStart .unitGridRow event", err, function(errors, results) {
                    if (errors) {
                        console.log("Error logging this error in unitDisplayGrid.js for dragStart .unitGridRow event: " + errors);
                    }
                });
            } else {
                console.log("Drag Started on unit: " + dragCallSign);
                Session.set("dndId", result);
            }
        });
    },
    'mouseover .infoRow' (event) {
        // console.log("this._id: " + this._id);
        let myRow = document.getElementById(this._id);
        // console.dir(myRow)
        let settings = UserSettings.findOne({});
        if (settings) {
            myRow.style.background = settings.themeHighlight;
            myRow.style.color = settings.themeHighlightText;
        }
    },
    'mouseout .infoRow' (event) {
        let myRow = document.getElementById(this._id);
        myRow.style.background = "";
        myRow.style.color = "";
    },
    'contextmenu .unitGridRow' (event) {
        event.preventDefault();

        Session.set("itemClicked", "unitGrid");
        Session.set("clickedItemId", this._id);
        Session.set("unitIdRightClicked", this._id);
        $(".context-menu").css({"top": event.pageY + "px", "left": event.pageX + "px"}).show();
    },
});
