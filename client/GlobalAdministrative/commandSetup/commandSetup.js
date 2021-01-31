import { Commands } from '../../../imports/api/commands.js';
import { UserSettings } from '../../../imports/api/userSettings.js';

Template.commandSetup.onCreated(function() {
    this.subscribe('activeCommands');
    this.subscribe("activeUserSettings");
});

Template.commandSetup.onRendered(function() {
    $('.modal').modal();
    Session.set("entryMode", "new");
});

Template.commandSetup.helpers({
    commandItems: function() {
        return Commands.find({});
    },
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.commandSetup.events({
    'click #saveCommand' (event) {
        event.preventDefault();

        let cmd = $("#cmdActual").val();
        let desc = $("#cmdDesc").val();
        let args = $("#cmdArgsStructure").val();
        let system = $("#systemCmdCode").is(':checked');
        let userEntity = Session.get("myEntity");
        let parentEntity = Session.get("myParentEntity");

        if (cmd == "" || cmd == null || desc == "" || desc == null || args == "" || args == null) {
            showSnackbar("All fields are required!", "red");
        } else {
            let currentMode = Session.get("entryMode");
            if (currentMode == "new") {
                Meteor.call('newCmd.insert', cmd, desc, args, system, userEntity, parentEntity, function(err, result) {
                    if (err) {
                        console.log("Error adding new command: " + err);
                        showSnackbar("Error adding new Command!", "red");
                    } else {
                        showSnackbar("New Command Added Successfully!", "green");
                        $("#cmdActual").val("");
                        $("#cmdDesc").val("");
                        $("#cmdArgsStructure").val("");
                        $('#systemCmdCode').prop('checked', false);

                        $("#cmdActual").focus();

                    }
                });
            } else if (currentMode == "edit") {
                let cmdId = Session.get("commandEditId");
                Meteor.call('updateCmd.change', cmdId, cmd, desc, args, system, userEntity, parentEntity, function(err, result) {
                    if (err) {
                        console.log("Error adding new command: " + err);
                        showSnackbar("Error adding new Command!", "red");
                    } else {
                        showSnackbar("Command Updated Successfully!", "green");
                        $("#cmdActual").val("");
                        $("#cmdDesc").val("");
                        $("#cmdArgsStructure").val("");
                        $('#systemCmdCode').prop('checked', false);

                        $("#cmdActual").focus();

                    }
                });
            }

        }
        Session.set("entryMode", "new");
    },
    'click #cancelSaveCommand' (event) {
        event.preventDefault();

        Session.set("entryMode", "new");

        // now handle clearing the fields.
        $("#cmdActual").val("");
        $("#cmdDesc").val("");
        $("#cmdArgsStructure").val("");
        $('#systemCmdCode').prop('checked', false);

        $("#cmdActual").focus();
    },
    'click .removeCommandItem' (event) {
        event.preventDefault();

        // first get the "id" info together to send up to the modal and pass to the
        // final action function

        let itemId = this._id;
        Session.set("eventConfirmNecessaryId", itemId);
        Session.set("eventConfirmCallBackFunction", "deleteCommand");

        // now set two other information sections
        // 1. the header / title of the modal
        Session.set("confirmationDialogTitle", "Delete Command");

        // 2. the content information of the modal
        Session.set("confirmationDialogContent", "You are about to delete a Command-Line Command.  Please confirm this action.");

        // console.log("delete clicked");

        $("#confirmationDialog").modal('open');
    },
    'click .editCommandItem' (event) {
        event.preventDefault();
        Session.set("entryMode", "edit");

        let itemId = this._id;
        Session.set("commandEditId", itemId);

        let commandInfo = Commands.findOne({ _id: itemId });

        $("#cmdActual").val(commandInfo.cmd);
        $("#cmdDesc").val(commandInfo.cmdDesc);
        $("#cmdArgsStructure").val(commandInfo.cmdArgsStruct);

        if (commandInfo.system == true) {
            $('#systemCmdCode').prop('checked', true);
        } else {
            $('#systemCmdCode').prop('checked', false);
        }

        Materialize.updateTextFields();
    },
    'mouseover .infoRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        let settings = UserSettings.findOne({});
        if (settings) {
            myRow.style.background = settings.themeHighlight;
            myRow.style.color = settings.themeHighlightText;
        }
    },
    'mouseout .infoRow' (event) {
        let myRow = document.getElementById(event.currentTarget.id);
        myRow.style.background = "";
        myRow.style.color = "";
    },
});

deleteCommand = function(itemId) {
    Meteor.call("removeCmd.delete", itemId, function(err, result) {
        if (err) {
            console.log("Error deleting command: " + err);
            showSnackbar("Error Deleting Command!", "red");
        } else {
            showSnackbar("Command Deleted Successfully!", "green");
        }
    });
}
