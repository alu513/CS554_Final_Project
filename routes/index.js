const tierRoutes = require("./users");
const userRoutes = require("./tiers");

const constructorMethod = app => {
  app.use("/", tierRoutes);
  app.use("/users", userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "404 Not found" });
  });
};

module.exports = constructorMethod;
