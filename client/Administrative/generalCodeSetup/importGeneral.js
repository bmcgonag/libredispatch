import { StateCodes } from '../../../imports/api/stateCodes.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.importGeneral.onCreated(function() {
    this.subscribe('states');
    this.subscribe('activeUserSettings');
});

Template.importGeneral.onRendered(function() {
    $('select').formSelect();
    $('ul.tabs').tabs();
});

Template.importGeneral.helpers({
    getStates: function() {
        return StateCodes.find({});
    },
    userPrefs: function() {
        let myId = Meteor.userId;
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.importGeneral.events({
    'click #convert' (event) {
        event.preventDefault();

        // check dropdown value to determine what type of file to expect.
        var fileType = $("#genImportFileType").val();

        var data = [];
        // first check to see if the user has selected a file
        var importFile = document.getElementById("importFile").files[0];
        // console.dir(recipientFile);
        if (importFile == "" || importFile == null) {
            alert("No File Selected");
        } else {
            // handle the file selected, and import the Data
            document.getElementById('customFileUpload').innerHTML = 'selected file will show here';
            document.getElementById("customFileUpload").className = "custom-file-waiting";

            Papa.parse(importFile, {
                delimiter: ",",
                header: true,
                dynamicTyping: false,
                complete: function(results) {
                    data = results;
                    // console.log(data);
                    Meteor.call('importGeneral.import', data, fileType, function(err, results){
                        if (err) {
                            // console.log('Importing Error: ' + err);
                        } else {
                            // console.log('Results are: ' + results);
                        }
                    });
                },
            });
        }
    },
    'change #importFile' (event) {
        event.preventDefault();
        var filename = $("#importFile").val();
        // console.log("Filename is: " + filename);
        document.getElementById('customFileUpload').innerHTML = filename;
        document.getElementById("customFileUpload").className = "custom-file-selected";
    },
});
