import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Commands = new Mongo.Collection('commands');

Commands.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'newCmd.insert' (cmd, desc, args, system) {
        check(cmd, String);
        check(desc, String);
        check(args, String);
        check(system, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add commands.');
        }

        return Commands.insert({
            cmd: cmd,
            cmdDesc: desc,
            cmdArgsStruct: args,
            system: system,
            addedBy: Meteor.users.findOne(this.userId).username,
            addedOn: new Date(),
        });
    },
    'removeCmd.delete' (cmdId) {
        check(cmdId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete commands.');
        }

        return Commands.remove({ _id: cmdId });
    },
    'updateCmd.change' (cmdId, cmd, desc, args, system) {
        check(cmdId, String);
        check(cmd, String);
        check(desc, String);
        check(args, String);
        check(system, Boolean);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to edit commands.');
        }

        return Commands.update({ _id: cmdId }, {
            $set: {
                cmd: cmd,
                cmdDesc: desc,
                cmdArgsStruct: args,
                system: system,
                updatedBy: Meteor.users.findOne(this.userId).username,
                updatedOn: new Date(),
            }
        });
    },
});
