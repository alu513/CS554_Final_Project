const express = require("express");
const app = express();
const configRoutes = require("./routes");
const cors = require("cors");

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || origin === "http://localhost:3000") {
        cb(null, true);
      } else {
        console.log(`Origin ${origin} rejected by CORS`);
        cb(new Error("Disallowed by CORS policy"));
      }
    }
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configRoutes(app);

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on https://localhost:4000");
});
