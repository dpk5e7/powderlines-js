const router = require("express").Router();
const { getClosestStations } = require("../../utils/snotel");

// The `/api/closest_stations` endpoint

// Parameter 	Description
// lat (float) 	Latitude to base search off of. (required)
// lng (float) 	Longitude to base search off of. (required)
// data (boolean) 	Setting to true will enable fetching of snow info from the stations. Note that this might be slow depending on the number of stations you're requesting information from.
// days (integer) 	Number of days information to retrieve from today. (optional)
// count (integer) 	number of station's to return (optional - defaults to 3, maximum of 5)


/**
 * Find a single tag by its `id` including its associated Product data
 */
router.get("/", async (req, res) => {
  try {
    // lat = params[:lat] ? params[:lat].to_f : halt(400)
    // lng = params[:lng] ? params[:lng].to_f : halt(400)
    // days = params[:days] ? params[:days].to_i : 5
    // count = params[:count] ? params[:count].to_i : 3
    // # limit count to 10
    // if count > 10
    //   count = 10
    // end
    // # data determines whether we fetch snow data for the stations
    // data = params[:data] == 'true' ? true : false

    // stations = Array.new

    // Station.all.each do |station|
    //   distance = Haversine.distance(lat, lng, station.location["lat"].to_f, station.location["lng"].to_f).to_miles
    //   stations << {
    //     :station_information => station.attributes,
    //     :distance => distance
    //   }
    // end

    // stations = stations.sort_by{|x| x[:distance] }.take(count)

    // if data
    //   stations.each do |station|
    //     station[:data] = get_data(station[:station_information]["triplet"], days)
    //   end
    // end

    // jsonp stations

    const lat = req.query.lat ? parseFloat(req.query.lat) : 39.7392; // Denver, CO
    const lng = req.query.lng ? parseFloat(req.query.lng) : -104.9903; // Denver, CO
    const days = req.query.days ? parseInt(req.query.days) : 5;
    const count = req.query.count ? parseInt(req.query.count) : 3;
    
    if (count > 10)
      count = 10;
    
    const data = req.query.data == "true" ? true : false;

    const stations = await getClosestStations(lat, lng, count, days, data);

    if (!stations) {
      res.status(404).json({ message: "No data!" });
      return;
    }

    res.status(200).json(stations);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
