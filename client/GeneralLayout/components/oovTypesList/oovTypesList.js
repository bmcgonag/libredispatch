import { OOVTypes } from '../../../../imports/api/outOfVehicleTypes.js';
import { Entities } from '../../../../imports/api/entities.js';

Template.OOVTypesList.onCreated(function() {
    this.subscribe("activeEntities");
    this.subscribe("oovTypes");
});

Template.OOVTypesList.onRendered(function() {
    $('select').formSelect();
});

Template.OOVTypesList.helpers({
    oovTypes: function() {
        return OOVTypes.find({});
    },
});

Template.OOVTypesList.events({

});

Template.oovTypeDropList.onCreated(function() {
    this.subscribe("activeEntities");
    this.subscribe("oovTypes");
});

Template.oovTypeDropList.onRendered(function() {
    $('select').formSelect();
});

Template.oovTypeDropList.helpers({
    oovTypes: function() {
        return OOVTypes.find({});
    },
});