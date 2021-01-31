import { MainUnitType } from '../../../imports/api/mainUnitTypes.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.unitTypesList.onCreated(function() {
    this.subscribe("globalUnitTypes");
    this.subscribe('activeUserSettings');
});

Template.unitTypesList.onRendered(function() {
    $('select').formSelect();
    Session.set("typeReq", false);
});

Template.unitTypesList.helpers({
    typeReq: function() {
        let val = Session.get("typeReq");
        // console.log("Val " + val);
        setTimeout(function() {
                $('select').formSelect();
                Materialize.updateTextFields();
            }, 300);
        return val;
    },
    unitTypeList: function() {
        return MainUnitType.find({});
    },
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.unitTypesList.events({

});
