import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const UserSettings = new Mongo.Collection("userSettings");

UserSettings.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'setDefaultUserSettings' (usersId) {
        check(usersId, String);

        return UserSettings.insert({
            userId: usersId,
            username: Meteor.users.findOne(usersId).username,
            unitsGridLayout: "Left",
            unitsGridExpandDefault: false,
            unitsGridParked: true,
            callsGridPopOut: "No",
            notesAndMap: "Notes Left",
            callsGridExpandDefault: false,
            callsGridOnTop: false,
            alerts: {
                Wanted: "Pop-up And Overlay",
                Stolen: "Pop-up And Overlay",
                Danger: "Pop-up And Overlay",
                Info: "Overlay",
            },
            mobileCallListPosition: "Left",
            themeOverall: "Light",
            themeBackground: "",
            themeTextColor: "",
            active: true,
        });
    },
    'updateUserSettings' (usersId, unitsGridLayout, callsGridPopOut, notesAndMap, unitsGridExpandDefault, callsGridExpandDefault, callsGridOnTop, showEntity, alertsWanted, alertsStolen, alertsDanger, alertsInfo, showAssignedCall, showAssignedLocation, show911Grid, mobileCallListPosition, growCallOnExpand, themeOverall, themeBackground, themeTextColor, highlight, textHighlight, themeBGhex, themeTexthex, themeHighlight, themeHighlightText, headerCallAddress, headerCallDateTime, headerPriorityText, bodyCallAddress, bodyCallDateTime, bodyPriorityText, bodyResponseTable, mobileTabOrder) {
        check(usersId, String);
        check(unitsGridLayout, String);
        check(callsGridPopOut, String);
        check(notesAndMap, String);
        check(unitsGridExpandDefault, Boolean);
        check(callsGridExpandDefault, Boolean);
        check(callsGridOnTop, Boolean);
        check(showEntity, Boolean);
        check(alertsWanted, String);
        check(alertsStolen, String);
        check(alertsDanger, String);
        check(alertsInfo, String);
        check(showAssignedCall, Boolean);
        check(showAssignedLocation, Boolean);
        check(mobileCallListPosition, String);
        check(growCallOnExpand, Boolean);
        check(themeOverall, String);
        check(themeBackground, String);
        check(themeTextColor, String);
        check(highlight, String);
        check(textHighlight, String);
        check(themeBGhex, String);
        check(themeTexthex, String);
        check(themeHighlight, String);
        check(themeHighlightText, String);
        check(headerCallAddress, Boolean);
        check(headerCallDateTime, Boolean);
        check(headerPriorityText, Boolean);
        check(bodyCallAddress, Boolean);
        check(bodyCallDateTime, Boolean);
        check(bodyPriorityText, Boolean);
        check(bodyResponseTable, Boolean);
        check(mobileTabOrder, String);
        check(show911Grid, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized get defaults.');
        }

        let exists = UserSettings.findOne({ userId: usersId });

        if (exists) {
            // console.log("---------- **********    Exists    ********** --------------");
            return UserSettings.update({ userId: usersId }, {
                $set: {
                    userId: usersId,
                    username: Meteor.users.findOne(this.userId).username,
                    unitsGridLayout: unitsGridLayout,
                    unitsGridParked: true,
                    callsGridPopOut: callsGridPopOut,
                    notesAndMap: notesAndMap,
                    unitsGridExpandDefault: unitsGridExpandDefault,
                    callsGridExpandDefault: callsGridExpandDefault,
                    callsGridOnTop: callsGridOnTop,
                    showEntity: showEntity,
                    alerts: {
                        Wanted: alertsWanted,
                        Stolen: alertsStolen,
                        Danger: alertsDanger,
                        Info: alertsInfo,
                    },
                    showAssignedCall: showAssignedCall,
                    showAssignedLocation: showAssignedLocation,
                    show911Grid: show911Grid,
                    mobileCallListPosition: mobileCallListPosition,
                    growCallOnExpand: growCallOnExpand,
                    headerCallAddress: headerCallAddress,
                    headerCallDateTime: headerCallDateTime,
                    headerPriorityText: headerPriorityText,
                    bodyCallAddress: bodyCallAddress,
                    bodyCallDateTime: bodyCallDateTime,
                    bodyPriorityText: bodyPriorityText,
                    bodyResponseTable: bodyResponseTable,
                    mobileTabOrder: mobileTabOrder,
                    themeOverall: themeOverall,
                    themeBackground: themeBackground,
                    themeTextColor: themeTextColor,
                    highlight: highlight,
                    textHighlight: textHighlight,
                    themeBGhex: themeBGhex,
                    themeTexthex: themeTexthex,
                    themeHighlight: themeHighlight,
                    themeHighlightText: themeHighlightText,
                    active: true,
                }
            });
        } else {
            // console.log('not updating the settings.');
            return UserSettings.insert({
                userId: usersId,
                username: Meteor.users.findOne(this.userId).username,
                unitsGridLayout: unitsGridLayout,
                unitsGridParked: true,
                callsGridPopOut: callsGridPopOut,
                notesAndMap: notesAndMap,
                unitsGridExpandDefault: unitsGridExpandDefault,
                callsGridExpandDefault: callsGridExpandDefault,
                callsGridOnTop: callsGridOnTop,
                showEntity: showEntity,
                alerts: {
                    Wanted: alertsWanted,
                    Stolen: alertsStolen,
                    Danger: alertsDanger,
                    Info: alertsInfo,
                },
                showAssignedCall: showAssignedCall,
                showAssignedLocation: showAssignedLocation,
                show911Grid: show911Grid,
                mobileCallListPosition: mobileCallListPosition,
                growCallOnExpand: growCallOnExpand,
                headerCallAddress: headerCallAddress,
                headerCallDateTime: headerCallDateTime,
                headerPriorityText: headerPriorityText,
                bodyCallAddress: bodyCallAddress,
                bodyCallDateTime: bodyCallDateTime,
                bodyPriorityText: bodyPriorityText,
                bodyResponseTable: bodyResponseTable,
                mobileTabOrder: mobileTabOrder,
                themeOverall: themeOverall,
                themeBackground: themeBackground,
                themeTextColor: themeTextColor,
                highlight: highlight,
                textHighlight: textHighlight,
                themeBGhex: themeBGhex,
                themeTexthex: themeTexthex,
                themeHighlight: themeHighlight,
                themeHighlightText: themeHighlightText,
                active: true,
            });
        }
    },
    'unitsGrid.unpark' () {
        if (!this.userId) {
            throw new Meteor.Error('User is not authorized get defaults.');
        }

        let usersId = Meteor.userId();

        return UserSettings.update({ userId: usersId }, {
            $set: {
                unitsGridParked: false,
            }
        });
    },
    'unitsGrid.park' () {
        if (!this.userId) {
            throw new Meteor.Error('User is not authorized get defaults.');
        }

        let usersId = Meteor.userId();

        return UserSettings.update({ userId: usersId }, {
            $set: {
                unitsGridParked: true,
            }
        });
    },
    'notesGrid.unpark' () {
        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to unpark notes.');
        }

        let usersId = Meteor.userId();

        return UserSettings.update({ userId: usersId }, {
            $set: {
                notesGridParked: false,
            }
        });
    },
    'notesGrid.park' () {
        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to park notes.');
        }

        let usersId = Meteor.userId();

        return UserSettings.update({ userId: usersId }, {
            $set: {
                notesGridParked: true,
            }
        });
    }
});
