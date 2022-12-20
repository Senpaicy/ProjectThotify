const express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const configRoutes = require("./routes");


app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("../project-thotify/build"));

app.get("*", (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, '../project-thotify/build/index.html'));
});

configRoutes(app);

let port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`Running locally on: http://localhost:${port}`);
});

