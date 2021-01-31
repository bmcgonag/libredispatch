import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const TenantSetup = new Mongo.Collection('tenantSetup');

TenantSetup.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'set.tenantSettings' (navColor, ISMile, transMile, alwaysRunNo, assignSelf, deAssignSelf, isSystem) {
        check(navColor, String);
        check(ISMile, Boolean);
        check(transMile, Boolean);
        check(alwaysRunNo, Boolean);
        check(assignSelf, Boolean);
        check(deAssignSelf, Boolean);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to set tenant settings.');
        }

        // before we insert a new tenant setup, let's see if the tenant has a setup
        // already in place. If so, then let's edit that setup instead.

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        let tenantSetups = TenantSetup.findOne({ parentEntity: parentEntity });

        if (tenantSetups) {
            // we need to push this over to the edit method
            let settingId = tenantSetups._id;

            Meteor.call('change.tenantSettings', settingId, navColor, ISMile, transMile, alwaysRunNo, assignSelf, deAssignSelf, isSystem, function(err, result) {
                if (err) {
                    console.log("Error trying to call the update method from the insert method for tenantSetup: " + err);
                }
            });
        } else {
            // we can continue with the Insert method.
            TenantSetup.insert({
                navBarColor: navColor,
                ISMileReq: ISMile,
                transMileReq: transMile,
                alwaysRunNo: alwaysRunNo,
                assignSelf: assignSelf,
                deAssignSelf: deAssignSelf,
                isSystem: isSystem,
                userEntity: userEntity,
                parentEntity: parentEntity,
                setBy: Meteor.users.findOne(this.userId).username,
                setOn: new Date(),
            });
        }
    },
    'change.tenantSettings' (settingId, navColor, ISMile, transMile, alwaysRunNo, assignSelf, deAssignSelf, isSystem) {
        check(settingId, String);
        check(navColor, String);
        check(ISMile, Boolean);
        check(transMile, Boolean);
        check(alwaysRunNo, Boolean);
        check(assignSelf, Boolean);
        check(deAssignSelf, Boolean);
        check(isSystem, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to set tenant settings.');
        }

        TenantSetup.update({ _id: settingId }, {
            $set: {
                navBarColor: navColor,
                ISMileReq: ISMile,
                transMileReq: transMile,
                alwaysRunNo: alwaysRunNo,
                assignSelf: assignSelf,
                deAssignSelf: deAssignSelf,
                isSystem: isSystem,
                updatedBy: Meteor.users.findOne(this.userId).username,
                updatedOn: new Date(),
            }
        });
    },
});