import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Entities = new Mongo.Collection('entities');

Entities.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'insert.newEntity' (entityName, isGlobalEntity, entityType, entityParent, entityORI, entityPhone, entityAddress) {
        try {
            console.log('Got to Entity Entry Method.');
            check(entityName, String);
            check(isGlobalEntity, Boolean);
            check(entityType, String);
            check(entityParent, String);
            check(entityORI, String);
            check(entityPhone, String);
            check(entityAddress, String);
    
            if (!this.userId) {
                throw new Meteor.Error('User is not authorized to add Entity information.');
            }
    
            if (isGlobalEntity == true) {
                let numGlobalEntities = Entities.find({ globalEntity: true }).count();
                if (numGlobalEntities >= 1) {
                    let newGE = Entities.findOne({ globalEntity: true });
                    let geID = newGE._id;
                    Meteor.call('removeGlobal.entity', geID, function(err, result) {
                        if (err) {
                            console.log('Error removing Global flag from ' + newGE.entityName);
                        } else {
                            console.log('Creating a new entity now as: ' + entityName);
                            return Entities.insert({
                                entityName: entityName,
                                globalEntity: isGlobalEntity,
                                entityType: entityType,
                                entityParent: entityParent,
                                entityORI: entityORI,
                                entityPrimaryPhone: entityPhone,
                                entityPrimaryAddress: entityAddress,
                                active: true,
                                deleted: false,
                                addedBy: Meteor.users.findOne(this.userId).username,
                                addedOn: new Date(),
                            });
                        }
                    });
                } else {
                    console.log('Creating a new entity now as: ' + entityName);
                    return Entities.insert({
                        entityName: entityName,
                        globalEntity: isGlobalEntity,
                        entityType: entityType,
                        entityParent: entityParent,
                        entityORI: entityORI,
                        entityPrimaryPhone: entityPhone,
                        entityPrimaryAddress: entityAddress,
                        active: true,
                        deleted: false,
                        addedBy: Meteor.users.findOne(this.userId).username,
                        addedOn: new Date(),
                    });
                }
            } else {
                console.log('Creating a new entity now as: ' + entityName);
                return Entities.insert({
                    entityName: entityName,
                    globalEntity: isGlobalEntity,
                    entityType: entityType,
                    entityParent: entityParent,
                    entityORI: entityORI,
                    entityPrimaryPhone: entityPhone,
                    entityPrimaryAddress: entityAddress,
                    active: true,
                    deleted: false,
                    addedBy: Meteor.users.findOne(this.userId).username,
                    addedOn: new Date(),
                });
            }
        } catch (error) {
            console.log('Error adding entity: ' + error);
        }
    },
    'removeGlobal.entity' (entityId) {
        check(entityId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add Entity information.');
        }

        return Entities.update({ _id: entityId }, {
            $set: {
                globalEntity: false,
            }
        });
    },
    'delete.entity' (entityId) {
        check(entityId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add Entity information.');
        }

        return Entities.remove({ _id: entityId });
    },
});
