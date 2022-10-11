const mongoose = require("mongoose");

const connectdb = () => {
  mongoose.connect("mongodb://0.0.0.0:27017/test", () => {
    console.log("mongodb connected");
  });
};

module.exports = connectdb;
