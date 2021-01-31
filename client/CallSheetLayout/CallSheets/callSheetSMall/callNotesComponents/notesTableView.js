import { Calls } from '../../../../../imports/api/calls.js';

Template.notesTableView.onCreated(function() {
    this.subscribe("activeCalls");
});

Template.notesTableView.onRendered(function() {
    let div= document.getElementById('notesGridBody'); // need real DOM Node, not jQuery wrapper
    let hasVerticalScrollbar= div.scrollHeight>div.clientHeight;
    if (hasVerticalScrollbar) {
        // console.log("Vert Bar = true");
    } else {
        // console.log("Vert Bar = false");
    }
});

Template.notesTableView.helpers({
    notesForCall: function() {
        let mode = Session.get("mode");
        // console.log("mode" + mode);
        let callId = Session.get("callIdCreated");
        return Calls.find({ _id: callId });
    },
    mode: function() {
        return Session.get("mode");
    },
    unsavedNote: function() {
        return Session.get("noteArr");
    },
});

Template.registerHelper('formatNoteDate', function(updatedOn) {
    return moment(updatedOn).format('MM/DD/YYYY hh:mm:ss');
});

Template.notesTableView.events({

});
