const express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');

const app = express();
const configRoutes = require("./routes");

app.use(cors());

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

let port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`Running locally on: http://localhost:${port}`);
});
