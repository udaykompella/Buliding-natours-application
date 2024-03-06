const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('./../../models/TourModel')
const Review = require("./../../models/reviewModel");
const User = require("./../../models/UserModel");
const fs = require("fs");

const DB =
  "mongodb+srv://kompellauday9:uday@cluster0.kp5pxnf.mongodb.net/NATOURS";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log("db connection successful");
  });
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

//import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data successfully loaded");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
//import data into db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data succesfully deleted");
    process.exit();
  } catch (error) {}
};
console.log(process.argv)

if(process.argv[2] == '--import'){
    importData()
}else if(process.argv[2] == '--delete'){
    deleteData()
}