const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.use((req, res) => {
  res.send("<h1>These aren't the PowderLines you're looking for.</h1>");
});

module.exports = router;
