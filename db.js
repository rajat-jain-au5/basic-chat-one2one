require("dotenv").config();


const mongoose = require("mongoose");
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    async (res) => {
      console.log("mongodb is connected succesfully");
    },
    (err) => {
      console.log("error in connection");
    }
  );