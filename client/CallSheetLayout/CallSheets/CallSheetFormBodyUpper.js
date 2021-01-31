import { CallTypes } from '../../../imports/api/callTypes.js';

Template.callSheetFormBodyUpper.onCreated(function() {
    this.subscribe("activeCallTypes");
});

Template.callSheetFormBodyUpper.onRendered(function() {
    Session.set("canSend", "disabled");
    Session.set("typeSel", false);
    Session.set("callStatus", "New");
});

Template.callSheetFormBodyUpper.helpers({
    canSend: function () {
        var callLocSet = Session.get("locReq");
        var callTypeSet = Session.get("typeSel");
        if (callLocSet == true && callTypeSet == true) {
            Session.set("canSend", "enabled");
        } else {
            Session.set("canSend", "disabled");
        }
        return Session.get("canSend");
    },
});

Template.callSheetFormBodyUpper.events({
    'change #callType' (event) {
        // This function acts on the call type field in the form.
        // it's here, because putting it in callType.js wasn't
        // triggering the change event.
        var selCallType = $("#callType").val();

        if (selCallType == '' || selCallType == null) {
            $("#callLocation").addClass('reqField');
            Session.set("typeSel", false);
            Session.set("callTypeSet", false);
        } else {
            $("#callLocation").removeClass('reqField');
            var priorityOption = CallTypes.findOne({ callTypeName: selCallType, active: true, deleted: false });
            var priOfSelType = priorityOption.callTypePriority;
            // console.log("Priority based on type selected: " + priOfSelType);
            Session.set("priOfSelType", priOfSelType);
            Session.set("typeSel", true);
            Session.set("callTypeSet", true);
            // console.log("Call Type set = true");
        }
    },
});
