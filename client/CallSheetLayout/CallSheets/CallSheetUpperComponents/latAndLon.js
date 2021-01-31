import { Addresses } from '../../../../imports/api/addresses.js';

Template.latAndLon.onCreated(function() {
    this.subscribe("entityAddresses");
});

Template.latAndLon.onRendered(function() {

});

Template.latAndLon.helpers({
    callLocSet: function() {
      return Session.get("callLocSet");
    },
    callLatLon: function() {
        let callLocSet = Session.get("callLocSet");
        if (callLocSet == true) {
            let callLoc = Session.get("callLoc");
            let addInfo = Addresses.findOne({ addressString: callLoc });
            if (addInfo) {
                let lat = addInfo.latitude;
                let lon = addInfo.longitude;
                let latLon = lat + ", " + lon;
                return latLon;
            }
        }
    },
    from911: function() {
        return Session.get("from911");
    },
    latLonFrom911: function() {
        let from911 = Session.get("from911");
        if (from911 == true) {
            let coordinates = Session.get("coordFrom911");

            let lat = coordinates.latitude;
            let lon = coordinates.longitude;
    
            let latLon = lat + ", " + lon;
            return latLon;
        }
    },
});

Template.latAndLon.events({
    'focusout #latAndLonInfo' (event) {
        let latAndLonInfo = $("#latAndLonInfo").val();
        console.log("lat and lon: " + latAndLonInfo);
        Session.set("latAndLonInfo", latAndLonInfo);
    },
});