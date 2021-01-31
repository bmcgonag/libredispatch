import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const Messages = new Mongo.Collection('messages');

Messages.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
// ****************************************************************************************
//
// Insert a Message
//
// ****************************************************************************************
    'message.insert' (type, sender, senderId, receiver, receiverId, messageText, alertMsg, ticker) {
        // type : individual or group - if group, then receiver and receiverId will be from Entity collection
        // sender: user sending the message
        // receiver: group or user recieving the message
        // messageText: the message text sent out
        // alertMsg: boolean - is this an alert type of message
        // ticker: boolean - this message should shown in ticker - only for Alert Messages

        check(type, String);
        check(sender, String);
        check(senderId, String);
        check(receiver, String);
        check(receiverId, String);
        check(messageText, String);
        check(alertMsg, Boolean);
        check(ticker, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to send messages.');
        }

        return Messages.insert({
            msgType: type,
            sender: sender,
            senderId: senderId,
            receiver: receiver,
            receiverId: receiverId,
            messageText: messageText,
            alertMsg: alertMsg,
            tickerMsg: ticker,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
        });
    },
});
