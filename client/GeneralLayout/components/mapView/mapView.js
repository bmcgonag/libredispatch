import { Calls } from '../../../../imports/api/calls.js';
import { UnitGeoPos } from '../../../../imports/api/unitGeoPosition.js';
import { UserSettings} from '../../../../imports/api/userSettings.js';
import { Calls911 } from '../../../../imports/api/calls911.js';

Template.mapView.onCreated(function() {
    this.subscribe('activeCalls');
    this.subscribe('activeUserSettings');
    this.subscribe('unitGeoPosInfo');
    this.subscribe('active911Calls');
});

Template.mapView.onRendered(function mapViewOnRendered() {
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';

    map = L.map('map', {}).setView([29.3786716, -100.8840723], 11);

    let unitmarker;
    let call911marker;

    L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);

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
        popupAnchor:  [18, -5] // point from which the popup should open relative to the iconAnchor
    });

    fireUnitIcon = L.icon({
        iconUrl: '/images/fire-shield-icon.png',
        iconSize:     [36, 36], // size of the icon
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
        popupAnchor:  [18, -5] // point from which the popup should open relative to the iconAnchor
    });

    emsUnitIcon = L.icon({
        iconUrl: '/images/ems-shield-icon.png',
        iconSize:     [36, 36], // size of the icon
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
        popupAnchor:  [18, -5] // point from which the popup should open relative to the iconAnchor
    });

    animalUnitIcon = L.icon({
        iconUrl: '/images/animal-shield-icon.png',
        iconSize:     [36, 36], // size of the icon
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
        popupAnchor:  [18, -5] // point from which the popup should open relative to the iconAnchor
    });

    towUnitIcon = L.icon({
        iconUrl: '/images/tow-truck-shield-icon.png',
        iconSize:     [36, 36], // size of the icon
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
        popupAnchor:  [18, -5] // point from which the popup should open relative to the iconAnchor
    });

    funeralUnitIcon = L.icon({
        iconUrl: '/images/hearse-shield-icon.png',
        iconSize:     [36, 36], // size of the icon
        iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
        popupAnchor:  [18, -5] // point from which the popup should open relative to the iconAnchor
    });

    icon911 = L.icon({
        iconUrl: '/images/cellphoneicon-small.png',
        iconSize: [36, 36], // size of the icon
        iconAnchor: [18, 18], // point of the icon which will correspond to 911 call location
        popupAnchor: [18, -5] // where our information pop-up comes from.
    });

    Tracker.autorun(function() {
        let unitAVL = UnitGeoPos.find({}).fetch();
        let incoming911call = Calls911.find({}).fetch();

        let mapPointLat = Session.get("mapPointLat");
        let mapPointLon = Session.get("mapPointLon");
        let callTypeMap = Session.get("callType");
        let callNoMap = Session.get("callNumber");
        let pointId = "cfs_" + callNoMap;

        if (mapPointLat != null && mapPointLat != "") {
            // console.log("Should be showing map point.");
            let priority = Session.get("markerPri");
            // console.log("Map Priority: " + priority);
            if (priority == 'High') {
                var marker = L.marker([mapPointLat, mapPointLon], {icon: callIconHigh}).addTo(map)
                    .bindPopup("<i class='material-icons addUnitToCall iconPointer' id='" + pointId + "'>add_circle</i><br /><strong>Call Type:</strong> " + callTypeMap + "<br/><strong>Call Number:</strong> " + callNoMap + "<br/><strong>Latitude:</strong> " + mapPointLat + ", <strong>Longitude:</strong> " + mapPointLon);
            } else if (priority == 'Medium') {
                var marker = L.marker([mapPointLat, mapPointLon], {icon: callIconMedium}).addTo(map)
                    .bindPopup("<i class='material-icons addUnitToCall iconPointer' id='" + pointId + "'>add_circle</i><br /><strong>Call Type:</strong> " + callTypeMap + "<br/><strong>Call Number:</strong> " + callNoMap + "<br/><strong>Latitude:</strong> " + mapPointLat + ", <strong>Longitude:</strong> " + mapPointLon);
            } else if (priority == 'Low') {
                var marker = L.marker([mapPointLat, mapPointLon], {icon: callIconLow}).addTo(map)
                    .bindPopup("<i class='material-icons addUnitToCall iconPointer' id='" + pointId + "'>add_circle</i><br /><strong>Call Type:</strong> " + callTypeMap + "<br/><strong>Call Number:</strong> " + callNoMap + "<br/><strong>Latitude:</strong> " + mapPointLat + ", <strong>Longitude:</strong> " + mapPointLon);
            } else {
                var marker = L.marker([mapPointLat, mapPointLon]).addTo(map)
                    .bindPopup("<i class='material-icons addUnitToCall iconPointer' id='" + pointId + "'>add_circle</i><br /><strong>Call Type:</strong> " + callTypeMap + "<br/><strong>Call Number:</strong> " + callNoMap + "<br/><strong>Latitude:</strong> " + mapPointLat + ", <strong>Longitude:</strong> " + mapPointLon);
            }
        }
        
        if (unitmarker) {
            map.removeLayer(unitmarker);
        }

        if (call911marker) {
            map.removeLayer(call911marker);
            map.removeLayer(confCircle);
        }

        let numUnitAVL = unitAVL.length;

        for (i = 0; i < numUnitAVL; i++) {
            unitmarker = L.marker([unitAVL[i].unitLat, unitAVL[i].unitLon], {icon: policeUnitIcon}).addTo(map)
                .bindTooltip("Unit: <strong>" + unitAVL[i].callSign + "</strong><br />Speed: <strong>" + unitAVL[i].unitSpeed + "</strong><br />Heading: <strong>" + unitAVL[i].unitHeading +"</strong>");
        }

        let num911Calls = incoming911call.length;

        if (num911Calls > 0) {
            for (j = 0; j < num911Calls; j++) {
                let point911Id = "911_" + incoming911call[j]._id;
                call911marker = L.marker([incoming911call[j].anialilatitude, incoming911call[j].anialilongitude], {icon: icon911}).addTo(map)
                    .bindPopup("<i class='material-icons makeCFS iconPointer' id='" + point911Id + "'>add_circle</i><br/><strong>Phone: </strong> " + incoming911call[j].anialiphoneNo + "<br /><strong>Caller: </strong>" + incoming911call[j].anialicallerName);
            
                let confRad = incoming911call[j].anialiaccuracy;
                let confCircle = L.circle(L.latLng(incoming911call[j].anialilatitude, incoming911call[j].anialilongitude), confRad, {
                    opacity: 0.1,
                    weight: 1,
                    fillOpacity: 0.25
                }).addTo(map);
            }
        }

        return;
    });
});

Template.mapView.events({
    'click .addUnitToCall' (event) {
        event.preventDefault();
        let thisId = event.currentTarget.id;
        console.log("Clicked the icon for: " + thisId);
        idParts = thisId.split('_');
        cfsId = idParts[1];
        console.log("CFS Id: " + cfsId);
    },
    'click .makeCFS' (event) {
        event.preventDefault();
        let thisId = event.currentTarget.id;
        console.log("Clicked the icon for: " + thisId);
        idParts = thisId.split('_');
        id911 = idParts[1];
        console.log("911 Id: " + id911);
        createCallFrom911(id911);
    },
});
