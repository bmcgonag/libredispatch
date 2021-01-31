import { EntityTypes } from '../../../../imports/api/entityTypes.js';

Template.entityTypeSetup.onCreated(function() {
    this.subscribe('activeEntityTypes');
});

Template.entityTypeSetup.onRendered(function() {
    Session.set("editEntityTypeMode", "new");
});

Template.entityTypeSetup.helpers({
    mode: function() {
        return Session.get("editEntityTypeMode");
    },
});

Template.entityTypeSetup.events({
 'click .addEntityType' (event) {
     event.preventDefault();

     let typeName = $("#entityTypeName").val();
     let typeDesc = $("#entityTypeDesc").val();
     let active = $("#entityTypeActive").prop('checked');

     if (typeName == "" || typeName == null) {
         showSnackbar("Entity Type Name is a Required Field!", "red");
         return;
     } else {
         Meteor.call("entityType.add", typeName, typeDesc, active, function (err, result) {
             if (err) {
                 console.log("Error adding entity type: " + err);
                 showSnackbar("Error Adding Entity Type!", "red");
             } else {
                 showSnackbar("Entity Type Added Successfully", "green");
                 Session.set("editEntityTypeMode", "new");
                 $("#entityTypeName").val('');
                 $("#entityTypeDesc").val('');
                 $("#entityTypeActive").prop('checked', false);
                 Materialize.updateTextFields();
                 setTimeout(function() {
                     $('select').formSelect();
                 }, 250);
             }
         });
     }
 },
});
