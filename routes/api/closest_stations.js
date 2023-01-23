const router = require("express").Router();
const { getClosestStations } = require("../../utils/snotel");

// The `/api/closest_stations` endpoint
router.get("/", async (req, res) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : 39.7392; // Denver, CO
    const lng = req.query.lng ? parseFloat(req.query.lng) : -104.9903; // Denver, CO
    const days = req.query.days ? parseInt(req.query.days) : 5;
    const count = req.query.count ? parseInt(req.query.count) : 3;
    
    if (count > 5)
      count = 5;
    
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
