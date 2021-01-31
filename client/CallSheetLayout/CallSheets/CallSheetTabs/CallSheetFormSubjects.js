import { Persons } from '../../../../imports/api/persons.js';

Template.CallSheetFormSubjects.onCreated(function() {
    this.subscribe("activePersons");
});

Template.CallSheetFormSubjects.onRendered(function() {
    $('select').formSelect();
    $('.tooltipped').tooltip();
});

Template.CallSheetFormSubjects.helpers({

});

Template.CallSheetFormSubjects.events({

});