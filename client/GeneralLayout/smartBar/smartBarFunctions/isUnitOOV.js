import { Units } from  '../../../../imports/api/units.js';

isUnitOOV = function(unitId) {
    let unitInfo = Units.findOne({ _id: unitId });

    if (unitInfo.currentStatus == "OV" || unitInfo.currentStatus == "OV / Qd") {
        Session.set("isUnitOOV", true);
    } else {
        Session.set("isUnitOOV", false);
    }

    return;
}
