const express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
const app = express();
const configRoutes = require("./routes");

app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

let port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`Running locally on: http://localhost:${port}`);
});
