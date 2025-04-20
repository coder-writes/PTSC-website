const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const { MONGO_URI } = process.env;


const connectDb = async () => {
    await mongoose.connect(MONGO_URI);
}

module.exports = {connectDb};