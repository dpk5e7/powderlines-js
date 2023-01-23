const router = require("express").Router();

router.use("/station", require("./station"));
router.use("/stations", require("./stations"));
router.use("/closest_stations", require("./closest_stations"));

module.exports = router;
