import { Units } from '../../../../../imports/api/units.js';
import { Entities } from '../../../../../imports/api/entities.js';

Template.unitNoSelect.onCreated(function() {
    this.subscribe('activeUnits');
    this.subscribe('activeEntities');
});

Template.unitNoSelect.onRendered(function() {

});

Template.unitNoSelect.helpers({
    settings: function() {
        return {
            position: "bottom",
            limit: 10,
            rules: [
                {
                    token: '',
                    collection: Units,
                    field: "callSign",
                    template: Template.unitsLookup,
                    noMatchTemplate: Template.noMatches,
                },
            ]
        }
    },
});

Template.unitNoSelect.events({

});