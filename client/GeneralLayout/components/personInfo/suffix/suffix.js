import { PersonTitles } from '../../../../../imports/api/personTitles.js';

Template.suffix.onCreated(function() {
    this.subscribe('acitvePersonTitles');
});

Template.suffix.onRendered(function() {
    setTimeout(function() {
        $('select').formSelect();
    }, 100);
});

Template.suffix.helpers({
    titles: function() {
        return PersonTitles.find({ type: 'Suffix' });
    }
});

Template.suffix.events({

});