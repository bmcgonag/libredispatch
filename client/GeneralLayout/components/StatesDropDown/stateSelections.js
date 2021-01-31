import { StateCodes } from '../../../../imports/api/stateCodes.js';

Template.stateSelections.onCreated(function() {
    this.subscribe('states');
});

Template.stateSelections.onRendered(function() {
    
});

Template.stateSelections.helpers({
    stateValues: function() {
        return StateCodes.find({});
    },
});
