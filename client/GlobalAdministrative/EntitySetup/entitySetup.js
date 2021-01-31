import { Entities } from '../../../imports/api/entities.js';
import { EntityTypes } from '../../../imports/api/entityTypes.js';

Template.entitySetup.onCreated(function() {
    this.subscribe('activeEntities');
    this.subscribe('activeEntityTypes');
    Session.set("incorrect", "correct");;
});

Template.entitySetup.onRendered(function() {
    $('select').formSelect();
    setTimeout(function() {
        $('select').formSelect();
    }, 500);
});

Template.entitySetup.helpers({
    entryCorrect: function() {
        return Session.get("incorrect");
    },
    entities: function() {
        return Entities.find({});
    },
    entityTypesList: function() {
        return EntityTypes.find({});
    },
    noTypes: function() {
        let types = EntityTypes.find({}).count();
        if (types < 1) {
            return true;
        } else {
            return false;
        }
    },
    entityNameCorrect: function() {
        let correct = Session.get("eNameCorrect");
        console.log('Shown as ' + correct);
        return correct;
    },
});

Template.entitySetup.events({
    'focusout .entityPrimaryPhone' (event) {
        let pnum = $("#entityPrimaryPhone").val();
        let pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        if (!pattern.test(pnum)) {
            Session.set("incorrect", "incorrect");
        } else {
            Session.set("incorrect", "correct");
        }
    },
    'focusout #entityName' (event) {
        let eName = $("#entityName").val();
        console.log('Entity Name is ' + eName);

        if (eName == "" || eName == null) {
            Session.set("eNameCorrect", "incorrect");
            console.log('Should be incorrect');
        } else {
            Session.set("eNameCorrect", "correct");
            console.log('Should be correct.');
            let nameExists = Entities.find({ entityName: eName }).count();
            if (nameExists > 0) {
                Session.set("eNameCorrect", "incorrect");
                showSnackbar("Entity Name Already Exists! Please Change the Name.", "red");
            } else {
                Session.set("eNameCorrect", "correct");
            }
        }
    },
    'click .addEntity' (event) {
        event.preventDefault();

        let entityName = $("#entityName").val();
        let entityType = $("#entityType").val();
        let entityParent = $("#subEntityOf").val();
        let entityORI = $("#entityORI").val();
        let entityPhone = $("#entityPrimaryPhone").val();
        let entityAddress = $("#entityPrimaryAddress").val();
        let isGlobalEntity = $("#isGlobal").prop('checked');

        // check the phone number one more time
        let pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        if (entityParent == "parent") {
            entityParent = entityName;
        }

        if (!pattern.test(entityPhone)) {
            Session.set("incorrect", "incorrect");
            $("#entityPrimaryPhone").focus();
            showSnackbar("Phone is not in proper format!", "red");
        } else if (Session.get("eNameCorrect") == "incorrect") {
            $("#entityName").focus();
            showSnackbar("Entity Name is Taken, Please Change the Name.", "red");
        } else {
            Session.set("incorrect", "correct");

            if (isGlobalEntity == true) {
                // first we need to make sure no other entity is set to global. We can only have 1
                let globalNow = Entities.findOne({ globalEntity: true });
                if (globalNow == null) {
                    console.log('Not set as Global Entity.');
                    Meteor.call('insert.newEntity', entityName, isGlobalEntity, entityType, entityParent, entityORI, entityPhone, entityAddress, function(err, result){
                        if (err) {
                            showSnackbar("Error Occurred on Insert of Entity", "red");
                        } else {
                            showSnackbar("Entity Added Successfully!", "green");
                            clearEntitiesFields();
                            setTimeout(function() {
                                $('select').formSelect();
                                Materialize.updateTextFields();
                            }, 500);
                        }
                    });
                } else {
                    let currGlobalId = globalNow._id;
                    console.log('Set as Global Entity.');
                    Meteor.call('removeGlobal.entity', currGlobalId, function(err, result) {
                        if (err) {
                            console.log("Error removing Global Entity Attribute: " + err);
                        } else {
                            // add to the database
                            Meteor.call('insert.newEntity', entityName, isGlobalEntity, entityType, entityParent, entityORI, entityPhone, entityAddress, function(err, result){
                                if (err) {
                                    showSnackbar("Error Occurred on Insert of Entity", "red");
                                } else {
                                    showSnackbar("Entity Added Successfully!", "green");
                                    clearEntitiesFields();
                                    setTimeout(function() {
                                        $('select').formSelect();
                                        Materialize.updateTextFields();
                                    }, 500);
                                }
                            });
                        }
                    });
                }  
            } else {
                // add to the database
                console.log('Not set as Global Entity.');
                Meteor.call('insert.newEntity', entityName, isGlobalEntity, entityType, entityParent, entityORI, entityPhone, entityAddress, function(err, result){
                    if (err) {
                        showSnackbar("Error Occurred on Insert of Entity", "red");
                    } else {
                        showSnackbar("Entity Added Successfully!", "green");
                        clearEntitiesFields();
                        setTimeout(function() {
                            $('select').formSelect();
                            Materialize.updateTextFields();
                        }, 500);
                    }
                });
            }   
        }
    }
});

clearEntitiesFields = function() {
    $("#entityName").val("");
    $("#entityType").val("");
    $("#subEntityOf").val("");
    $("#entityORI").val("");
    $("#entityPrimaryPhone").val("");
    $("#entityPrimaryAddress").val("");
    $("#isGlobal").prop('checked', false);
    return;
}
