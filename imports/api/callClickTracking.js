import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const CallClickTracking = new Mongo.Collection('callClickTracking');

CallClickTracking.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

// this is a logging table only.  It should not build beyond the number of unique users we have.

// Our publication will only give us the publish of our own personal clicks on calls.

// we use this to keep track of which call a user is wanting to see data for.  Basically
// to give them access to notes, etc, when they have split those widgets out of the main
// dispatch view.

// this will work with other views associated to that view as well as we add more.

Meteor.methods({
    'click.call' (callId) {
        check(callId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to view data based on call clicks. Make sure you are logged in.');
        }

        let myId = this.userId;

        let clickedBefore = CallClickTracking.findOne({ clickBy: myId });

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        if (clickedBefore) {
            // update
            return CallClickTracking.update({ _id: clickedBefore._id }, {
                $set: {
                    callId: callId,
                    clickedOn: new Date(),
                }
            });
        } else {
            // insert
            return CallClickTracking.insert({
                callId: callId,
                clickBy: myId,
                clickedOn: new Date(),
                clickParentEntity: parentEntity,
                clickMyEntity: userEntity,
            });
        }
    },
});