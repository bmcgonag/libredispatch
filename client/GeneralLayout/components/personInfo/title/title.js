import { PersonTitles } from '../../../../../imports/api/personTitles.js';

Template.title.onCreated(function() {
    this.subscribe('acitvePersonTitles');
});

Template.title.onRendered(function() {
    setTimeout(function() {
        $('select').formSelect();
    }, 100);
});

Template.title.helpers({
    titles: function() {
        return PersonTitles.find({ type: 'Title' });
    }
});

Template.title.events({

});