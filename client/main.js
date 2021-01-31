import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Entities } from '../imports/api/entities.js';
import Materialize from 'materialize-css';

import './main.html';

Meteor.startup(function() {
 
});

globalHotKeys = new Hotkeys();

globalHotKeys.add({
    combo: "esc",
    eventType: "keydown",
    callback: function() {
        hideSmartBar();
    }
});

globalHotKeys.add({
    combo: "ctrl+space",
    eventType: "keydown",
    callback: function() {
        showSmartBar();
    }
});

globalHotKeys.add({
    combo: "home",
    eventType: "keydown",
    callback: function() {
        $("#fullSearch").focus();
    }
});

global.M = global.Materialize = Materialize;

waitOn = function(latitude, longitude, color, priority, type, callNumber) {
    // console.log('Starting waitOn function. ');
    setTimeout(function() {
        Session.set("mapPointLat", latitude);
        Session.set("mapPointLon", longitude);
        Session.set("markerColor", color);
        Session.set("markerPri", priority);
        Session.set("callType", type);
        Session.set("callNumber", callNumber);
        return;
    }, 500);
}
