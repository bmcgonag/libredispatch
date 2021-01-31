import { Entities } from '../../../../imports/api/entities.js';

Template.entitiesList.onCreated(function() {
    this.subscribe("activeEntities");
});

Template.entitiesList.onRendered(function() {
    $('select').formSelect();
});

Template.entitiesList.helpers({
    activeEntities: function() {
        let myEntity = Session.get("myEntity");
        // console.log("Your entity is: " + myEntity);
        if (myEntity = "GlobalEntity") {
            return Entities.find({});
        } else {
            return Entities.find({ parentEntity: myEntity });
        }
    },
    entityReq: function() {
        let val = Session.get("entityReq");
        // console.log("Val entity req: " + val);
        setTimeout(function() {
                $('select').formSelect();
                Materialize.updateTextFields();
            }, 300);
        return val;
    },
});

Template.entitiesList.events({

});
