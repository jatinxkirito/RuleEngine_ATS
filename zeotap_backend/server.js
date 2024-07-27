const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

mongoose
  .connect(process.env.DATABASE_LINK, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => console.error(err));
const app = require("./app.js");
app.listen(3000, () => {
  console.log("We are live");
});
