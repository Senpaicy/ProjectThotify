const spotifyRoutes = require("./spotifyApi");
const userRoutes = require("./users");

const constructorMethod = (app) => {
  app.use("/spotify", spotifyRoutes);
  app.use("/users", userRoutes);
};

module.exports = constructorMethod;
