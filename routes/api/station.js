const router = require("express").Router();
const { getStationInfo, getStationData } = require("../../utils/snotel");

// The `/api/station/:id` endpoint

// Parameter 	Description
// ID (triplet) 	Station id in the form of ###:STATE:SNTL. Example: 791:WA:SNTL. Find the triplet for a particular station through the /stations endpoint.
// Days (integer) 	Number of days information to retrieve from today. (optional)
// Start date (YYYY-MM-DD) 	Historical date to pull data from. Use in conjunction with end date. (optional)
// End date (YYYY-MM-DD) 	Historical date to pull data from. Use in conjunction with start date (optional)

router.get("/:id", async (req, res) => {
  try {
    // id = params[:id] #672:WA:SNTL
    // days = params[:days] || 5
    // start_date = params[:start_date] || false
    // end_date = params[:end_date] || params[:start_date]
    // station = Station.find_by_triplet(id) || halt(404)

    // jsonp :station_information => station.attributes, :data => get_data(id, days, start_date, end_date)

    const id = req.params.id;
    const days = req.query.days ? parseInt(req.query.days) : 5;
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    const station = await getStationInfo(id);

    if (station) {
      const data = await getStationData(id, days, start_date, end_date);

      const jsonObj = {};
      jsonObj.station_information = station;
      jsonObj.data = JSON.parse(data);

      if (!data) {
        res.status(404).json({ message: "No data!" });
        return;
      }
      res.status(200).json(jsonObj);
      return;
    } else {
      res.status(404).json({ message: "No such station!" });
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
