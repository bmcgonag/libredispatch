import { Dispos } from '../../../imports/api/dispositions.js';
import { ErrorLogs } from '../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.dispositionSetup.onCreated(function() {
    this.subscribe('activeDispostions');
    this.subscribe('errorLogs');
    this.subscribe('activeUserSettings');
});

Template.dispositionSetup.onRendered(function() {
    $('input#dispoAbbrev, input#dispoText').characterCounter();
    $('.tooltipped').tooltip();
    $('.modal').modal();
});

Template.dispositionSetup.helpers({
    getActiveDispostions: function() {
        let myEntity = Session.get("myEntity");
        let myParent = Session.get("myParentEntity");
        console.log("entity for dispos: " + myParent);
        return Dispos.find({ parentEntity: myParent });
    },
    isActiveDispo: function() {
        if (this.active == true) {
            return "checked";
        } else {
            return false;
        }
    },
    dispoMode: function() {
        return Session.get("dispoMode");
    },
    dispoEditInfo: function() {
        let mode = Session.get("dispoMode");
        
        if (mode == 'edit') {
            let dispoId = Session.get("dispoId");
            return Dispos.findOne({ _id: dispoId });
        }
    },
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.dispositionSetup.events({
    'click .saveDisposition' (event) {
        event.preventDefault();

        let dispo_abbrev = $("#dispoAbbrev").val();
        let dispo_text = $("#dispoText").val();
        let systemDispo = $("#systemDispo").prop('checked');

        if (dispo_abbrev == "" || dispo_abbrev == null || dispo_text == "" || dispo_text == null) {
            showSnackbar("Disposition Abbreviation and Text are required!", "red");
        } else {
            Meteor.call('disposition.add', dispo_abbrev, dispo_text, systemDispo, function(err, result) {
                if (err) {
                    showSnackbar("Error Adding Dispositon!", "red");
                    console.log("Error adding disposition: " + err);
                    Meteor.call("Log.Errors", "dispositionSetup.js", "click .saveDisposition", err, function(error, results) {
                        if (err0r) {
                            console.log("Error while logging error from dispostionSetup.js: " + error);
                        }
                    });
                } else {
                    showSnackbar("Disposition Added Successfully!", "green");
                    $("#dispoAbbrev").val("");
                    $("#dispoText").val("");
                    $("#systemDispo").prop('checked', false);
                    Session.set("dispoMode", "add");
                }
            });
        }
    },
    'click .changeDisposition' (event) {
        event.preventDefault();
        let dispoId = Session.get("dispoId");

        let dispo_abbrev = $("#dispoAbbrev").val();
        let dispo_text = $("#dispoText").val();
        let systemDispo = $("#systemDispo").prop('checked');

        if (dispo_abbrev == "" || dispo_abbrev == null || dispo_text == "" || dispo_text == null) {
            showSnackbar("Disposition Abbreviation and Text are required!", "red");
        } else {
            Meteor.call('disposition.change', dispoId, dispo_abbrev, dispo_text, systemDispo, function(err, result) {
                if (err) {
                    showSnackbar("Error Adding Dispositon!", "red");
                    console.log("Error adding disposition: " + err);
                    Meteor.call("Log.Errors", "dispositionSetup.js", "click .changeDisposition", err, function(error, results) {
                        if (err0r) {
                            console.log("Error while logging error from dispostionSetup.js: " + error);
                        }
                    });
                } else {
                    showSnackbar("Disposition Added Successfully!", "green");
                    $("#dispoAbbrev").val("");
                    $("#dispoText").val("");
                    Session.set("dispoMode", "add");
                    $("#systemDispo").prop('checked', false);
                }
            });
        }
    },
    'click .cancelAddDisposition' (event) {
        event.preventDefault();

        $("#dispoAbbrev").val("");
        $("#dispoText").val("");
        Session.set("dispoMode", "add");
        $("#systemDispo").prop('checked', false);
    },
    'click .deleteDisposition' (event) {
        event.preventDefault();
        Session.set("dispoMode", 'add');

        let dispoId = this._id;

        Session.set("confirmationDialogTitle", "Confirm - Delete Disposition");
        Session.set("confirmationDialogContent", "You are about to delete a Disposition from the system. Note: Deleting this disposition will not remove it from archived Calls for Service.  This action will only make this disposition unavailable for selection moving forward.  Do you wish to continue?");
        Session.set("eventConfirmCallBackFunction", "deleteThisDispo");
        Session.set("eventConfirmNecessaryId", dispoId);

        $("#confirmationDialog").modal('open');
    },
    'click .editDispositionList' (event) {
        event.preventDefault();

        let dispoId = this._id;

        Session.set("dispoMode", 'edit');
        Session.set("dispoId", dispoId);
    },
    'click #copySystemDispos' (event) {
        event.preventDefault();
        let myId = Meteor.userId();
        if (Roles.userIsInRole(myId, ['GlobalAdmin'])) {
            showSnackbar("You Appear to be a Global Admin. This function is not for Global Entity Use.", "orange");
            return;
        } else {
            let i = 0;
            Meteor.call("copy.callDispos", i);
        }
    },
    'mouseover .infoRow' (event) {
        let myRow = document.getElementById(this._id);
        let settings = UserSettings.findOne({});
        if (settings) {
            myRow.style.background = settings.themeHighlight;
            myRow.style.color = settings.themeHighlightText;
        }
    },
    'mouseout .infoRow' (event) {
        let myRow = document.getElementById(this._id);
        myRow.style.background = "";
        myRow.style.color = "";
    },
});

deleteThisDispo = function(dispoId) {
    Meteor.call('disposition.delete', dispoId, function(err, result) {
        if (err) {
            showSnackbar("Error Deleting Disposition", 'red');
            console.log("Error deleting didsposition: " + err);
            Meteor.call("Log.Errors", "dispositionSetup.js", "deleteThisDispo function", err, function(error, results) {
                if (err0r) {
                    console.log("Error while logging error from dispostionSetup.js: " + error);
                }
            });
        } else {
            showSnackbar("Disposition Deleted Successfully!", "green");
            Session.set("dispoMode", 'add');
        }
    });
}
