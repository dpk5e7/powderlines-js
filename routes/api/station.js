const router = require("express").Router();
const { getStationInfo, getStationData } = require("../../utils/snotel");

// The `/api/station/:id` endpoint
router.get("/:id", async (req, res) => {
  try {
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
