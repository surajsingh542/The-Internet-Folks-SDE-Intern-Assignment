const mongoose = require("mongoose");

// connect
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected Successfully.");
  } catch (error) {
    console.log("DB Connection Failed", error.message);
    process.exit(1);
  }
};

dbConnect();
