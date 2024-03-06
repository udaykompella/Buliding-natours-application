const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on('uncaughtException', err => {
  // console.log("UNHANDLED REJECTION! :( Shutting down ....");
  // console.log(err.name,err.message);
  process.exit(1);
})


const app = require("./app");
dotenv.config({ path: "./config.env" });

const DB =
  "mongodb+srv://kompellauday9:uday@cluster0.kp5pxnf.mongodb.net/NATOURS";

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);/
    console.log("db connection successful");
  });

// console.log(process.env);
const port = 4000;

const server = app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! :( Shutting down ....");
  console.log(err.name,err.message);
  server.close(() => {
    process.exit(1);
  });
});


