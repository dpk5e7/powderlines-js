const express = require("express");
const path = require("path");
const cors = require("cors");
const routes = require("./routes");
const { ErrorHandler } = require("./utils/ErrorHandler");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public"))); // allows access to the css and js files on the client-side

app.use(cors());

app.use(routes);

app.use(ErrorHandler);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
