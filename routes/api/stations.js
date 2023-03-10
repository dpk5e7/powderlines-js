const router = require("express").Router();
const { getAllStations } = require("../../utils/snotel");

// The `/api/stations` endpoint
router.get("/", async (req, res) => {
  try {
    const state = req.query.state || "all";
    
    const data = await getAllStations(state);

    if (!data) {
      res.status(404).json({ message: "No data!" });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
