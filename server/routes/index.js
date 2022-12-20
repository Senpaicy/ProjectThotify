const spotifyRoutes = require("./spotifyApi");
const userRoutes = require("./users");
const imageRoutes = require("./images");
const constructorMethod = (app) => {
  app.use("/spotify", spotifyRoutes);
  app.use("/users", userRoutes);
  app.use("/images", imageRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Page not found" });
  });
};

module.exports = constructorMethod;
