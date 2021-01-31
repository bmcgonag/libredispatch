unitTypeReq = function(unitType) {
    if (unitType == "" || unitType == null) {
        Session.set("typeReq", true);
        // console.log("Unit Type Req: true");
    }
    return;
}

unitSubTypeReq = function(unitSubType) {
    if (unitSubType == "" || unitSubType == null) {
        Session.set("subTypeReq", true);
        // console.log("Unit Sub Type Req: true");
    }
    return;
}

unitDivisionReq = function(unitDivision) {
    if (unitDivision == "" || unitDivision == null) {
        Session.set("divisionReq", true);
        // console.log("Unit Division Req: true");
    }
    return;
}

EntityReq = function(entity) {
    if (entity == "" || entity == null) {
        Session.set("entityReq", true);
        // console.log("Unit Entity Req: true");
    }
    return;
}
