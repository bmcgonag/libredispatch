Template.personsForm.onCreated(function() {
    this.subscribe('activePersonTitles');
});

Template.personsForm.onRendered(function() {
    setTimeout(function() {
        $('select').formSelect();
    }, 100);
});

Template.personsForm.helpers({

});

Template.personsForm.events({

});