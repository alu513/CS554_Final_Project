const tierRoutes = require("./tiers");
const userRoutes = require("./users");

const constructorMethod = app => {
  app.use("/tiers", tierRoutes);

  app.use("/users", userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "404 Not found" });
  });
};

module.exports = constructorMethod;
