import { UserSettings} from '../../../../imports/api/userSettings.js';
import { UnitGeoPos } from '../../../../imports/api/unitGeoPosition.js';

Template.mapViewLarge.onCreated(function() {
    this.subscribe('activeUserSettings');
    this.subscribe('unitGeoPosInfo');
});

Template.mapViewLargeDark.onRendered(function mapViewLargeOnRendered() {
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';

    map = L.map('map', {}).setView([29.789178, -98.724780], 14);

    let unitmarker;
    let myunitmarker

    L.tileLayer.provider('CartoDB.DarkMatter').addTo(map);

    let color = Session.get("markerColor");

    callIconHigh = L.AwesomeMarkers.icon({
        markerColor: 'red'
    });

    callIconMedium = L.AwesomeMarkers.icon({
        markerColor: 'yellow'
    });

    callIconLow = L.AwesomeMarkers.icon({
        markerColor: 'green'
    });

    policeUnitIcon = L.icon({
        iconUrl: '/images/police-shield-icon.png',
        iconSize:     [36, 36], // size of the icon
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
        popupAnchor:  [40, 0] // point from which the popup should open relative to the iconAnchor
    });

    Tracker.autorun(function() {
        let unitAVL = UnitGeoPos.find({}).fetch();
        let mapPointLat = Session.get("mapPointLat");
        let mapPointLon = Session.get("mapPointLon");
        let callTypeMap = Session.get("callType");
        let callNoMap = Session.get("callNumber");
        let myUnitPos = Session.get("myUnitCoords");
        let myUnitLat = myUnitPos.lat;
        let myUnitLon = myUnitPos.lon;
        let myUnitHeading = myUnitPos.unitHeading;
        let myUnitSpeed = myUnitPos.unitSpeed;
        let myCallSign = Session.get("userCallSign");

        if (mapPointLat != null && mapPointLat != "") {
            // console.log("Should be showing map point.");
            let priority = Session.get("markerPri");
            // console.log("Map Priority: " + priority);
            if (priority == 'High') {
                var marker = L.marker([mapPointLat, mapPointLon], {icon: callIconHigh}).addTo(map)
                    .bindTooltip("<strong>Call Type:</strong> " + callTypeMap + "<br/><strong>Call Number:</strong> " + callNoMap + "<br/><strong>Latitude:</strong> " + mapPointLat + ", <strong>Longitude:</strong> " + mapPointLon);
            } else if (priority == 'Medium') {
                var marker = L.marker([mapPointLat, mapPointLon], {icon: callIconMedium}).addTo(map)
                    .bindTooltip("<strong>Call Type:</strong> " + callTypeMap + "<br/><strong>Call Number:</strong> " + callNoMap + "<br/><strong>Latitude:</strong> " + mapPointLat + ", <strong>Longitude:</strong> " + mapPointLon);
            } else if (priority == 'Low') {
                var marker = L.marker([mapPointLat, mapPointLon], {icon: callIconLow}).addTo(map)
                    .bindTooltip("<strong>Call Type:</strong> " + callTypeMap + "<br/><strong>Call Number:</strong> " + callNoMap + "<br/><strong>Latitude:</strong> " + mapPointLat + ", <strong>Longitude:</strong> " + mapPointLon);
            } else {
                var marker = L.marker([mapPointLat, mapPointLon]).addTo(map)
                    .bindTooltip("<strong>Call Type:</strong> " + callTypeMap + "<br/><strong>Call Number:</strong> " + callNoMap + "<br/><strong>Latitude:</strong> " + mapPointLat + ", <strong>Longitude:</strong> " + mapPointLon);
            }   
        }

        if (myunitmarker) {
	        map.removeLayer(myunitmarker);
        }
        
        if (unitmarker) {
            map.removeLayer(unitmarker);
        }

        let numUnitAVL = unitAVL.length;
        
        for (i = 0; i < numUnitAVL; i++) {
            if (unitAVL[i].callSign != myCallSign) {
                unitmarker = L.marker([unitAVL[i].unitLat, unitAVL[i].unitLon], {icon: policeUnitIcon}).addTo(map)
                .bindTooltip("Unit: <strong>" + unitAVL[i].callSign + "</strong><br />Speed: <strong>" + unitAVL[i].unitSpeed + "</strong><br />Heading: <strong>" + unitAVL[i].unitHeading +"</strong>");
            }
        }
        
        myunitmarker = L.marker([myUnitLat, myUnitLon], {icon: policeUnitIcon}).addTo(map)
            .bindTooltip("Unit: <strong>" + myCallSign + "</strong><br />Speed: <strong>" + myUnitSpeed + "</strong><br />Heading: <strong>" + myUnitHeading +"</strong>");
        
        return;
    });
});

Template.mapViewLargeDark.helpers({
    mySettings: function() {
        let mine = UserSettings.findOne({});
        if (mine.mobileCallListPosition == "Top" || mine.mobileCallListPosition == "Bottom") {
            return "topBottom";
        } else { 
            return "leftRight";
        }
    },
});

Template.mapViewLargeDark.events({

});