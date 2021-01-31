import { VehMakesModels } from '../../../imports/api/vehMakesModels.js';
import { VehStyles } from '../../../imports/api/vehStyles.js';
import { VehColors } from '../../../imports/api/vehColors.js';

Template.vehMakeImport.onCreated(function() {
    this.subscribe('activeVehStyles');
    this.subscribe('activeVehColors');
    this.subscribe('activeVehMakesModels');
});

Template.vehMakeImport.onRendered(function() {
    $('select').formSelect();
    $('ul.tabs').tabs();
});

Template.vehMakeImport.helpers({
    getMakesModels: function() {
        return VehMakesModels.find({ active: true });
    },
    getStyles: function() {
        return VehStyles.find({ active: true });
    },
    getColors: function() {
        return VehColors.find({ active: true });
    },
});

Template.vehMakeImport.events({
    'click #convert' (event) {
        event.preventDefault();

        // check dropdown value to determine what type of file to expect.
        var fileType = $("#importFileType").val();



        var data = [];
        // first check to see if the user has selected a file
        var makeModelFile = document.getElementById("makeModelFile").files[0];
        // console.dir(recipientFile);
        if (makeModelFile == "" || makeModelFile == null) {
            alert("No File Selected");
        } else {
            // handle the file selected, and import the Data
            document.getElementById('customFileUpload').innerHTML = 'selected file will show here';
            document.getElementById("customFileUpload").className = "custom-file-waiting";

            Papa.parse(makeModelFile, {
                delimiter: ",",
                header: true,
                dynamicTyping: false,
                complete: function(results) {
                    data = results;
                    // console.log(data);
                    Meteor.call('importData.import', data, fileType, function(err, results){
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
    'change #makeModelFile' (event) {
        event.preventDefault();
        var filename = $("#makeModelFile").val();
        // console.log("Filename is: " + filename);
        document.getElementById('customFileUpload').innerHTML = filename;
        document.getElementById("customFileUpload").className = "custom-file-selected";
    },
});
