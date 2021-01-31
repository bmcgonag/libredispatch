

Template.mapViewDark.onRendered(function mapViewOnRendered() {
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';

    map = L.map('map', {}).setView([29.7947, -98.7320], 14);

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

    Tracker.autorun(function() {
        let mapPointLat = Session.get("mapPointLat");
        let mapPointLon = Session.get("mapPointLon");
        let callTypeMap = Session.get("callType");
        let callNoMap = Session.get("callNumber");
        let pointId = "mapPoint_" + callNoMap;

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
                return;
        } else {
            return;
        }
    });
});

Template.mapViewDark.events({
    'click .addUnitToCall' (event) {
        event.preventDefault();
        let thisId = event.currentTarget.id;
        console.log("Clicked the icon for: " + thisId);
    },
});
