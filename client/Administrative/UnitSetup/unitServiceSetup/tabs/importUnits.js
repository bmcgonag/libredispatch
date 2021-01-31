import { Units } from '../../../../../imports/api/units.js';

Template.importUnits.onRendered(function() {
    $('select').formSelect();
});

Template.importUnits.events({
    'click #convertUnits' (event) {
        event.preventDefault();

        var data = [];
        // first check to see if the user has selected a file
        var importFile = document.getElementById("unitImportFile").files[0];
        // console.dir(recipientFile);
        if (importFile == "" || importFile == null) {
            alert("No File Selected");
        } else {
            // handle the file selected, and import the Data
            document.getElementById('customUnitsFileUpload').innerHTML = 'selected file will show here';
            document.getElementById("customUnitsFileUpload").className = "custom-file-waiting";

            Papa.parse(importFile, {
                delimiter: ",",
                header: true,
                dynamicTyping: false,
                complete: function(results) {
                    data = results;
                    // console.log(data);
                    Meteor.call('unitInfo.import', data, fileType, function(err, results){
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
        var filename = $("#unitImportFile").val();
        // console.log("Filename is: " + filename);
        document.getElementById('customUnitsFileUpload').innerHTML = filename;
        document.getElementById("customUnitsFileUpload").className = "custom-file-selected";
    },
});
