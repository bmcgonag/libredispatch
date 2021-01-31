Template.exportCollections.onCreated(function() {

});

Template.exportCollections.onRendered(function() {

});

Template.exportCollections.helpers({

});

Template.exportCollections.events({
    'click .export-btn' (event) {
        event.preventDefault();

        let exportClicked = event.currentTarget.id;
        console.log("button clicked: " + exportClicked);
        let outputPath = $("#exportDirectory").val();

        if (outputPath == "" || outputPath == null) {
            showSnackbar("Output Path is Required", "red");
            $("#exportDirectory").addClass('red');
            $("#exportDirectory").removeClass('yellow');
        } else {
            Meteor.call('out.systemCollections', outputPath, exportClicked, function(err, result) {
                if (err) {
                    console.log("Error occurred exporting! " + err);
                    showSnackbar("Error Exporting Data!", "red");
                    Meteor.call("Log.Errors", "exportCollections.js", "exportCommands", err);
                } else {
                    showSnackbar("Export Succeeded!", "green");
                    $("#exportDirectory").addClass('yello');
                    $("#exportDirectory").val('');
                    $("#exportDirectory").removeClass('red');
                }
            });
        }
    },
    'click .export-client-btn' (event) {
        event.preventDefault();

        let buttonClicked = event.currentTarget.id;
        let outputPath = $("#exportDirectory").val();

        if (outputPath == "" || outputPath == null) {
            showSnackbar("Output Path is Required", "red");
            $("#exportDirectory").addClass('red');
            $("#exportDirectory").removeClass('yellow');
        } else {
            Meteor.call('out.clientCollections', outputPath, buttonClicked, function(err, result) {
                if (err) {
                    console.log("Error occurred exporting! " + err);
                    showSnackbar("Error Exporting Data!", "red");
                    Meteor.call("Log.Errors", "exportCollections.js", "exportCommands", err);
                } else {
                    showSnackbar("Export Succeeded!", "green");
                    $("#exportDirectory").addClass('yello');
                    $("#exportDirectory").val('');
                    $("#exportDirectory").removeClass('red');
                }
            });
        }
    },
});
