import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const WreckerRotation = new Mongo.Collection("wreckerRotation");

WreckerRotation.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'rotation.add' (rotationType, towCapability, rotationFrequency, rotationService, rotationPosition) {
        check(rotationType, String);
        check(towCapability, String);
        check(rotationFrequency, String);
        check(rotationService, String);
        check(rotationPosition, Number);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add Wrecker Rotations.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        return WreckerRotation.insert({
            rotationType: rotationType,
            towCapability: towCapability,
            rotationFrequency: rotationFrequency,
            rotationService: rotationService,
            rotationPosition: rotationPosition,
            rotationUserEntity: userEntity,
            rotationParentEntity: parentEntity,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
        });
    },
    'Wrecker.movePosInRot' (newRotationObj) {

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to change Wrecker Rotation positions.');
        }

        for (i=0; i < newRotationObj.length; i++) {
            for (key in newRotationObj[i]) {
                let rotationId = key;
                let newRotPos = newRotationObj[i][key];
                // console.log(rotationId + ": " + newRotPos);
                WreckerRotation.update({ _id: rotationId }, {
                    $set: {
                        rotationPosition: newRotPos,
                    }
                });
            }
        }

    },
    'wrecker.removeFromRotation' (rotationId) {
        check(rotationId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to change Wrecker Rotation positions.');
        }

        return WreckerRotation.remove({ _id: rotationId });
    },
});
