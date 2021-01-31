import { UserSettings } from '../../imports/api/userSettings.js';

Template.userSettings.onCreated(function() {
    this.subscribe('activeUserSettings');
});

Template.userSettings.onRendered(function() {
    $('.tabs').tabs();
    $('select').formSelect();
});

Template.userSettings.helpers({
    userPrefs: function() {
        return UserSettings.findOne({});
    },
});

Template.userSettings.events({
    'click .saveMySettings' (event) {
        event.preventDefault();

        // ****  get dispatch view settings below.
        let unitsGridLayout = $("#unitsGridLayout").val();
        let callsGridPopOut = $("#callsGridPopout").val();
        let notesAndMap = $("#notesAndMap").val();
        let unitsGridExpandDefault = $("#unitsGridExpandDefault").is(':checked');
        let callsGridExpandDefault = $("#callsGridExpandDefault").is(':checked');
        let callsOnTop = $("#callsGridOnTop").is(':checked');
        let showEntity = $("#showEntity").is(':checked');
        let alertDisplayWanted = $("#alertDisplayWanted").val();
        let alertDisplayStolen = $("#alertDisplayStolen").val();
        let alertDisplayDanger = $("#alertDisplayDanger").val();
        let alertDisplayInfo = $("#alertDisplayInfo").val();
        let showAssignedCall = $("#showAssignedCall").prop('checked');
        let showAssignedLocation = $("#showAssignedLocation").prop('checked');
        let show911Grid = $("#show911Grid").val();

        // ****  get mobile settings below
        let callListPositionMobile = $("#callListPosition").val();
        let growCallOnExpand = $("#growCallOnExpand").prop('checked');
        let headerCallDateTime = $("#headerCallDateTime").prop('checked');
        let headerCallAddress = $("#headerCallAddress").prop('checked');
        let headerPriorityText = $("#headerPriorityText").prop('checked');
        let bodyCallDateTime = $("#bodyCallDateTime").prop('checked');
        let bodyCallAddress = $("#bodyCallAddress").prop('checked');
        let bodyPriorityText = $("#bodyPriorityText").prop('checked');
        let bodyResponseTable = $("#bodyResponseTable").prop('checked');
        let mobileTabOrder = $("#mobileTabOrder").val();

        // ****  get overall theme settings below
        let themeOverall = $("#themeDarkOrLight").val();
        // console.log("Theme = " + themeOverall);
        let themeBackground = "";
        let themeTextColor = "";
        let highlight = "";
        let textHighlight = "";
        let themeBGhex = "";
        let themeTexthex = "";
        let themeHighlight = "";
        let themeHighlightText = "";

        if (themeOverall == "Custom") {
            themeColor = $("#themeBackground").val();

            let themeSplit = themeColor.split('|');

            // console.log("Val themeBackground: " + themeBackground);

            // now we need to check that the user isn't picking colors that aren't separate enough
            if (themeColor == "" || themeColor == null) {
                showSnackbar("You Must Select Background and Text Colors for the Custom option!", "red");
                return;
            }

            themeBackground = themeSplit[0];
            themeTextColor = themeSplit[1];
            highlight = themeSplit[2];
            textHighlight = themeSplit[3];
            themeBGhex = themeSplit[4];
            themeTexthex = themeSplit[5];
            themeHighlight = themeSplit[6];
            themeHighlightText = themeSplit[7];

            // just use this little section if to check that you get the hex colors you expect
            // without submitting the data to the collection. 
            // ***********************************************************************
            // if (true == true) {
            //     console.log("Background: " + themeBackground);
            //     console.log("Text Color: " + themeTextColor);
            //     console.log("BG Hex code: " + themeBGhex);
            //     console.log("Text Hex: " + themeTexthex);
            //     console.log("Highlight: " + themeHighlight);
            //     console.log("Highlight Text: " + themeHighlightText);
            //     return;
            // }

        } else if (themeOverall == "Dark") {
            themeBackground = 'black';
            themeTextColor = 'white-text';
            highlight = 'grey darken-3';
            textHighlight = 'blue darken-1';
            themeBGhex = '#000000';
            themeTexthex = '#ffffff;';
            themeHighlight = "#424242";
            themeHighlightText = "#1e88e5";
        }
        

        // let's set some default values in case the user doesn't pick something in drop-downs
        if (unitsGridLayout == '' || unitsGridLayout == null) {
            unitsGridLayout = "Left";
        }
        
        if (callsGridPopOut == '' || callsGridPopOut == null) {
            callsGridPopOut = "No";
        }

        if (notesAndMap == '' || notesAndMap == null) {
            notesAndMap = "Notes Left";
        }

        if (alertDisplayWanted == '' || alertDisplayWanted == null) {
            alertDisplayWanted = 'Pop-up And Overlay';
        }

        if (alertDisplayStolen == '' || alertDisplayStolen == null) {
            alertDisplayStolen = 'Pop-up And Overlay';
        }

        if (alertDisplayDanger == '' || alertDisplayDanger == null) {
            alertDisplayDanger = 'Pop-up And Overlay';
        }

        if (alertDisplayInfo == '' || alertDisplayInfo == null) {
            alertDisplayInfo = 'Pop-up And Overlay';
        }

        if (callListPositionMobile == '' || callListPositionMobile == null) {
            callListPositionMobile = 'Left';
        }

        if (mobileTabOrder == '' || mobileTabOrder == null) {
            mobileTabOrder = "Response, Notes, Alerts";
        }

        if (themeOverall == '' || themeOverall == null) {
            themeOverall == "Light";
        }

        // console.log(callsGridPopOut);

        Meteor.call('updateUserSettings', Meteor.userId(), unitsGridLayout, callsGridPopOut, notesAndMap, unitsGridExpandDefault, callsGridExpandDefault, callsOnTop, showEntity, alertDisplayWanted, alertDisplayStolen, alertDisplayDanger, alertDisplayInfo, showAssignedCall, showAssignedLocation, show911Grid, callListPositionMobile, growCallOnExpand, themeOverall, themeBackground, themeTextColor, highlight, textHighlight, themeBGhex, themeTexthex, themeHighlight, themeHighlightText, headerCallAddress, headerCallDateTime, headerPriorityText, bodyCallAddress, bodyCallDateTime, bodyPriorityText, bodyResponseTable, mobileTabOrder, function(err, result) {
            if (err) {
                showSnackbar("Error Saving User Settings!", "red");
                console.log("Error Saving User Settings: " + err);
            } else {
                showSnackbar("User Settings Saved Successfully!", "green");
            }
        });
    },
});

Template.dispatchSettingsTab.helpers({
    mySettings: function() {
        return UserSettings.findOne({});
    },
});


// **********************************************************
// Mobile Settings Tab Helpers and Events
// **********************************************************

Template.mobileSettingsTab.helpers({
    myMobileSettings: function() {
        return UserSettings.findOne({});
    },
});

// **********************************************************
// Overall Settings Tab Helpers and Events
// **********************************************************

Template.overallSettingsTab.helpers({
    myOverallSettings: function() {
        return UserSettings.findOne({});
    },
    showColorPickers: function() {
        let show = Session.get("showColorPickers");
        if (show == true) {
            setTimeout(function() {
                $('select').formSelect();
            }, 150);
            return true;
        } else {
            return false;
        }
    },
});

Template.overallSettingsTab.events({
    'change #themeDarkOrLight' (event) {
        let selection = $("#themeDarkOrLight").val();

        if (selection == 'Custom') {
            Session.set("showColorPickers", true);
        } else {
            Session.set("showColorPickers", false);
        }
    },
});
