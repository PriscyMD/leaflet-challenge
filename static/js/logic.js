

// // Creating our initial map object:
// //We insert the center and starting zoom level

let myMap = L.map("map", {center: [30,-100], zoom: 4});

// // Add a title layer to our map

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Convert the circle markers bigger
function getRadius(magnitude) {
    return magnitude * 3;
}

// Create a function to generate the color of the circle depending on the depth of the earthquake

function getColor(depth) {
    return depth > 90 ? 'red' :
           depth > 70 ? 'orangered' :
           depth > 50 ? 'orange' :
           depth > 30 ? 'gold' :
           depth > 10 ? 'yellowgreen' :
           depth <= 10 ? 'limegreen' :
           'black';
}

// Creating a function to add the earthquake data to the map

function addEarthquakeData(data) {
    for (let i=0; i < data.features.length; i++){

        // Keep the Json information together to create the markers

        let coords = data.features[i].geometry.coordinates;

        let lon = coords[0];
        let lat = coords[1];
        let depth = coords[2];

        let properties = data.features[i].properties;
        let magnitude = properties.mag;
        let place = properties.place;

        // Collected data in a circle for each earthquake

        L.circleMarker([lat, lon],{
            radius: getRadius(magnitude),
            fillColor: getColor(depth),
            color: 'black',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7 
        }).bindPopup(`<b>Location:</b> ${place}<br><b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth} km`).addTo(myMap);
    }
}

// Function to create the legend

function createLegend() {
    let legend = L.control({ position: 'bottomright'});

    legend.onAdd = function(myMap){
        var div = L.DomUtil.create('div', 'legend');
        var grades = [-10, 10, 30, 50, 70, 90];
        var colors = ['limegreen', 'yellowgreen', 'gold', 'orange', 'orangered', 'red'];

        div.innerHTML += '<b>Earthquake Depth (km)</b><br>';

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
}

// Fetching data from the USGS API

fetch(url)
.then(response => response.json())
.then(data => {
    addEarthquakeData(data);
    createLegend();
});
