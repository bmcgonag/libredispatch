import { Calls911 } from '../../../../imports/api/calls911.js';
import { Calls } from '../../../../imports/api/calls.js';
import { Entities } from '../../../../imports/api/entities.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { Meteor } from 'meteor/meteor';
import { Addresses } from '../../../../imports/api/addresses.js';

Template.demo911.onCreated(function() {
    this.subscribe('active911Calls');
    this.subscribe('activeCalls');
    this.subscribe('activeEntities');
    this.subscribe("errorLogs");
    this.subscribe("entityAddressesFull");
});

Template.demo911.onRendered(function() {
    $('select').formSelect();
});

Template.demo911.helpers({
    agencyEntities: function() {
        return _.uniq(Entities.find({}, { sort: { entityParent: 1 }}).fetch(), true, doc => {
            return doc.entityParent;
        });
    },
    live911Calls: function() {
        return Calls911.find({ status: "new", cfsActive: true });
    },
});

Template.demo911.events({
    'click #generate911Call' (event) {
        event.preventDefault();

        let my911id = this._id;
        let entity = $("#chooseEntity").val();
        let type = $("#callfromType").val();
        let aniOrRapid = $("#aniOrRapid").val();
        let newOrRebid = $("#newOrRebid").val();
        let cellOrLand = $("#cellOrLand").val();
        let cityName911 = $("#cityName911").val();
        console.log("cityName911: " + cityName911);

        let name;
        let phoneNo;
        let addressString;
        let latitude;
        let longitude;
        let accuracy;
        let elevation;

        let personNameArray = ["GEORGE MATUCZIAK", "SHERYL LYNN WALTON", "ESTHER ESPINOZA", "JEREMY LONGFELLOW", "ERICA KLAUSSEN", "GORDON WILLIAMSON", "LESTER JAMES CONWAY", "LORDON MALCOM", "LEVI LEGHETTI", "JERRY MARTIN", "LYNETTE SMITH", "SPENCEER INGRAM", "MARK NORTHCUTT", "DEBBIE TRAINOR", "BRIAN G MCGONAGILL", "HENRY D THOREUGH"];
        let businessNameArray = ["WAL-MART", "DOLLAR TREE", "DOLLAR GENERAL", "RUDY'S CAFE", "LITTLE LOT BREW HAUS", "AMBERLYNN", "SKY CAP AIRLINES", "MAIN STREET STATION", "LAST STOP CAFE", "HIGH AND MIGHTY COFFEE HOUSE", "LOWER LEFT", "RURAL RIGHT", "GIANT INVESTIGATIONS"];
        let phoneNoArray = ["(806)-555-2430", "(830)-241-2214", "(830)-226-5412", "(210)-211-2166", "(210)-409-2415", "(830)-408-3167", "(210)-544-6322", "(902)-357-1359", "(830)-565-2378", "(210)-953-4534", "(820)-457-9986", "(210)-434-7633", "(830)-609-7432"];
        let addressStringArray = ["802 W ORANGE BLOSSOM DR, BOERNE, TX", "419 EVEREST TRL, BOERNE, TX", "201 RIVER RD, BOERNE, TX", "1118 MAIN ST, BOERNE, TX", "607 MARY LOU BLVD, BOERNE, TX", "109 FAIR OAKS RANCH RD, FAIR OAKS RANCH, TX", "415 LAWRENCE ST, COMFORT, TX", "312 N MAIN ST, BOERNE, TX", "802 SHELDON AVE, COMFORT, TX", "912 HENRY ALLEN BLVD, FAIR OAKS RANCH, TX"];
        let landlinelatitude = 0;
        let landlinelongitude = 0;
        let lat = parseFloat(((Math.random() * (29.961245 - 29.781649)) + 29.781649).toFixed(6));
        let lon = parseFloat((((Math.random() * (98.914979 - 98.732671)) + 98.732671) * -1).toFixed(6));
        let anialiaccuracyArray = [105, 95, 90, 100, 102, 98, 101, 93, 94, 120];
        let rapidAccuracyArray = [10, 12, 8, 5, 2, 3, 1, 4, 2, 1, 1, 3, 4, 5, 6];
        let landlineelevation = 0;
        let rapidelevationArray = [15, 30, 42, 45, 58, 60, 62, 72, 80, 81, 101, 105, 115, 117];

        if (cityName911 == "" || cityName911 == null) {
            if (cellOrLand == "" || cellOrLand == null) {
                showSnackbar("You Must Specify if Cell or Landline", "red");
                return;
            } else if (cellOrLand == "Land" || cellOrLand == "VOIP") {
                if (type == "" || type == null) {
                    showSnackbar("You Must Select a Residential or Business Type for Landline / VOIP", "red");
                    return;
                } else if (type == "BUSN") {
                    let busno = Math.floor(Math.random() * 13);
                    name = businessNameArray[busno];
    
                    let addno = Math.floor(Math.random() * 10);
                    addressString = addressStringArray[addno];
    
                    latitude = landlinelatitude;
                    longitude = landlinelongitude;
                    elevation = landlineelevation;
                    accuracy = anialiaccuracyArray[addno];
                    phoneNo = phoneNoArray[addno];
                } else {
                    let personno = Math.floor(Math.random() * 16);
                    name = personNameArray[personno];
    
                    let addno = Math.floor(Math.random() * 10);
                    addressString = addressStringArray[addno];
    
                    latitude = landlinelatitude;
                    longitude = landlinelongitude;
                    elevation = landlineelevation;
                    accuracy = anialiaccuracyArray[addno];
                    phoneNo = phoneNoArray[addno];
                }
            } else {
                // it's a cell - so we presume person not business
                let personno = Math.floor(Math.random() * 16);
                name = personNameArray[personno];
    
                let addno = Math.floor(Math.random() * 10);
                addressString = addressStringArray[addno];
    
                let elev = Math.floor(Math.random() * 14);
                elevation = rapidelevationArray[elev];
    
                latitude = lat;
                longitude = lon;
                accuracy = rapidAccuracyArray[addno];
                phoneNo = phoneNoArray[addno];
            }
        } else {
            console.log("Going with the Address search.");
            let addInfo = Addresses.find({ cityName: cityName911, latitude: { $ne: 0 }, longitude: { $ne: 0 } }, { limit: 100 }).fetch();

            if (typeof addInfo != 'undefined' && addInfo != "" && addInfo != null) {
                let addno = Math.floor(Math.random() * 10);
                let personno = Math.floor(Math.random() * 16);
                name = personNameArray[personno];
    
                let addInfoPos = Math.floor(Math.random() * 99);
                latitude = addInfo[addInfoPos].latitude;
                longitude = addInfo[addInfoPos].longitude;
                addressString = addInfo[addInfoPos].addressString;
                accuracy = anialiaccuracyArray[addno];
                phoneNo = phoneNoArray[addno];
                let elev = Math.floor(Math.random() * 14);
                elevation = rapidelevationArray[elev];
                type = "RESD";
            }
        }

        if (entity == "" || entity == null) {
            showSnackbar("You Must Select an Entity!", "red");
            return;
        } else {
            Meteor.call('new.911Call', phoneNo, name, addressString, latitude, longitude, accuracy, elevation, type, entity, function(err, result) {
                if (err) {
                    console.log("Error generating demo 911 call: " + err);
                    showSnackbar("Error Generating Demo 911 Call!", "red");
                } else {
                    showSnackbar("Demo 911 Call Created Successfully!", "green");
                }
            });
        }
    },
});