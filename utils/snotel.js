const { json } = require("express");
const path = require("path");

module.exports = {
  getAllStations: async () => {
    const filePath = path.join(__dirname, "../data/snotelStations.json");
    const stations = require(filePath);
    return stations;
  },

  getStationInfo: async (id) => {
    const filePath = path.join(__dirname, "../data/snotelStations.json");
    const stations = require(filePath);
    const station = stations.filter((station) => station.triplet === id);
    if (station.length > 0) {
      return station[0];
    } else {
      return null;
    }
  },

  getClosestStations: async (lat, lng, count, days, data) => {
    const filePath = path.join(__dirname, "../data/snotelStations.json");
    const stations = require(filePath);

    stations.sort((a, b) => {
      const aDistance = getDistanceAsCrowFlies(
        [a.location.lng, a.location.lat],
        [lng, lat]
      );
      const bDistance = getDistanceAsCrowFlies(
        [b.location.lng, b.location.lat],
        [lng, lat]
      );

      return aDistance - bDistance;
    });

    const closestStations = stations.slice(0, count);

    const jsonStations = [];

    for (let station of closestStations) {
      const jsonObj = {};
      jsonObj.station_information = station;

      if (data) {
        const stationData = await getSnowData(station.triplet, days);
        jsonObj.data = JSON.parse(stationData);
      }

      jsonStations.push(jsonObj);
    }

    return jsonStations;
  },

  getStationData: async (
    id,
    days = 5,
    start_date = false,
    end_date = false
  ) => {
    return await getSnowData(id, days, start_date, end_date);
  },
};

async function getSnowData(id, days = 5, start_date = false, end_date = false) {
  //triplet = "672:WA:SNTL";

  let date = "";

  if (start_date) {
    date = `${start_date},${end_date}`;
  } else {
    date = `-${days}`;
  }

  var requestOptions = {
    method: "GET",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      //"Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "follow", // manual, *follow, error
    //referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  };

  let apiUrl = `https://wcc.sc.egov.usda.gov/reportGenerator/view_csv/customSingleStationReport/daily/${id}%7Cid%3D%22%22%7Cname/${date}%2C0/WTEQ%3A%3Avalue%2CWTEQ%3A%3Adelta%2CSNWD%3A%3Avalue%2CSNWD%3A%3Adelta%2CTOBS%3A%3Avalue`;

  const response = await fetch(apiUrl, requestOptions);
  const data = await response.text();

  const lines = data.split("\n");
  let filteredLines = lines.filter((line) => line.indexOf("#") != 0);
  filteredLines = filteredLines.filter((line) => line.trim() != "");

  filteredLines[0] = filteredLines[0].replace(
    "Snow Water Equivalent (in) Start of Day Values",
    "Snow Water Equivalent (in)"
  );

  filteredLines[0] = filteredLines[0].replace(
    "Snow Depth (in) Start of Day Values",
    "Snow Depth (in)"
  );

  filteredLines[0] = filteredLines[0].replace(
    "Air Temperature Observed (degF) Start of Day Values",
    "Observed Air Temperature (degrees farenheit)"
  );

  let jsonDays = [];

  const keys = filteredLines[0].split(",");

  for (let k = 1; k < filteredLines.length; k++) {
    let obj = {};

    if (filteredLines[k]) {
      const values = filteredLines[k].split(",");
      for (let j = 0; j < keys.length; j++) {
        obj[keys[j]] = values[j];
      }

      jsonDays.push(obj);
    } else {
      return null;
    }
  }

  const jsonObj = JSON.stringify(jsonDays);

  return jsonObj;
}

// Modified from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceAsCrowFlies(start, end) {
  var R = 3960; // Radius of the earth in miles
  var dLat = deg2rad(end[1] - start[1]); // deg2rad below
  var dLon = deg2rad(end[0] - start[0]);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(start[1])) *
      Math.cos(deg2rad(end[1])) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in miles
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
