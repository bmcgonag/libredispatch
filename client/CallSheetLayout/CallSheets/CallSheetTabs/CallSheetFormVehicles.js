import { VehMakesModels } from '../../../../imports/api/vehMakesModels.js';
import { VehStyles } from '../../../../imports/api/vehStyles.js';
import { VehColors } from '../../../../imports/api/vehColors.js';

Template.callSheetFormVehicles.onCreated(function() {
    this.subscribe('activeVehMakesModels');
    this.subscribe('activeVehStyles');
    this.subscribe('activeVehColors');
});

Template.callSheetFormVehicles.helpers({

});

Template.callSheetFormVehicles.events({

});
