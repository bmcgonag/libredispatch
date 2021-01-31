import { CallPriorities } from '../../../../imports/api/callPriorities.js';

Template.callPriority.onCreated(function() {
    this.subscribe('callPriorities');
});

Template.callPriority.onRendered(function() {
    Session.set("priOfSelType", "");
    $('select').formSelect();
    setTimeout(function() {
        $('select').formSelect();
    }, 250);
    if ((Session.get("priOfSelType")) != "") {
        Materialize.updateTextFields();
    }
});

Template.callPriority.helpers({
    callTypePriorities: function() {
        return CallPriorities.find({});
    },
    priOfSelType: function() {
        // console.log("try to change the dropdown.");
        var priType = Session.get("priOfSelType");
        setTimeout(function() {
            $('select').formSelect();
        }, 500);
        return priType;
    },
});

Template.callPriority.events({

});
