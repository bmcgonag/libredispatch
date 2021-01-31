import { Commands } from '../../../../imports/api/commands.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Units } from '../../../../imports/api/units.js';

makePrimary = function(unitId, callSign, callNo, callId) {
    // first let's query for call and unit information
    let unitInfo = Units.findOne({ _id: unitId });
    let callInfo = Calls.findOne({ _id: callId });

    Meteor.call('call.changePrimary', callId, callSign, function(err, result){
        if (err) {
            showSnackbar("Error Chaning Primary Unit on Call!", "red");
            console.log("Error changing primary: " + err);
        } else {   
            showSnackbar("Primary Unit Changed to " + callSign + "!", "green");
        }
    });
}
