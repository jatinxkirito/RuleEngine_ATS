const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

before(async function () {
  this.timeout(30000); // Increase timeout for the connection
  try {
    await mongoose.connect(process.env.DATABASE_LINK, {
      useNewUrlParser: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
});

after(async function () {
  await mongoose.connection.close();
  console.log("Disconnected from MongoDB");
});
