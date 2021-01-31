import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const Persons = new Mongo.Collection('persons');

Persons.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'person.add' (fname, lname, mname, suffix, title, dob, ssn, dlnum, dlstate, addString, addId, hair, eyes, hgt, wgt, jrn, miscidNum, foreignSysId, alias, tattoos, scars, marks, phonecell, phonehome, email, socialmediaNicks, pob, alerts, primaryContactName) {
        check(fname, String);
        check(lname, String);
        check(mname, String);
        check(suffix, String);
        check(title, String);
        check(dob, Date);
        check(ssn, String);
        check(dlnum, String);
        check(dlState, String);
        check(addString, String);
        check(addId, String);
        check(hair, String);
        check(eyes, String);
        check(hgt, String);
        check(wgt, Number);
        check(jrn, String);
        check(miscidNum, String);
        check(foreignSysId, String);
        check(alias, Object);
        check(tattoos, Object);
        check(scars, Object);
        check(marks, Object);
        check(phoneCell, String);
        check(phoneHome, String);
        check(email, String);
        check(socialmediaNicks, Object);
        check(pob, String);
        check(alerts, Object);
        check(primaryContactName, Object);

        // items listed as objects above should have key: value pairs to define the object.

        return Persons.insert({
            fname: fname,
            mname: mname,
            lname:lname, 
            suffix: suffix,
            title: title,
            dob: dob,
            ssn: ssn,
            dlnum: dlnum,
            dlState: dlState,
            addString: addString,
            addId: addId,
            hair: hair,
            eyes: eyes,
            hgt: hgt,
            wgt: wgt,
            jrn: jrn,
            miscidNum: miscidNum,
            foreignSysId: foreignSysId,
            alias: [{
                aliasName: aliasName,
                aliasPersonId: aliasPersonId,
            }],
            tattoos: [{
                tattooDesc: tattooDesc,
                tattooBodyLoc: tattooBodyLoc,
            }],
            scars: [{
                scarDesc: scarDesc,
                scarBodyLoc: scarBodyLoc,
            }],
            marks: [{
                markDesc: markDesc,
                markBodyLoc: markBodyLoc,
            }],
            phoneCell: phoneCell,
            phoneHome: phoneHome,
            emailAdd: email,
            pob: pob,
            socialmediaNicks: [{
                site: site,
                nick: nick,
            }],
            primaryContactName: [{
                primaryName: primaryName,
                primaryPersonId: primaryPersonId,
            }],
            alerts: [{
                alertSeverity: alertSeverity,
                alertType: alertType,
                alertDesc: alertDesc,
                alertExpires: alertExpires,
            }],
            current: true,
        });
    },
});