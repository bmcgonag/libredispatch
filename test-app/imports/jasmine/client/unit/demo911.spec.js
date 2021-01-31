import { expectTypes } from "chai/lib/chai/utils";

describe('Demo 911 Creation Template', function() {
    function helper(name) {
        return Template.demo911.helpers.firstCall.args[0][name];
    }

    before(function() {
        Calls911 = sinon.stub({
            find: function() {}
        }),
        Entities = sinon.stub({
            find: function() {}
        })
    });

    it('finds all entities', function() {
        helper('agencyEntities')();
        expect(Entities.find.calledOnce).toBeTruthy();
    });
});