//section:global variables go here 👇
let map;
var markers;

//section:functions and event handlers go here 👇
// This function initializes the map
function initMap() {
  let lat = "41.91562";
  let lon = "-113.41154";
  let view = 5;
  map = L.map("map").setView([lat, lon], view);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  markers = L.layerGroup().addTo(map);
}

// This function displays the SNOTEL markers in Colorado
async function displaySNOTELMarkers() {
  const SNOTELIcon = L.Icon.extend({
    options: {
      iconUrl: "./images/blue-dot.png",
      shadowUrl: "./images/msmarker.shadow.png",
      iconSize: [32, 32],
      shadowSize: [59, 32],
      iconAnchor: [16, 32],
      shadowAnchor: [16, 32],
      tooltipAnchor: [10, -24],
    },
  });

  let stationIcon = new SNOTELIcon();

  var markerOptions = {
    icon: stationIcon,
    riseOnHover: true,
  };

  var toolTipOptions = {
    offset: [0, 0],
    direction: "right",
    opacity: 0.8,
  };

  for (station of snotelStations) {
    var marker = L.marker(
      [station.location.lat, station.location.lng],
      markerOptions
    ).addTo(markers);

    marker.bindTooltip(`<h5>${station.name}</h5>`, toolTipOptions);

    function markerClick(event) {
      const clickedStation = snotelStations.find(
        (element) =>
          element.location.lat === event.latlng.lat &&
          element.location.lng === event.latlng.lng
      );

      // Initial popup text with indeterminate progress bar
      let popupText = `<p><h5>SNOTEL: ${clickedStation.name}</h5>
                ID: ${clickedStation.triplet}<br />
                Elevation: ${clickedStation.elevation} ft</p>`;

      let popupOptions = {
        autoPan: true,
        keepInView: true,
        offset: [0, -24],
      };

      let popup = L.popup(popupOptions)
        .setLatLng({
          lat: clickedStation.location.lat,
          lng: clickedStation.location.lng,
        })
        .setContent(popupText)
        .openOn(map);

      displayClickedSNOTELDataInPopup(clickedStation.triplet, popup);
    }
    marker.addEventListener("click", markerClick);
  }
}

// This function fetches and displays the SNOTEL data in the popup.
async function displayClickedSNOTELDataInPopup(triplet, popup) {
  const snowData = await getStationData(triplet);

  // Data is:
  // {
  //   station_information: {
  //     name: "Loveland Basin",
  //     triplet: "602:CO:SNTL",
  //     elevation: 11427,
  //     location: {
  //       lat: 39.67428,
  //       lng: -105.90264,
  //     },
  //     distance: "0.50",
  //   },
  //   data: [
  //     {
  //       Date: "2023-01-26",
  //       "Snow Water Equivalent (in)": "10.6",
  //       "Change In Snow Water Equivalent (in)": "0.1",
  //       "Snow Depth (in)": "46",
  //       "Change In Snow Depth (in)": "1",
  //       "Observed Air Temperature (degrees farenheit)": "0.1",
  //     },
  //   ],
  // }

  // Update the popup text with SNOTEL data
  popupText = `<p><h5>SNOTEL: ${snowData.station_information.name}</h5>
                ID: ${snowData.station_information.triplet}<br />
                Elevation: ${snowData.station_information.elevation} ft<br />
                Snow Depth: ${snowData.data[0]["Snow Depth (in)"]}"<br />
                Change In Snow Depth: ${snowData.data[0]["Change In Snow Depth (in)"]}"<br />
                Air Temperature: ${snowData.data[0]["Observed Air Temperature (degrees farenheit)"]} \xB0F</p>
              `;

  popup.setContent(popupText);
}

// This function is the initial starting point of operation
async function init() {
  try {
    initMap();

    displaySNOTELMarkers();

    //throw "Map Error";
  } catch (error) {
    launchValidationModal("Map Error", error, "Map");
  }
}
init();
