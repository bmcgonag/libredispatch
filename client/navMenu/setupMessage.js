Template.setupMessage.onCreated(function(){

});

Template.setupMessage.onRendered(function() {
    
});

Template.setupMessage.helpers({
    messageText: function() {
        return Session.get("setupMessageText");
    },
    setupCallType: function() {
        return Session.get("setupCallTypes");
    },
    setupUnitType: function() {
        return Session.get("setupUnitTypes");
    },
    setupOOVType: function() {
        return Session.get("setupOOVTypes");
    },
    setupDispo: function() {
        return Session.get("setupDispos");
    },
});

Template.setupMessage.events({
    'click .collection-item' (event) {
        let itemId = event.currentTarget.id;

        // console.log("Item clicked: " + itemId);
        switch (itemId) {
            case "setupCallPriorities":
                FlowRouter.go('/admin/callPrioritySetup');
                break;
            case "setupCallTypes":
                FlowRouter.go('/admin/callTypeSetup');
                break;
            case "setupUnitTypes":
                FlowRouter.go('/admin/unitSetup');
                break;
            case "setupOOVTypes":
                FlowRouter.go('/admin/oovTypeSetup');
                break;
            case "setupDispos":
                FlowRouter.go('/admin/dispositionSetup');
                break;
            default:
                showSnackbar("Option Not Available", "red");
                break;
        }
    }
});