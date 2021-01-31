Template.importCollections.onCreated(function() {

});

Template.importCollections.onRendered(function() {

});

Template.importCollections.helpers({

});

Template.importCollections.events({
    'change #importFile' (event) {
        event.preventDefault();
        let filename = $("#importFile").val();
        // console.log("Filename is: " + filename);
        document.getElementById('collectionFileUpload').innerHTML = filename;
        document.getElementById("collectionFileUpload").className = "custom-file-selected";
    },
    'click #importCollection' (event) {
        event.preventDefault();

        let filename = $("#importFile").val();
        let pathToFile = $("#pathToFile").val();
        let collectionFile = document.getElementById("importFile").files[0];
        let mongoServer = $("#mongoServerAddress").val();
        let mongoPort = $("#mongoServerPort").val();

        console.log("Filename: " + filename);
        console.log("mongoServer: " + mongoServer);
        console.log("mongoPort: " + mongoPort);

        let filenameParts = filename.split("\\");
        let fileNamePart1 = filenameParts[(filenameParts.length - 1)];
        console.log("filenameParts: " + fileNamePart1);
        let actualFileNameParts = fileNamePart1.split(".");
        let collectionName = actualFileNameParts[0];
        console.log("collection name is: " + collectionName);

        Meteor.call("in.collections", fileNamePart1, pathToFile, mongoServer, mongoPort, collectionName, function(err, result) {
            if (err) {
                console.log("Error importing collection " + collectionName + ": " + err);
                showSnackbar("Error importing collection " + collectionName + "!", "red");
                Meteor.call("Log.Errors", "importCollections.js", "click #importCollection", err);
            } else {
                showSnackbar(collectionName + " Imported Successfully!", "green");
            }
        });
    },
});
