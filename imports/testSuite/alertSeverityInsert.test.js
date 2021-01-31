import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Entities } from '../api/entities.js';
import { AlertSeverity } from '../api/alertSeverity.js';
import { TestData } from './testData.js';
import { AssertionError } from 'chai/lib/chai';

const should = chai.should();
chai.use(sinonChai);

if (Meteor.isServer) {
    describe('Alert Severity', () => {
        // let's setup some testing necessities
        let userId;
        let sandbox;
        let subject;
        let subject2;

        // this will be run before each test.
        beforeEach(function() {
            sandbox = sinon.createSandbox();
            userId = Random.id();
            subject = Meteor.server.method_handlers.addAlertSeverity;
            subject2 = Meteor.server.method_handlers.changeAlertSeverity;
        });

        // this will be run after each test.
        afterEach(function() {
            AlertSeverity.remove({});
            sandbox.restore();
        });

        // define our method variables (fake data)  After // is constants we can use.
        const severityId = Random.id();
        const severityName = faker.hacker.adjective(); // 'Fake Severity Name';
        const severityColor = faker.commerce.color();    // '#ffee33';
        const textColor =  faker.commerce.color();   // '#ffe321';
        const isSystem = true;
        const isNotSystem = false;
        const severityName2 = 'Fake Severity Name';
        const severityColor2 = '#ffee33';
        const textColor2 =  '#ffe321';
        let entityInfo = {
            entityParent: "myParentEntity",
            usersEntity: "myEntity"
        };
        var users = {
            profile: {
                usersEntity: "myEntity",
            }
        }

        // in order to let the method know we are running a test, we need to pass this mode in (it's "production" for non-test use)
        const mode = "test";

        // put our test data into an array to pass during the test run
        let fakeInfo = [severityName, severityColor, textColor, isSystem];
        let fakeInfo2 = [severityId, severityName, severityColor, textColor, isSystem]
        let fakeInfo3 = [severityId, severityName2, severityColor2, textColor2, isNotSystem]
        let fakeInfo4 = {};

        // We are at our first test - is the user logged in (and no, so it should give an error.)
        it('Must be logged in to add new severites', function() {
            const context = {};
            let msg = '';

            try {
                const resultId = subject.apply(context, fakeInfo);
            } catch (err) {
                msg = err.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('[User is not authorized to add alert severity levels. Check to ensure you are logged in.]');
        });


        // Now we test if we can add a new alertSeverity entry.
        it('Inserts a new alert severity', async function() {
            const context =  { userId: userId };
            let msg = '';
            const newId = severityId;
            let resultId = '';
            sandbox.stub(AlertSeverity, 'findOne').returns(null);
            sandbox.stub(Meteor.users, 'findOne').returns("TestUser");
            sandbox.stub(Entities, 'findOne').returns("myEntity");
            sandbox.stub(entityInfo, 'entityParent').returns("ParentEnt");
            sandbox.stub(Meteor.users, 'profile').value("myEntity");
            sandbox.stub(AlertSeverity, 'insert').returns(newId);

            try {
                resultId = subject.apply(context, fakeInfo);
                console.log("");
                console.log("Result ID from Insert is: " + resultId);
                console.log("");
            } catch (err) {
                msg = err.message;
                console.log(msg);
            }

            // we expect to get a resultId, and a few parameters
            expect(resultId).to.equal(newId);
            const params = AlertSeverity.insert.args[0][0];
            expect(params.severityName).to.equal(severityName);
            expect(params.severityColor).to.equal(severityColor);
            expect(params.severityText).to.equal(textColor);
        });


        // We do our update collection test and first test must be logged in
        it('Must be logged in to update severities', function() {
            const context = {};
            let msg = '';

            try {
                const resultId = subject2.apply(context, fakeInfo2);
            } catch (err) {
                msg = err.message;
            }

            expect(msg, 'should throw not logged in').to.be.equal('[User is not authorized to update alert severity levels. Check to ensure you are logged in.]');
        });


        // We check for 'not found' during an update.
        it('Checks for Not Found in Update', async function () {
            const context = { userId: userId };
            let msg = '';
            sandbox.stub(AlertSeverity, 'findOne').returns(null)

            try {
                const resultId = subject2.apply(context, fakeInfo2);
            } catch (error) {
                msg = error.message;
            }

            expect(msg, 'should throw not found error').to.be.equal('[Severity level does not exist - cannot be updated!]');
        });

        
        // We check that it updates correctly
        it('Updates alert severity correctly', async function () {
            const context = { userId: userId };
            let msg = '';
            let resultId = '';
            let sId = Random.id();
            fakeInfo4._id = sId;
            fakeInfo4.severityName = severityName;
            fakeInfo4.severityColor = severityColor;
            fakeInfo4.severityText = textColor;
            fakeInfo4.isSystem = isNotSystem;
            fakeInfo4.severityEntityParent = "MyEntityParent";
            fakeInfo4.severityUserEntity = "MyUserEntity";
            fakeInfo4.editedBy = "TestUser";
            fakeInfo4.editedOn = new Date();
            fakeInfo4.mode = mode;

            sandbox.stub(AlertSeverity, 'findOne').returns(fakeInfo4);
            sandbox.stub(Meteor.users, 'findOne').returns("TestUser");
            sandbox.stub(AlertSeverity, 'update').returns(sId);

            try {
                resultId = subject2.apply(context, [fakeInfo4._id, fakeInfo4.severityName, fakeInfo4.severityColor, fakeInfo4.severityText, fakeInfo4.isSystem, fakeInfo4.mode]);
            } catch (error) {
                msg = error.message;
                // console.log('Error Give: ' + msg);
            }

            expect(resultId).to.equal(fakeInfo4._id);
            const params = AlertSeverity.update.args[0][1];
            expect(params.$set.severityName).to.equal(fakeInfo4.severityName);
            expect(params.$set.severityColor).to.equal(fakeInfo4.severityColor);
            expect(params.$set.severityText).to.equal(fakeInfo4.severityText);
        });
    });
}
