import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const DND = new Mongo.Collection('dndTracking');

DND.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

// this is a logging table. We should clear this table anytime we can, and only keep
// a certain number of logged drag and drop actions.  Let's say 10,000. 

// Our publication will only give us the publish of our Entities incomplete
// drag and drop actions (so those happening pretty much now);

// we can use that in the UI to keep users from dual dragging and dropping if needed.
// right now we have checks to show the unit has already been assigned to the same call, 
// and subsequenst drags should queue a unit.

Meteor.methods({
    'start.dnd' (dragUnitId) {
        check(dragUnitId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to drag and drop units. Please make sure you are signed in.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return DND.insert({
            unitDragged: dragUnitId,
            dndBy: this.userId,
            dndStartOn: new Date(),
            complete: false,
            dndParentEntity: parentEntity,
            dndMyEntity: userEntity,
        });
    },
    'complete.dnd' (dndId, dropCallId) {
        check(dndId, String),
        check(dropCallId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to drop units on calls. Please make sure you are logged in.');
        }

        return DND.update({ _id: dndId }, {
            $set: {
                callDroppedOn: dropCallId,
                complete: true,
                dropDate: new Date(),
            }
        });
    },
    'end.dnd' (dndId) {
        check(dndId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to drop units on calls. Please make sure you are logged in.');
        }

        return DND.update({ _id: dndId }, {
            $set: {
                dragEnd: new Date(),
                complete: true,
            }
        });
    },
});